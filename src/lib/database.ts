import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Initialize Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Database types
export interface Event {
	id: string;
	url_id: string;
	title: string;
	welcome_message: string;
	checked_in_message: string;
	active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Attendee {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	interesting_fact: string;
	created_at: string;
	updated_at: string;
}

export interface EventAttendee {
	event_id: string;
	attendee_id: string;
	created_at: string;
}

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
	static async upsertAttendee(attendeeData: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>): Promise<Attendee | null> {
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
		attendeeData: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>
	): Promise<{ success: boolean; attendee?: Attendee }> {
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
	 * Test database connection
	 */
	static async testConnection(): Promise<boolean> {
		try {
			const { data, error } = await supabase
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