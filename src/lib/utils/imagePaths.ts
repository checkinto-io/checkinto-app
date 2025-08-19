/**
 * Image path utilities for community-based image organization
 * Handles subdomain detection and dynamic path construction
 */

export type ImageCategory = 'community' | 'talent' | 'events';

/**
 * Extract community name from hostname (DEPRECATED - use event.community.profilename instead)
 * @deprecated This function is no longer used. Community identification now uses event.community.profilename
 * Examples: 
 *   codingwithai.checkinto.io -> "codingwithai"
 *   localhost:5173 -> "codingwithai" (fallback for development)
 */
export function getCommunityFromHostname(hostname?: string): string {
	// Use provided hostname or get from browser
	const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
	
	// Development fallback - check for localhost, 127.0.0.1, or IP addresses
	if (DEV_HOSTS.some(devHost => host === devHost || host.startsWith(devHost))) {
		return COMMUNITIES.DEFAULT;
	}
	
	// Check for IP addresses (any hostname that starts with digits and dots)
	if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
		return COMMUNITIES.DEFAULT;
	}
	
	// Extract subdomain from hostname
	// codingwithai.checkinto.io -> codingwithai
	const parts = host.split('.');
	if (parts.length >= 3) {
		return parts[0];
	}
	
	// Fallback if no subdomain detected
	return COMMUNITIES.DEFAULT;
}

/**
 * Construct image path for community-based organization
 * @param filename - Just the filename (e.g., "coding-with-ai-community.png")
 * @param category - Image category: 'community', 'talent', or 'events'
 * @param community - Group identifier (should be provided from event.community.profilename)
 * @returns Full image path (e.g., "/images/communities/codingwithai/community/coding-with-ai-community.png")
 */
export function getImagePath(filename: string, category: ImageCategory, community?: string): string {
	const communityName = community || COMMUNITIES.DEFAULT;
	return `/images/communities/${communityName}/${category}/${filename}`;
}

/**
 * Check if image exists at the constructed path
 * @param filename - Just the filename
 * @param category - Image category
 * @param community - Optional community override
 * @returns Promise<boolean> indicating if image exists
 */
export async function imageExists(filename: string, category: ImageCategory, community?: string): Promise<boolean> {
	const imagePath = getImagePath(filename, category, community);
	
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
 * @param community - Optional community override
 * @returns Promise<string | null> - Path if exists, null if not found
 */
export async function getImagePathSafe(filename: string, category: ImageCategory, community?: string): Promise<string | null> {
	const imagePath = getImagePath(filename, category, community);
	const exists = await imageExists(filename, category, community);
	return exists ? imagePath : null;
}

/**
 * Utility constants for common image operations
 */
export const IMAGE_CATEGORIES = {
	COMMUNITY: 'community' as const,
	TALENT: 'talent' as const,
	EVENTS: 'events' as const
} as const;

/**
 * Image path constants to prevent typos and centralize path management
 */
export const IMAGE_PATHS = {
	BASE: '/images',
	COMMUNITIES_BASE: '/images/communities',
	COMMUNITIES_PATTERN: '/images/communities/{community}/{category}/{filename}'
} as const;

/**
 * Community name constants
 */
export const COMMUNITIES = {
	CODING_WITH_AI: 'codingwithai',
	DEFAULT: 'codingwithai'
} as const;

/**
 * Default fallback community for development/testing
 */
export const DEFAULT_COMMUNITY = COMMUNITIES.DEFAULT;

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
 * Preload image with community-based path construction
 * @param filename - Just the filename
 * @param category - Image category
 * @param community - Optional community override
 * @returns Promise that resolves when image is loaded
 */
export async function preloadCommunityImage(filename: string, category: ImageCategory, community?: string): Promise<void> {
	const imagePath = getImagePath(filename, category, community);
	return preloadImage(imagePath);
}

/**
 * Preload multiple images in parallel
 * @param imageConfigs - Array of {filename, category, community} objects
 * @returns Promise that resolves when all images are loaded
 */
export async function preloadImages(imageConfigs: Array<{filename: string, category: ImageCategory, community?: string}>): Promise<void> {
	const preloadPromises = imageConfigs.map(config => 
		preloadCommunityImage(config.filename, config.category, config.community)
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