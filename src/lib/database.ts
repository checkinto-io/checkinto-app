import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import type {
	Event,
	Meetup,
	Venue,
	Talent,
	Attendee,
	AttendeeInput,
	CheckInResponse,
	CheckInFormData,
	FormErrors
} from './types.js';
import { VALIDATION_RULES } from './types.js';

// Initialize Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Database service functions
export class DatabaseService {
	/**
	 * Get event by URL ID with related data
	 */
	static async getEventByUrlId(urlId: string): Promise<Event | null> {
		try {
			const { data, error } = await supabase
				.from('event')
				.select(`
					*,
					meetup:meetup_id (*),
					venue:venue_id (*),
					presenter:presenter_id (*),
					workshop_lead:workshop_lead_id (*),
					meetup_host:meetup_host_id (*)
				`)
				.eq('url_id', urlId)
				.eq('active', true)
				.single();

			if (error) {
				// Handle specific error cases
				if (error.code === 'PGRST116') {
					console.warn(`Event not found or inactive: ${urlId}`);
				} else if (error.message?.includes('foreign key')) {
					console.error(`Foreign key constraint issue for event: ${urlId}`, error);
				} else {
					console.error('Error fetching event:', error);
				}
				return null;
			}

			// Validate that required relationships exist
			if (!data.meetup || !data.venue || !data.presenter || !data.workshop_lead || !data.meetup_host) {
				console.error(`Event ${urlId} is missing required relationships:`, {
					hasMeetup: !!data.meetup,
					hasVenue: !!data.venue,
					hasPresenter: !!data.presenter,
					hasWorkshopLead: !!data.workshop_lead,
					hasMeetupHost: !!data.meetup_host
				});
				return null;
			}

			return data;
		} catch (err) {
			console.error('Unexpected error in getEventByUrlId:', err);
			return null;
		}
	}

	/**
	 * Create or update attendee (upsert)
	 */
	static async upsertAttendee(attendeeData: AttendeeInput): Promise<Attendee | null> {
		const { data, error } = await supabase
			.from('attendee')
			.upsert(attendeeData, { 
				onConflict: 'email',
				ignoreDuplicates: false 
			})
			.select()
			.single();

		if (error) {
			console.error('Error upserting attendee:', error);
			return null;
		}

		return data;
	}

	/**
	 * Link attendee to event
	 */
	static async linkAttendeeToEvent(eventId: string, attendeeId: string): Promise<boolean> {
		const { error } = await supabase
			.from('event_attendee')
			.upsert({ 
				event_id: eventId, 
				attendee_id: attendeeId 
			}, {
				onConflict: 'event_id,attendee_id',
				ignoreDuplicates: true
			});

		if (error) {
			console.error('Error linking attendee to event:', error);
			return false;
		}

		return true;
	}

	/**
	 * Complete check-in process (upsert attendee + link to event)
	 */
	static async checkInAttendee(
		eventId: string, 
		attendeeData: AttendeeInput
	): Promise<CheckInResponse> {
		try {
			// Check if attendee is already registered for this event
			const isAlreadyRegistered = await this.isEmailRegisteredForEvent(eventId, attendeeData.email);
			
			// First, upsert the attendee
			const attendee = await this.upsertAttendee(attendeeData);
			
			if (!attendee) {
				return { 
					success: false, 
					error: 'Failed to save attendee information'
				};
			}

			// Then link to event
			const linked = await this.linkAttendeeToEvent(eventId, attendee.id);
			
			if (!linked) {
				return { 
					success: false, 
					error: 'Failed to complete check-in process'
				};
			}
			
			return { 
				success: true, 
				attendee,
				isExistingAttendee: isAlreadyRegistered
			};
		} catch (error) {
			console.error('Error in checkInAttendee:', error);
			return { 
				success: false, 
				error: 'An unexpected error occurred during check-in'
			};
		}
	}

	/**
	 * Validate check-in form data
	 */
	static validateCheckInForm(formData: CheckInFormData): FormErrors {
		const errors: FormErrors = {};

		// First name validation
		if (!formData.first_name.trim()) {
			errors.first_name = 'First name is required';
		} else if (formData.first_name.length > VALIDATION_RULES.FIRST_NAME_MAX_LENGTH) {
			errors.first_name = `First name must be ${VALIDATION_RULES.FIRST_NAME_MAX_LENGTH} characters or less`;
		}

		// Last name validation
		if (!formData.last_name.trim()) {
			errors.last_name = 'Last name is required';
		} else if (formData.last_name.length > VALIDATION_RULES.LAST_NAME_MAX_LENGTH) {
			errors.last_name = `Last name must be ${VALIDATION_RULES.LAST_NAME_MAX_LENGTH} characters or less`;
		}

		// Email validation
		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (formData.email.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) {
			errors.email = `Email must be ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters or less`;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
		}

		// Interesting fact validation
		if (!formData.interesting_fact.trim()) {
			errors.interesting_fact = 'Interesting fact is required';
		} else if (formData.interesting_fact.length > VALIDATION_RULES.INTERESTING_FACT_MAX_LENGTH) {
			errors.interesting_fact = `Interesting fact must be ${VALIDATION_RULES.INTERESTING_FACT_MAX_LENGTH} characters or less`;
		}

		return errors;
	}

	/**
	 * Check if email is already registered for this event
	 */
	static async isEmailRegisteredForEvent(eventId: string, email: string): Promise<boolean> {
		try {
			const { data, error } = await supabase
				.from('event_attendee')
				.select('attendee!inner(email)')
				.eq('event_id', eventId)
				.eq('attendee.email', email)
				.limit(1);

			if (error) {
				console.error('Error checking email registration:', error);
				return false; // Assume not registered on error to allow submission
			}

			return data && data.length > 0;
		} catch (err) {
			console.error('Error in email registration check:', err);
			return false; // Assume not registered on error to allow submission
		}
	}

	/**
	 * Test database connection
	 */
	static async testConnection(): Promise<boolean> {
		try {
			const { error } = await supabase
				.from('event')
				.select('count')
				.limit(1);

			return !error;
		} catch (err) {
			console.error('Database connection test failed:', err);
			return false;
		}
	}

	/**
	 * Check if a logo file exists
	 */
	static async logoExists(filename: string, type: 'meetup' | 'presenter'): Promise<boolean> {
		if (!filename) return false;
		
		// Import image utilities dynamically to avoid SSR issues
		const { imageExists, IMAGE_CATEGORIES } = await import('$lib/utils/imagePaths');
		
		// Map old types to new categories
		const category = type === 'meetup' ? IMAGE_CATEGORIES.GROUP : IMAGE_CATEGORIES.TALENT;
		
		return await imageExists(filename, category);
	}

	/**
	 * Get logo path if file exists, otherwise return null
	 */
	static async getLogoPath(filename: string | null, type: 'meetup' | 'presenter'): Promise<string | null> {
		if (!filename) return null;
		
		// Import image utilities dynamically to avoid SSR issues
		const { getImagePathSafe, IMAGE_CATEGORIES } = await import('$lib/utils/imagePaths');
		
		// Map old types to new categories
		const category = type === 'meetup' ? IMAGE_CATEGORIES.GROUP : IMAGE_CATEGORIES.TALENT;
		
		return await getImagePathSafe(filename, category);
	}

	/**
	 * Get event with validated logo paths
	 */
	static async getEventWithValidatedLogos(urlId: string): Promise<Event | null> {
		try {
			const event = await this.getEventByUrlId(urlId);
			if (!event) return null;

			// Validate meetup logo if it exists
			if (event.meetup?.logo) {
				const logoPath = await this.getLogoPath(event.meetup.logo, 'meetup');
				if (!logoPath) {
					console.warn(`Meetup logo file not found: ${event.meetup.logo}`);
				}
				event.meetup.logo = logoPath ? event.meetup.logo : null;
			}

			// Validate presenter profile photo if it exists  
			if (event.presenter?.profile_photo) {
				const photoPath = await this.getLogoPath(event.presenter.profile_photo, 'presenter');
				if (!photoPath) {
					console.warn(`Presenter profile photo not found: ${event.presenter.profile_photo}`);
				}
				event.presenter.profile_photo = photoPath ? event.presenter.profile_photo : null;
			}

			return event;
		} catch (err) {
			console.error('Error validating event logos:', err);
			// Return event without logo validation if validation fails
			return await this.getEventByUrlId(urlId);
		}
	}
}