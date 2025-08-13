import { writable } from 'svelte/store';

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
	// Set the event ID and reset to welcome screen
	setEvent: (eventId: string) => {
		navigationStore.update(state => ({
			...state,
			eventId,
			currentScreen: 'welcome',
			error: null,
			isLoading: false
		}));
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

	// Navigate to confirmation screen
	completeCheckin: () => {
		navigationStore.update(state => ({
			...state,
			currentScreen: 'confirmation',
			error: null
		}));
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

	// Reset to initial state
	reset: () => {
		navigationStore.set(initialState);
	}
};