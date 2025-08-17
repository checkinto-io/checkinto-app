// Database Types
export interface Group {
	id: string;
	name: string;
	description: string;
	learn_more_link: string | null;
	banner: string | null;
	profilename: string;
	favicon: string | null;
	raffle_winners_to_display: number;
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

export interface Talent {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	learn_more_link: string | null;
	bio: string | null;
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
	about_workshop: string | null;
	presenter_id: string;
	group_id: string;
	venue_id: string;
	workshop_lead_id: string;
	group_host_id: string;
	active: boolean;
	created_at: string;
	updated_at: string;
	// Related data (populated via JOIN queries)
	group?: Group;
	venue?: Venue;
	presenter?: Talent;
	workshop_lead?: Talent;
	group_host?: Talent;
}

// Type alias for component compatibility
export type MeetupEvent = Event;
export type GroupEvent = Event;

// Raffle Winner Types
export interface RaffleWinner {
	attendee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	raffle_round: number;
}

export interface RaffleAnnouncementData {
	winners: RaffleWinner[];
	total_winners_to_display: number;
	event_id: string;
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
	raffle_winner: boolean;
	raffle_round: number | null;
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
export type GroupInput = Omit<Group, 'id' | 'created_at' | 'updated_at'>;
export type MeetupInput = GroupInput; // Legacy alias
export type VenueInput = Omit<Venue, 'id' | 'created_at' | 'updated_at'>;
export type TalentInput = Omit<Talent, 'id' | 'created_at' | 'updated_at'>;
export type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'group' | 'venue' | 'presenter'>;
export type AttendeeInput = Omit<Attendee, 'id' | 'created_at' | 'updated_at'>;
export type EventAttendeeInput = Omit<EventAttendee, 'created_at' | 'raffle_winner' | 'raffle_round'>;

// Update Types (for updating records)
export type GroupUpdate = Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>;
export type MeetupUpdate = GroupUpdate; // Legacy alias
export type VenueUpdate = Partial<Omit<Venue, 'id' | 'created_at' | 'updated_at'>>;
export type TalentUpdate = Partial<Omit<Talent, 'id' | 'created_at' | 'updated_at'>>;
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at' | 'updated_at' | 'group' | 'venue' | 'presenter'>>;
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

// Persistent State Types
export interface ConfirmationState {
	isConfirmed: boolean;
	timestamp: number;
	eventId: string;
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
export function isGroup(obj: unknown): obj is Group {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Group).id === 'string' &&
		typeof (obj as Group).name === 'string' &&
		typeof (obj as Group).description === 'string'
	);
}

// Legacy alias for backward compatibility
export const isMeetup = isGroup;

export function isVenue(obj: unknown): obj is Venue {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Venue).id === 'string' &&
		typeof (obj as Venue).name === 'string' &&
		typeof (obj as Venue).description === 'string'
	);
}

export function isTalent(obj: unknown): obj is Talent {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof (obj as Talent).id === 'string' &&
		typeof (obj as Talent).first_name === 'string' &&
		typeof (obj as Talent).last_name === 'string' &&
		typeof (obj as Talent).email === 'string'
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
		typeof (obj as Event).group_id === 'string' &&
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