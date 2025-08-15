import { writable } from 'svelte/store';
import { 
	storeConfirmationState, 
	getConfirmationState, 
	clearConfirmationState, 
	hasConfirmationState 
} from '$lib/utils/storage';
import { validateAndCleanupConfirmationState, canPersistConfirmationState } from '$lib/utils/state-validation';
import type { Event } from '$lib/types';

export type Screen = 'welcome' | 'checkin' | 'confirmation';

export interface NavigationState {
	currentScreen: Screen;
	eventId: string;
	isLoading: boolean;
	error: string | null;
}

const initialState: NavigationState = {
	currentScreen: 'welcome',
	eventId: '',
	isLoading: false,
	error: null
};

export const navigationStore = writable<NavigationState>(initialState);

// Navigation actions
export const navigationActions = {
	// Set the event ID and check for persistent confirmation state
	setEvent: (eventId: string, event?: Event | null) => {
		// First validate and cleanup any existing confirmation state
		const validatedState = validateAndCleanupConfirmationState(eventId, event || null);
		
		// If we have a valid confirmation state, go directly to confirmation
		if (validatedState && validatedState.isConfirmed) {
			navigationStore.update(state => ({
				...state,
				eventId,
				currentScreen: 'confirmation',
				error: null,
				isLoading: false
			}));
		} else {
			// No valid confirmation state, start at welcome screen
			navigationStore.update(state => ({
				...state,
				eventId,
				currentScreen: 'welcome',
				error: null,
				isLoading: false
			}));
		}
	},

	// Navigate to a specific screen
	goToScreen: (screen: Screen) => {
		navigationStore.update(state => ({
			...state,
			currentScreen: screen,
			error: null,
			isLoading: false
		}));
	},

	// Navigate to check-in form
	startCheckin: () => {
		navigationStore.update(state => ({
			...state,
			currentScreen: 'checkin',
			error: null
		}));
	},

	// Navigate to confirmation screen and persist state
	completeCheckin: (event?: Event | null, attendeeEmail?: string) => {
		navigationStore.update(state => {
			// Store confirmation state if persistence is allowed
			if (event && canPersistConfirmationState(event)) {
				storeConfirmationState(state.eventId, attendeeEmail);
			}

			return {
				...state,
				currentScreen: 'confirmation',
				error: null
			};
		});
	},

	// Set loading state
	setLoading: (isLoading: boolean) => {
		navigationStore.update(state => ({
			...state,
			isLoading
		}));
	},

	// Set error state
	setError: (error: string | null) => {
		navigationStore.update(state => ({
			...state,
			error,
			isLoading: false
		}));
	},

	// Reset to initial state and clear persistent confirmation
	reset: () => {
		navigationStore.update(state => {
			// Clear any stored confirmation state for this event
			if (state.eventId) {
				clearConfirmationState(state.eventId);
			}
			return initialState;
		});
	},

	// Check if confirmation state exists for current event
	hasStoredConfirmation: (eventId: string): boolean => {
		return hasConfirmationState(eventId);
	},

	// Clear stored confirmation state for specific event
	clearStoredConfirmation: (eventId: string) => {
		clearConfirmationState(eventId);
	},

	// Validate stored confirmation state for an event
	validateStoredConfirmation: (eventId: string, event: Event | null) => {
		return validateAndCleanupConfirmationState(eventId, event);
	}
};