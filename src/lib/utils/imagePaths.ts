/**
 * Image path utilities for group-based image organization
 * Handles subdomain detection and dynamic path construction
 */

export type ImageCategory = 'group' | 'talent' | 'events';

/**
 * Extract group name from hostname
 * Examples: 
 *   codingwithai.chkin.io -> "codingwithai"
 *   localhost:5173 -> "codingwithai" (fallback for development)
 */
export function getGroupFromHostname(hostname?: string): string {
	// Use provided hostname or get from browser
	const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
	
	// Development fallback
	if (host === 'localhost' || host.startsWith('127.0.0.1')) {
		return 'codingwithai';
	}
	
	// Extract subdomain from hostname
	// codingwithai.chkin.io -> codingwithai
	const parts = host.split('.');
	if (parts.length >= 3) {
		return parts[0];
	}
	
	// Fallback if no subdomain detected
	return 'codingwithai';
}

/**
 * Construct image path for group-based organization
 * @param filename - Just the filename (e.g., "coding-with-ai-meetup.png")
 * @param category - Image category: 'group', 'talent', or 'events'
 * @param group - Optional group override, otherwise detected from hostname
 * @returns Full image path (e.g., "/images/groups/codingwithai/group/coding-with-ai-meetup.png")
 */
export function getImagePath(filename: string, category: ImageCategory, group?: string): string {
	const groupName = group || getGroupFromHostname();
	return `/images/groups/${groupName}/${category}/${filename}`;
}

/**
 * Check if image exists at the constructed path
 * @param filename - Just the filename
 * @param category - Image category
 * @param group - Optional group override
 * @returns Promise<boolean> indicating if image exists
 */
export async function imageExists(filename: string, category: ImageCategory, group?: string): Promise<boolean> {
	const imagePath = getImagePath(filename, category, group);
	
	try {
		const response = await fetch(imagePath, { method: 'HEAD' });
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Get image path with existence check fallback
 * @param filename - Just the filename
 * @param category - Image category
 * @param group - Optional group override
 * @returns Promise<string | null> - Path if exists, null if not found
 */
export async function getImagePathSafe(filename: string, category: ImageCategory, group?: string): Promise<string | null> {
	const imagePath = getImagePath(filename, category, group);
	const exists = await imageExists(filename, category, group);
	return exists ? imagePath : null;
}

/**
 * Utility constants for common image operations
 */
export const IMAGE_CATEGORIES = {
	GROUP: 'group' as const,
	TALENT: 'talent' as const,
	EVENTS: 'events' as const
} as const;

/**
 * Default fallback group for development/testing
 */
export const DEFAULT_GROUP = 'codingwithai';