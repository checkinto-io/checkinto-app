import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import type {
	Event,
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
	 * Get event by URL ID
	 */
	static async getEventByUrlId(urlId: string): Promise<Event | null> {
		const { data, error } = await supabase
			.from('event')
			.select('*')
			.eq('url_id', urlId)
			.eq('active', true)
			.single();

		if (error) {
			console.error('Error fetching event:', error);
			return null;
		}

		return data;
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
		// First, upsert the attendee
		const attendee = await this.upsertAttendee(attendeeData);
		
		if (!attendee) {
			return { success: false };
		}

		// Then link to event
		const linked = await this.linkAttendeeToEvent(eventId, attendee.id);
		
		return { 
			success: linked, 
			attendee: linked ? attendee : undefined 
		};
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
}