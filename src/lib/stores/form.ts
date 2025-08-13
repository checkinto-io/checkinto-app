import { writable } from 'svelte/store';

export interface AttendeeData {
	firstName: string;
	lastName: string;
	email: string;
	interestingFact: string;
}

export interface FormValidation {
	firstName: string;
	lastName: string;
	email: string;
	interestingFact: string;
}

export interface FormState {
	data: AttendeeData;
	validation: FormValidation;
	isSubmitting: boolean;
	isValid: boolean;
}

const initialData: AttendeeData = {
	firstName: '',
	lastName: '',
	email: '',
	interestingFact: ''
};

const initialValidation: FormValidation = {
	firstName: '',
	lastName: '',
	email: '',
	interestingFact: ''
};

const initialState: FormState = {
	data: initialData,
	validation: initialValidation,
	isSubmitting: false,
	isValid: false
};

export const formStore = writable<FormState>(initialState);

// Validation helpers
const validateEmail = (email: string): string => {
	if (!email.trim()) return 'Email is required';
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) return 'Please enter a valid email address';
	return '';
};

const validateRequired = (value: string, fieldName: string): string => {
	if (!value.trim()) return `${fieldName} is required`;
	return '';
};

const validateInterestingFact = (fact: string): string => {
	if (!fact.trim()) return 'Interesting fact is required';
	if (fact.length > 255) return 'Interesting fact must be 255 characters or less';
	return '';
};

// Form actions
export const formActions = {
	// Update a single field
	updateField: (field: keyof AttendeeData, value: string) => {
		formStore.update(state => {
			const newData = { ...state.data, [field]: value };
			const newValidation = { ...state.validation };

			// Validate the updated field
			switch (field) {
				case 'firstName':
					newValidation.firstName = validateRequired(value, 'First name');
					break;
				case 'lastName':
					newValidation.lastName = validateRequired(value, 'Last name');
					break;
				case 'email':
					newValidation.email = validateEmail(value);
					break;
				case 'interestingFact':
					newValidation.interestingFact = validateInterestingFact(value);
					break;
			}

			// Check if form is valid
			const isValid = Object.values(newValidation).every(error => error === '') &&
							Object.values(newData).every(value => value.trim() !== '');

			return {
				...state,
				data: newData,
				validation: newValidation,
				isValid
			};
		});
	},

	// Validate all fields
	validateAll: () => {
		formStore.update(state => {
			const validation: FormValidation = {
				firstName: validateRequired(state.data.firstName, 'First name'),
				lastName: validateRequired(state.data.lastName, 'Last name'),
				email: validateEmail(state.data.email),
				interestingFact: validateInterestingFact(state.data.interestingFact)
			};

			const isValid = Object.values(validation).every(error => error === '');

			return {
				...state,
				validation,
				isValid
			};
		});
	},

	// Set submission state
	setSubmitting: (isSubmitting: boolean) => {
		formStore.update(state => ({
			...state,
			isSubmitting
		}));
	},

	// Reset form to initial state
	reset: () => {
		formStore.set(initialState);
	},

	// Get current form data (for submission)
	getData: (): Promise<AttendeeData> => {
		return new Promise((resolve) => {
			const unsubscribe = formStore.subscribe(state => {
				unsubscribe();
				resolve(state.data);
			});
		});
	}
};