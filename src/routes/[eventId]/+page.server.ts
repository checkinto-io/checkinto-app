import type { PageServerLoad } from './$types';
import { DatabaseService } from '$lib/database.js';
import type { EventPageData } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad<EventPageData> = async ({ params }) => {
	const eventId = params.eventId;
	
	if (!eventId || typeof eventId !== 'string') {
		throw error(404, 'Event not found');
	}

	// Get event data from database
	const event = await DatabaseService.getEventByUrlId(eventId);
	
	if (!event) {
		throw error(404, 'Event not found or inactive');
	}

	return {
		event
	} satisfies EventPageData;
};