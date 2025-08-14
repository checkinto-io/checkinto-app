/**
 * State validation utilities for confirmation state management
 * Handles detection and cleanup of stale or invalid states
 */

import type { Event, ConfirmationState } from '$lib/types';
import { clearConfirmationState, getConfirmationState } from './storage';

/**
 * Validate if a confirmation state is still valid for the given event
 * Returns true if state is valid, false if it should be cleared
 */
export function isConfirmationStateValid(
	eventId: string,
	event: Event | null,
	storedState: ConfirmationState | null
): boolean {
	// No stored state means nothing to validate
	if (!storedState) return true;

	// Event not found or null - state is invalid
	if (!event) {
		console.warn(`Event not found for stored confirmation state: ${eventId}`);
		return false;
	}

	// Event is inactive - state is invalid
	if (!event.active) {
		console.warn(`Event is inactive, clearing stored confirmation state: ${eventId}`);
		return false;
	}

	// Event ID mismatch - state is invalid
	if (storedState.eventId !== eventId) {
		console.warn(`Event ID mismatch in stored state: expected ${eventId}, got ${storedState.eventId}`);
		return false;
	}

	// Event URL ID mismatch - state is invalid
	if (event.url_id !== eventId) {
		console.warn(`Event URL ID mismatch: expected ${eventId}, got ${event.url_id}`);
		return false;
	}

	// All validation checks passed
	return true;
}

/**
 * Validate and potentially clean up confirmation state for an event
 * Returns the validated state or null if state was invalid and cleared
 */
export function validateAndCleanupConfirmationState(
	eventId: string,
	event: Event | null
): ConfirmationState | null {
	const storedState = getConfirmationState(eventId);
	
	// No stored state - nothing to validate
	if (!storedState) return null;

	// Check if state is valid
	const isValid = isConfirmationStateValid(eventId, event, storedState);

	if (!isValid) {
		// State is invalid, clear it
		clearConfirmationState(eventId);
		return null;
	}

	// State is valid, return it
	return storedState;
}

/**
 * Check if event allows confirmation state persistence
 * Some events might have special rules that prevent state persistence
 */
export function canPersistConfirmationState(event: Event | null): boolean {
	// Event must exist
	if (!event) return false;

	// Event must be active
	if (!event.active) return false;

	// Event must have valid required fields
	if (!event.url_id || !event.id || !event.title) return false;

	// All checks passed
	return true;
}

/**
 * Validate timestamp in confirmation state
 * Can be used for future features like state expiration
 */
export function isTimestampValid(
	timestamp: number,
	maxAgeMs?: number
): boolean {
	// Timestamp must be a valid number
	if (!timestamp || timestamp <= 0) return false;

	// Timestamp cannot be in the future (with small tolerance)
	const now = Date.now();
	const tolerance = 5 * 60 * 1000; // 5 minutes tolerance
	if (timestamp > now + tolerance) return false;

	// Check max age if specified
	if (maxAgeMs && (now - timestamp) > maxAgeMs) return false;

	return true;
}

/**
 * Comprehensive validation of a confirmation state object
 * Checks all properties and their validity
 */
export function validateConfirmationStateObject(
	state: unknown,
	expectedEventId: string
): state is ConfirmationState {
	if (!state || typeof state !== 'object') return false;

	const s = state as Record<string, unknown>;

	// Check required properties exist and have correct types
	if (typeof s.isConfirmed !== 'boolean') return false;
	if (typeof s.timestamp !== 'number') return false;
	if (typeof s.eventId !== 'string') return false;

	// Check that eventId matches expected
	if (s.eventId !== expectedEventId) return false;

	// Check that timestamp is valid
	if (!isTimestampValid(s.timestamp)) return false;

	// Check that isConfirmed is true (false confirmations are meaningless)
	if (s.isConfirmed !== true) return false;

	return true;
}