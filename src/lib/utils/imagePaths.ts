/**
 * Image path utilities for group-based image organization
 * Handles subdomain detection and dynamic path construction
 */

export type ImageCategory = 'group' | 'talent' | 'events';

/**
 * Extract group name from hostname
 * Examples: 
 *   codingwithai.checkinto.io -> "codingwithai"
 *   localhost:5173 -> "codingwithai" (fallback for development)
 */
export function getGroupFromHostname(hostname?: string): string {
	// Use provided hostname or get from browser
	const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
	
	// Development fallback
	if (DEV_HOSTS.some(devHost => host === devHost || host.startsWith(devHost))) {
		return GROUPS.DEFAULT;
	}
	
	// Extract subdomain from hostname
	// codingwithai.checkinto.io -> codingwithai
	const parts = host.split('.');
	if (parts.length >= 3) {
		return parts[0];
	}
	
	// Fallback if no subdomain detected
	return GROUPS.DEFAULT;
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
 * Image path constants to prevent typos and centralize path management
 */
export const IMAGE_PATHS = {
	BASE: '/images',
	GROUPS_BASE: '/images/groups',
	GROUPS_PATTERN: '/images/groups/{group}/{category}/{filename}'
} as const;

/**
 * Group name constants
 */
export const GROUPS = {
	CODING_WITH_AI: 'codingwithai',
	DEFAULT: 'codingwithai'
} as const;

/**
 * Default fallback group for development/testing
 */
export const DEFAULT_GROUP = GROUPS.DEFAULT;

/**
 * Preload an image to improve performance
 * @param imagePath - Full path to the image
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(imagePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => reject(new Error(`Failed to preload image: ${imagePath}`));
		img.src = imagePath;
	});
}

/**
 * Preload image with group-based path construction
 * @param filename - Just the filename
 * @param category - Image category
 * @param group - Optional group override
 * @returns Promise that resolves when image is loaded
 */
export async function preloadGroupImage(filename: string, category: ImageCategory, group?: string): Promise<void> {
	const imagePath = getImagePath(filename, category, group);
	return preloadImage(imagePath);
}

/**
 * Preload multiple images in parallel
 * @param imageConfigs - Array of {filename, category, group} objects
 * @returns Promise that resolves when all images are loaded
 */
export async function preloadImages(imageConfigs: Array<{filename: string, category: ImageCategory, group?: string}>): Promise<void> {
	const preloadPromises = imageConfigs.map(config => 
		preloadGroupImage(config.filename, config.category, config.group)
	);
	
	await Promise.allSettled(preloadPromises);
}

/**
 * Development environment detection constants
 */
export const DEV_HOSTS = ['localhost', '127.0.0.1'] as const;

/**
 * Domain constants for environment detection
 */
export const DOMAINS = {
	PRODUCTION: 'checkinto.io',
	LEGACY: 'chkin.io' // Support for legacy domain references
} as const;