// Database Types
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

// Type alias for component compatibility
export type MeetupEvent = Event;

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

// Form Types
export interface CheckInFormData {
	first_name: string;
	last_name: string;
	email: string;
	interesting_fact: string;
}

// API Response Types
export interface CheckInResponse {
	success: boolean;
	attendee?: Attendee;
	error?: string;
}

// Database Input Types (for creating records)
export type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type AttendeeInput = Omit<Attendee, 'id' | 'created_at' | 'updated_at'>;
export type EventAttendeeInput = Omit<EventAttendee, 'created_at'>;

// Update Types (for updating records)
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
export type AttendeeUpdate = Partial<Omit<Attendee, 'id' | 'created_at' | 'updated_at'>>;

// Form Validation Types
export interface FormErrors {
	first_name?: string;
	last_name?: string;
	email?: string;
	interesting_fact?: string;
	general?: string;
}

// Application State Types
export interface AppState {
	currentEvent: Event | null;
	loading: boolean;
	error: string | null;
}

// Page Data Types
export interface EventPageData {
	event: Event;
}

// Component Props Types
export interface WelcomeScreenProps {
	event: Event;
	onCheckIn: () => void;
}

export interface CheckInFormProps {
	event: Event;
	onSubmit: (data: CheckInFormData) => Promise<void>;
	onBack: () => void;
	loading?: boolean;
	errors?: FormErrors;
}

export interface ConfirmationScreenProps {
	event: Event;
	attendee: Attendee;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Constants
export const VALIDATION_RULES = {
	FIRST_NAME_MAX_LENGTH: 50,
	LAST_NAME_MAX_LENGTH: 50,
	EMAIL_MAX_LENGTH: 254,
	INTERESTING_FACT_MAX_LENGTH: 255
} as const;

// Type Guards
export function isEvent(obj: unknown): obj is Event {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Event).id === 'string' &&
		typeof (obj as Event).url_id === 'string' &&
		typeof (obj as Event).title === 'string' &&
		typeof (obj as Event).welcome_message === 'string' &&
		typeof (obj as Event).checked_in_message === 'string' &&
		typeof (obj as Event).active === 'boolean'
	);
}

export function isAttendee(obj: unknown): obj is Attendee {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Attendee).id === 'string' &&
		typeof (obj as Attendee).first_name === 'string' &&
		typeof (obj as Attendee).last_name === 'string' &&
		typeof (obj as Attendee).email === 'string' &&
		typeof (obj as Attendee).interesting_fact === 'string'
	);
}

export function isCheckInFormData(obj: unknown): obj is CheckInFormData {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as CheckInFormData).first_name === 'string' &&
		typeof (obj as CheckInFormData).last_name === 'string' &&
		typeof (obj as CheckInFormData).email === 'string' &&
		typeof (obj as CheckInFormData).interesting_fact === 'string'
	);
}