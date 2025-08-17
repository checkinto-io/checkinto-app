import type { PageServerLoad } from './$types';
import { DatabaseService } from '$lib/database.js';
import type { EventPageData } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad<EventPageData> = async ({ params, url }) => {
	const eventId = params.eventId;
	
	if (!eventId || typeof eventId !== 'string') {
		throw error(404, 'Event not found');
	}

	// Extract group profile name from subdomain
	const hostname = url.hostname;
	let profileName = 'default';
	
	// Check if we have a subdomain (not localhost or IP)
	if (!hostname.includes('localhost') && !hostname.match(/^\d+\.\d+\.\d+\.\d+/)) {
		const parts = hostname.split('.');
		if (parts.length >= 3) {
			profileName = parts[0]; // First part is the subdomain
		}
	} else {
		// For development/localhost, try to extract from search params or use default
		profileName = url.searchParams.get('group') || 'codingwithai';
	}

	// Get event data from database using both URL ID and profile name
	const event = await DatabaseService.getEventByUrlIdAndProfile(eventId, profileName);
	
	if (!event) {
		throw error(404, `Event '${eventId}' not found for group '${profileName}' or inactive`);
	}

	return {
		event
	} satisfies EventPageData;
};