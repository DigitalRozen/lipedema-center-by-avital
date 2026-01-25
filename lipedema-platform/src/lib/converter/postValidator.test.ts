/**
 * Post Validator Tests
 * 
 * Property-based tests for Instagram post validation.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  validatePost, 
  isHashtagOnly,
  validatePosts,
  VALIDATION_WARNINGS 
} from './postValidator';
import type { InstagramPost, TopicType } from './types';

// Valid topic values for generating test data
const VALID_TOPICS: TopicType[] = [
  'Treatment',
  'Anti-Inflammatory',
  'Lymphedema',
  'Nutrition',
  'Diagnosis',
  'General Lipedema',
];

/**
 * Arbitrary generator for hashtag strings (Hebrew and English)
 */
const hashtagArbitrary = fc.string({ minLength: 1, maxLength: 20 })
  .filter((s: string) => /^[\w\u0590-\u05FF]+$/.test(s))
  .map((s: string) => `#${s}`);

/**
 * Arbitrary generator for hashtag-only captions
 * Creates strings composed entirely of hashtags with optional whitespace
 */
const hashtagOnlyCaptionArbitrary = fc.array(hashtagArbitrary, { minLength: 1, maxLength: 10 })
  .chain(hashtags => 
    fc.array(fc.constantFrom(' ', '  ', '\n', '\t', ''), { minLength: hashtags.length - 1, maxLength: hashtags.length + 5 })
      .map(spaces => {
        // Interleave hashtags with whitespace
        let result = '';
        for (let i = 0; i < hashtags.length; i++) {
          if (i > 0 && spaces[i - 1]) {
            result += spaces[i - 1];
          }
          result += hashtags[i];
        }
        // Add optional trailing whitespace
        if (spaces[hashtags.length]) {
          result += spaces[hashtags.length];
        }
        return result;
      })
  );

/**
 * Arbitrary generator for captions with actual content (not just hashtags)
 */
const contentCaptionArbitrary = fc.tuple(
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0 && !s.startsWith('#')),
  fc.array(hashtagArbitrary, { minLength: 0, maxLength: 5 })
).map(([content, hashtags]) => {
  // Combine content with optional hashtags
  return hashtags.length > 0 
    ? `${content} ${hashtags.join(' ')}`
    : content;
});

/**
 * Arbitrary generator for valid Instagram posts with content
 */
const validPostArbitrary = fc.record({
  id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  topic: fc.constantFrom(...VALID_TOPICS),
  raw_caption: contentCaptionArbitrary,
  image_url: fc.webUrl(),
  user_questions: fc.array(fc.string()),
});

/**
 * Arbitrary generator for posts with hashtag-only captions
 */
const hashtagOnlyPostArbitrary = fc.record({
  id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  topic: fc.constantFrom(...VALID_TOPICS),
  raw_caption: hashtagOnlyCaptionArbitrary,
  image_url: fc.webUrl(),
  user_questions: fc.array(fc.string()),
});

describe('Post Validator', () => {
  describe('Property Tests', () => {
    /**
     * Property 2: Hashtag-Only Caption Detection
     * 
     * For any caption string composed entirely of hashtags (with optional whitespace),
     * the validator should identify it as invalid and mark it for skipping.
     * 
     * **Validates: Requirements 1.2, 1.3**
     */
    it('Property 2: Hashtag-Only Caption Detection - hashtag-only captions are marked invalid', () => {
      fc.assert(
        fc.property(hashtagOnlyPostArbitrary, (post: InstagramPost) => {
          const result = validatePost(post);
          
          // Should be invalid
          expect(result.valid).toBe(false);
          // Should have the correct reason
          expect(result.reason).toBe(VALIDATION_WARNINGS.HASHTAG_ONLY);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2b: Valid Content Detection (inverse property)
     * 
     * For any caption with actual content (not just hashtags),
     * the validator should identify it as valid.
     * 
     * **Validates: Requirements 1.2, 1.3**
     */
    it('Property 2b: Valid Content Detection - captions with content are marked valid', () => {
      fc.assert(
        fc.property(validPostArbitrary, (post: InstagramPost) => {
          const result = validatePost(post);
          
          // Should be valid
          expect(result.valid).toBe(true);
          expect(result.reason).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    describe('isHashtagOnly', () => {
      it('should return true for single hashtag', () => {
        expect(isHashtagOnly('#lipedema')).toBe(true);
      });

      it('should return true for multiple hashtags', () => {
        expect(isHashtagOnly('#lipedema #health #wellness')).toBe(true);
      });

      it('should return true for Hebrew hashtags', () => {
        expect(isHashtagOnly('#ליפאדמה #בריאות')).toBe(true);
      });

      it('should return true for hashtags with whitespace', () => {
        expect(isHashtagOnly('  #tag1  #tag2  ')).toBe(true);
      });

      it('should return true for hashtags with newlines', () => {
        expect(isHashtagOnly('#tag1\n#tag2\n#tag3')).toBe(true);
      });

      it('should return false for text with hashtags', () => {
        expect(isHashtagOnly('Check out this post #lipedema')).toBe(false);
      });

      it('should return false for plain text', () => {
        expect(isHashtagOnly('This is a regular caption')).toBe(false);
      });

      it('should return true for empty string', () => {
        expect(isHashtagOnly('')).toBe(true);
      });

      it('should return true for whitespace only', () => {
        expect(isHashtagOnly('   ')).toBe(true);
      });
    });

    describe('validatePost', () => {
      const createPost = (caption: string): InstagramPost => ({
        id: '123',
        topic: 'Treatment',
        raw_caption: caption,
        image_url: 'https://example.com/image.jpg',
        user_questions: [],
      });

      it('should validate post with content', () => {
        const result = validatePost(createPost('This is a valid caption'));
        expect(result.valid).toBe(true);
      });

      it('should invalidate post with empty caption', () => {
        const result = validatePost(createPost(''));
        expect(result.valid).toBe(false);
        expect(result.reason).toBe(VALIDATION_WARNINGS.EMPTY_CAPTION);
      });

      it('should invalidate post with whitespace-only caption', () => {
        const result = validatePost(createPost('   '));
        expect(result.valid).toBe(false);
        expect(result.reason).toBe(VALIDATION_WARNINGS.EMPTY_CAPTION);
      });

      it('should invalidate post with hashtag-only caption', () => {
        const result = validatePost(createPost('#lipedema #health'));
        expect(result.valid).toBe(false);
        expect(result.reason).toBe(VALIDATION_WARNINGS.HASHTAG_ONLY);
      });

      it('should validate post with mixed content and hashtags', () => {
        const result = validatePost(createPost('Great tips for managing lipedema #health #wellness'));
        expect(result.valid).toBe(true);
      });
    });

    describe('validatePosts', () => {
      it('should separate valid and invalid posts', () => {
        const posts: InstagramPost[] = [
          {
            id: '1',
            topic: 'Treatment',
            raw_caption: 'Valid content here',
            image_url: 'https://example.com/1.jpg',
            user_questions: [],
          },
          {
            id: '2',
            topic: 'Nutrition',
            raw_caption: '#only #hashtags',
            image_url: 'https://example.com/2.jpg',
            user_questions: [],
          },
          {
            id: '3',
            topic: 'Diagnosis',
            raw_caption: 'Another valid post #tag',
            image_url: 'https://example.com/3.jpg',
            user_questions: [],
          },
        ];

        const result = validatePosts(posts);

        expect(result.totalValid).toBe(2);
        expect(result.totalSkipped).toBe(1);
        expect(result.validPosts).toHaveLength(2);
        expect(result.skippedPosts).toHaveLength(1);
        expect(result.skippedPosts[0].id).toBe('2');
      });
    });
  });
});

