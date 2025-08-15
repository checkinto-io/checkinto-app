/**
 * Raffle utility functions
 * Version: v0.8.0-raffle-system
 */

import { supabase } from '$lib/database';
import type { RaffleWinner } from '$lib/types';

/**
 * Fetch current raffle winners for an event
 * Uses the get_raffle_winners database function
 */
export async function fetchRaffleWinners(eventId: string): Promise<RaffleWinner[]> {
	try {
		const { data, error } = await supabase
			.rpc('get_raffle_winners', { p_event_id: eventId });
		
		if (error) {
			console.error('Error fetching raffle winners:', error);
			return [];
		}
		
		if (!data || !Array.isArray(data)) {
			return [];
		}
		
		// Transform the data to match our RaffleWinner type
		return data.map(winner => ({
			attendee_id: winner.attendee_id,
			first_name: winner.first_name,
			last_name: winner.last_name,
			email: winner.email,
			raffle_round: winner.raffle_round
		}));
	} catch (err) {
		console.error('Unexpected error fetching raffle winners:', err);
		return [];
	}
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinal(n: number): string {
	const s = ['th', 'st', 'nd', 'rd'];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Check if an email matches a winner
 */
export function isWinner(winnerEmail: string, userEmail: string): boolean {
	return winnerEmail.toLowerCase() === userEmail.toLowerCase();
}