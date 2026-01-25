/**
 * Post Validator for Instagram Posts
 * 
 * Validates Instagram posts before conversion to SEO articles.
 * Validates: Requirements 1.2, 1.3
 */

import type { InstagramPost, ValidationResult, ValidatedPost } from './types';

/**
 * Validation warning messages in Hebrew
 */
export const VALIDATION_WARNINGS = {
  HASHTAG_ONLY: 'פוסט מכיל רק האשטגים - מדלג',
  EMPTY_CAPTION: 'כיתוב ריק - מדלג',
  NO_IMAGE: 'חסרה תמונה - ממשיך עם placeholder',
};

/**
 * Regular expression to match hashtags (supports Hebrew and English)
 * Matches: #word, #מילה, #word123
 */
const HASHTAG_REGEX = /#[\w\u0590-\u05FF]+/g;

/**
 * Check if a caption contains only hashtags (with optional whitespace)
 * 
 * @param caption - The raw caption text to check
 * @returns true if caption contains only hashtags, false otherwise
 * 
 * Validates: Requirements 1.2, 1.3
 */
export function isHashtagOnly(caption: string): boolean {
  // Remove all hashtags from the caption
  const withoutHashtags = caption.replace(HASHTAG_REGEX, '').trim();
  
  // If nothing remains (or only whitespace), it's hashtag-only
  return withoutHashtags.length === 0;
}

/**
 * Validate a single Instagram post for conversion
 * 
 * Checks:
 * - Caption is not empty
 * - Caption is not composed only of hashtags
 * 
 * @param post - The Instagram post to validate
 * @returns ValidationResult indicating if post is valid
 * 
 * Validates: Requirements 1.2, 1.3
 */
export function validatePost(post: InstagramPost): ValidationResult {
  // Check for empty caption
  if (!post.raw_caption || post.raw_caption.trim() === '') {
    return {
      valid: false,
      reason: VALIDATION_WARNINGS.EMPTY_CAPTION,
    };
  }
  
  // Check for hashtag-only caption
  if (isHashtagOnly(post.raw_caption)) {
    return {
      valid: false,
      reason: VALIDATION_WARNINGS.HASHTAG_ONLY,
    };
  }
  
  return { valid: true };
}

/**
 * Validate a post and return a ValidatedPost with status
 * 
 * @param post - The Instagram post to validate
 * @returns ValidatedPost with isValid flag and optional skipReason
 */
export function validateAndMark(post: InstagramPost): ValidatedPost {
  const result = validatePost(post);
  
  return {
    ...post,
    isValid: result.valid,
    skipReason: result.reason,
  };
}

/**
 * Validate multiple posts and separate valid from invalid
 * 
 * @param posts - Array of Instagram posts to validate
 * @returns Object with valid posts, skipped posts, and validation summary
 */
export function validatePosts(posts: InstagramPost[]): {
  validPosts: InstagramPost[];
  skippedPosts: ValidatedPost[];
  totalValid: number;
  totalSkipped: number;
} {
  const validPosts: InstagramPost[] = [];
  const skippedPosts: ValidatedPost[] = [];
  
  for (const post of posts) {
    const validated = validateAndMark(post);
    
    if (validated.isValid) {
      validPosts.push(post);
    } else {
      skippedPosts.push(validated);
    }
  }
  
  return {
    validPosts,
    skippedPosts,
    totalValid: validPosts.length,
    totalSkipped: skippedPosts.length,
  };
}
