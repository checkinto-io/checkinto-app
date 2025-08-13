import type { CheckInFormData, FormErrors } from './types.js';
import { VALIDATION_RULES, isCheckInFormData } from './types.js';

/**
 * Validate check-in form data client-side
 */
export function validateCheckInForm(formData: CheckInFormData): FormErrors {
	const errors: FormErrors = {};

	// First name validation
	if (!formData.first_name?.trim()) {
		errors.first_name = 'First name is required';
	} else if (formData.first_name.length > VALIDATION_RULES.FIRST_NAME_MAX_LENGTH) {
		errors.first_name = `First name must be ${VALIDATION_RULES.FIRST_NAME_MAX_LENGTH} characters or less`;
	}

	// Last name validation
	if (!formData.last_name?.trim()) {
		errors.last_name = 'Last name is required';
	} else if (formData.last_name.length > VALIDATION_RULES.LAST_NAME_MAX_LENGTH) {
		errors.last_name = `Last name must be ${VALIDATION_RULES.LAST_NAME_MAX_LENGTH} characters or less`;
	}

	// Email validation
	if (!formData.email?.trim()) {
		errors.email = 'Email is required';
	} else if (formData.email.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) {
		errors.email = `Email must be ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters or less`;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
		errors.email = 'Please enter a valid email address';
	}

	// Interesting fact validation
	if (!formData.interesting_fact?.trim()) {
		errors.interesting_fact = 'Interesting fact is required';
	} else if (formData.interesting_fact.length > VALIDATION_RULES.INTERESTING_FACT_MAX_LENGTH) {
		errors.interesting_fact = `Interesting fact must be ${VALIDATION_RULES.INTERESTING_FACT_MAX_LENGTH} characters or less`;
	}

	return errors;
}

/**
 * Check if form has any validation errors
 */
export function hasFormErrors(errors: FormErrors): boolean {
	return Object.keys(errors).length > 0;
}

/**
 * Safe form data parser with validation
 */
export function parseCheckInFormData(formData: FormData): CheckInFormData | null {
	try {
		const data = {
			first_name: formData.get('first_name')?.toString() || '',
			last_name: formData.get('last_name')?.toString() || '',
			email: formData.get('email')?.toString() || '',
			interesting_fact: formData.get('interesting_fact')?.toString() || ''
		};

		return isCheckInFormData(data) ? data : null;
	} catch {
		return null;
	}
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
	return input.trim().replace(/\s+/g, ' ');
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}
	
	if (error instanceof Error) {
		return error.message;
	}
	
	return 'An unexpected error occurred';
}