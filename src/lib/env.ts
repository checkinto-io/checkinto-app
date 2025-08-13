import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Validate required environment variables
function validateEnv() {
	const missing: string[] = [];

	if (!PUBLIC_SUPABASE_URL) {
		missing.push('PUBLIC_SUPABASE_URL');
	}

	if (!PUBLIC_SUPABASE_ANON_KEY) {
		missing.push('PUBLIC_SUPABASE_ANON_KEY');
	}

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}\n` +
			'Please check your .env file and ensure all required variables are set.'
		);
	}
}

// Validate on import
validateEnv();

export const env = {
	SUPABASE_URL: PUBLIC_SUPABASE_URL,
	SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY
} as const;