/**
 * JSON Parser Tests
 * 
 * Property-based tests for Instagram posts JSON parsing.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  parseInstagramPosts, 
  serializePosts,
  PARSE_ERRORS 
} from './jsonParser';
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
 * Arbitrary generator for valid Instagram posts
 */
const instagramPostArbitrary = fc.record({
  id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  topic: fc.constantFrom(...VALID_TOPICS),
  raw_caption: fc.string(),
  image_url: fc.webUrl(),
  user_questions: fc.array(fc.string()),
});

/**
 * Arbitrary generator for arrays of valid Instagram posts
 */
const instagramPostsArrayArbitrary = fc.array(instagramPostArbitrary, { minLength: 1 });

describe('JSON Parser', () => {
  describe('Property Tests', () => {
    /**
     * Property 1: JSON Parsing Round-Trip
     * 
     * For any valid Instagram post JSON, parsing the JSON and extracting fields
     * should preserve all original field values (id, topic, raw_caption, image_url, user_questions).
     * 
     * **Validates: Requirements 1.1, 7.4**
     */
    it('Property 1: JSON Parsing Round-Trip - parsing then serializing preserves all fields', () => {
      fc.assert(
        fc.property(instagramPostsArrayArbitrary, (posts: InstagramPost[]) => {
          // Serialize posts to JSON
          const jsonString = serializePosts(posts);
          
          // Parse the JSON back
          const result = parseInstagramPosts(jsonString);
          
          // Should succeed
          expect(result.success).toBe(true);
          expect(result.errors).toHaveLength(0);
          expect(result.posts).toHaveLength(posts.length);
          
          // Each post should have all fields preserved
          for (let i = 0; i < posts.length; i++) {
            const original = posts[i];
            const parsed = result.posts[i];
            
            expect(parsed.id).toBe(original.id);
            expect(parsed.topic).toBe(original.topic);
            expect(parsed.raw_caption).toBe(original.raw_caption);
            expect(parsed.image_url).toBe(original.image_url);
            expect(parsed.user_questions).toEqual(original.user_questions);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should parse valid JSON with single post', () => {
      const json = JSON.stringify([{
        id: '123',
        topic: 'Treatment',
        raw_caption: 'Test caption',
        image_url: 'https://example.com/image.jpg',
        user_questions: ['Question 1?'],
      }]);
      
      const result = parseInstagramPosts(json);
      
      expect(result.success).toBe(true);
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].id).toBe('123');
    });

    it('should return error for invalid JSON', () => {
      const result = parseInstagramPosts('not valid json');
      
      expect(result.success).toBe(false);
      expect(result.errors[0].message).toBe(PARSE_ERRORS.INVALID_JSON);
    });

    it('should return error for non-array JSON', () => {
      const result = parseInstagramPosts('{"id": "123"}');
      
      expect(result.success).toBe(false);
      expect(result.errors[0].message).toBe(PARSE_ERRORS.INVALID_ARRAY);
    });

    it('should return error for empty array', () => {
      const result = parseInstagramPosts('[]');
      
      expect(result.success).toBe(false);
      expect(result.errors[0].message).toBe(PARSE_ERRORS.EMPTY_POSTS);
    });

    it('should return error for invalid topic', () => {
      const json = JSON.stringify([{
        id: '123',
        topic: 'InvalidTopic',
        raw_caption: 'Test',
        image_url: 'https://example.com/image.jpg',
        user_questions: [],
      }]);
      
      const result = parseInstagramPosts(json);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.field === 'topic')).toBe(true);
    });

    it('should return error for missing required fields', () => {
      const json = JSON.stringify([{
        id: '123',
        // missing topic, raw_caption, image_url, user_questions
      }]);
      
      const result = parseInstagramPosts(json);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
