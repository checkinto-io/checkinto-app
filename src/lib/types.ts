// Database Types
export interface Meetup {
	id: string;
	name: string;
	description: string;
	learn_more_link: string | null;
	logo: string | null;
	created_at: string;
	updated_at: string;
}

export interface Venue {
	id: string;
	name: string;
	description: string;
	learn_more_link: string | null;
	wifi_access: string | null;
	restroom_details: string | null;
	food_details: string | null;
	created_at: string;
	updated_at: string;
}

export interface Presenter {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	learn_more_link: string | null;
	about_presenter: string | null;
	profile_photo: string | null;
	created_at: string;
	updated_at: string;
}

export interface Event {
	id: string;
	url_id: string;
	title: string;
	welcome_message: string;
	about_presentation: string | null;
	about_working_session: string | null;
	presenter_id: string;
	meetup_id: string;
	venue_id: string;
	active: boolean;
	created_at: string;
	updated_at: string;
	// Related data (populated via JOIN queries)
	meetup?: Meetup;
	venue?: Venue;
	presenter?: Presenter;
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
	isExistingAttendee?: boolean;
}

// Database Input Types (for creating records)
export type MeetupInput = Omit<Meetup, 'id' | 'created_at' | 'updated_at'>;
export type VenueInput = Omit<Venue, 'id' | 'created_at' | 'updated_at'>;
export type PresenterInput = Omit<Presenter, 'id' | 'created_at' | 'updated_at'>;
export type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'meetup' | 'venue' | 'presenter'>;
export type AttendeeInput = Omit<Attendee, 'id' | 'created_at' | 'updated_at'>;
export type EventAttendeeInput = Omit<EventAttendee, 'created_at'>;

// Update Types (for updating records)
export type MeetupUpdate = Partial<Omit<Meetup, 'id' | 'created_at' | 'updated_at'>>;
export type VenueUpdate = Partial<Omit<Venue, 'id' | 'created_at' | 'updated_at'>>;
export type PresenterUpdate = Partial<Omit<Presenter, 'id' | 'created_at' | 'updated_at'>>;
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at' | 'updated_at' | 'meetup' | 'venue' | 'presenter'>>;
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
export function isMeetup(obj: unknown): obj is Meetup {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Meetup).id === 'string' &&
		typeof (obj as Meetup).name === 'string' &&
		typeof (obj as Meetup).description === 'string'
	);
}

export function isVenue(obj: unknown): obj is Venue {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Venue).id === 'string' &&
		typeof (obj as Venue).name === 'string' &&
		typeof (obj as Venue).description === 'string'
	);
}

export function isPresenter(obj: unknown): obj is Presenter {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Presenter).id === 'string' &&
		typeof (obj as Presenter).first_name === 'string' &&
		typeof (obj as Presenter).last_name === 'string' &&
		typeof (obj as Presenter).email === 'string'
	);
}

export function isEvent(obj: unknown): obj is Event {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Event).id === 'string' &&
		typeof (obj as Event).url_id === 'string' &&
		typeof (obj as Event).title === 'string' &&
		typeof (obj as Event).welcome_message === 'string' &&
		typeof (obj as Event).presenter_id === 'string' &&
		typeof (obj as Event).meetup_id === 'string' &&
		typeof (obj as Event).venue_id === 'string' &&
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