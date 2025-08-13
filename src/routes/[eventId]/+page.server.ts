import type { PageServerLoad } from './$types';
import { DatabaseService } from '$lib/database.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = params.eventId;
	
	if (!eventId) {
		throw error(404, 'Event not found');
	}

	// Get event data from database
	const event = await DatabaseService.getEventByUrlId(eventId);
	
	if (!event) {
		throw error(404, 'Event not found or inactive');
	}

	return {
		event
	};
};