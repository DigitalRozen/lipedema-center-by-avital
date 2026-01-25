/**
 * Blog utility functions for the premium blog article page
 * 
 * @module lib/blog/utils
 */

/**
 * Category fallback images mapping
 * Maps each category to its corresponding fallback image path
 */
const categoryFallbacks: Record<string, string> = {
  nutrition: '/assets/generated/nutrition_fallback.png',
  physical: '/assets/generated/physical_fallback.png',
  diagnosis: '/assets/generated/diagnosis_fallback.png',
  mindset: '/assets/generated/mindset_fallback.png',
};

/**
 * Default fallback image when category is unknown
 */
const DEFAULT_FALLBACK = '/assets/generated/nutrition_fallback.png';

/**
 * Average Hebrew reading speed in words per minute
 * Hebrew text typically reads slower than English due to character complexity
 */
const HEBREW_WORDS_PER_MINUTE = 200;

/**
 * Calculates the estimated reading time for content
 * 
 * @param content - The text content to calculate reading time for
 * @returns The estimated reading time in minutes (minimum 1)
 * 
 * @example
 * ```ts
 * const time = calculateReadingTime('שלום עולם'); // Returns 1
 * const time = calculateReadingTime(longArticle); // Returns calculated minutes
 * ```
 * 
 * @remarks
 * Uses Hebrew reading speed of ~200 words per minute.
 * Always returns at least 1 minute for any non-empty content.
 * 
 * Validates: Requirements 2.6
 */
export function calculateReadingTime(content: string): number {
  if (!content || content.trim().length === 0) {
    return 1;
  }
  
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / HEBREW_WORDS_PER_MINUTE));
}

/**
 * Gets the fallback image path for a given category
 * 
 * @param category - The post category (diagnosis, nutrition, physical, mindset)
 * @returns The path to the fallback image for the category
 * 
 * @example
 * ```ts
 * const image = getFallbackImage('nutrition'); // Returns '/assets/generated/nutrition_fallback.png'
 * const image = getFallbackImage('unknown'); // Returns default fallback
 * ```
 * 
 * @remarks
 * Returns a default fallback image if the category is not recognized.
 * 
 * Validates: Requirements 2.9
 */
export function getFallbackImage(category: string): string {
  return categoryFallbacks[category] || DEFAULT_FALLBACK;
}

/**
 * Valid category types for the blog
 */
export type BlogCategory = 'diagnosis' | 'nutrition' | 'physical' | 'mindset';

/**
 * Checks if a string is a valid blog category
 * 
 * @param category - The string to check
 * @returns True if the category is valid
 */
export function isValidCategory(category: string): category is BlogCategory {
  return ['diagnosis', 'nutrition', 'physical', 'mindset'].includes(category);
}
