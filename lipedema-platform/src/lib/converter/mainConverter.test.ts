/**
 * Main Converter Tests
 * 
 * Tests for the main converter pipeline that integrates all modules.
 * Validates: Requirements 1.4, 7.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { InstagramPost, TopicType } from './types';
import {
  convertPosts,
  convertFromJSON,
  convertSinglePost,
  formatStatisticsReport,
} from './mainConverter';
import { serializePosts } from './jsonParser';

// Valid topics for generating test data
const VALID_TOPICS: TopicType[] = [
  'Treatment',
  'Anti-Inflammatory',
  'Lymphedema',
  'Nutrition',
  'Diagnosis',
  'General Lipedema',
];

// Arbitrary for generating valid Instagram posts
const validInstagramPostArb = fc.record({
  id: fc.string({ minLength: 6, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
  topic: fc.constantFrom(...VALID_TOPICS),
  raw_caption: fc.string({ minLength: 10, maxLength: 500 }).filter(s => {
    // Ensure caption has actual content (not just hashtags)
    const withoutHashtags = s.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
    return withoutHashtags.length > 5;
  }),
  image_url: fc.webUrl(),
  user_questions: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 0, maxLength: 3 }),
});

// Arbitrary for generating hashtag-only posts (should be skipped)
const hashtagOnlyPostArb = fc.record({
  id: fc.string({ minLength: 6, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
  topic: fc.constantFrom(...VALID_TOPICS),
  raw_caption: fc.array(
    fc.string({ minLength: 3, maxLength: 15 }).filter(s => /^[a-zA-Z\u0590-\u05FF]+$/.test(s)),
    { minLength: 1, maxLength: 5 }
  ).map(words => words.map(w => `#${w}`).join(' ')),
  image_url: fc.webUrl(),
  user_questions: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 0, maxLength: 3 }),
});

// Arbitrary for mixed posts (some valid, some hashtag-only)
const mixedPostsArb = fc.tuple(
  fc.array(validInstagramPostArb, { minLength: 0, maxLength: 5 }),
  fc.array(hashtagOnlyPostArb, { minLength: 0, maxLength: 3 })
).map(([valid, hashtagOnly]) => {
  // Shuffle the combined array
  const combined = [...valid, ...hashtagOnly];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return { combined, validCount: valid.length, hashtagOnlyCount: hashtagOnly.length };
});

describe('Main Converter', () => {
  describe('convertSinglePost', () => {
    it('should convert a valid post to an article', () => {
      const post: InstagramPost = {
        id: 'test123456',
        topic: 'Treatment',
        raw_caption: 'טיפול בליפאדמה דורש סבלנות והתמדה. הנה כמה טיפים חשובים.',
        image_url: 'https://example.com/image.jpg',
        user_questions: ['איך מתחילים?'],
      };
      
      const article = convertSinglePost(post);
      
      expect(article).not.toBeNull();
      expect(article?.frontmatter.original_post_id).toBe('test123456');
      expect(article?.frontmatter.category).toBe('physical');
    });
    
    it('should return null for hashtag-only posts', () => {
      const post: InstagramPost = {
        id: 'test123456',
        topic: 'Treatment',
        raw_caption: '#ליפאדמה #טיפול #בריאות',
        image_url: 'https://example.com/image.jpg',
        user_questions: [],
      };
      
      const article = convertSinglePost(post);
      
      expect(article).toBeNull();
    });
  });
  
  describe('convertPosts', () => {
    it('should convert multiple valid posts', () => {
      const posts: InstagramPost[] = [
        {
          id: 'post1',
          topic: 'Treatment',
          raw_caption: 'טיפול בליפאדמה דורש סבלנות והתמדה.',
          image_url: 'https://example.com/1.jpg',
          user_questions: [],
        },
        {
          id: 'post2',
          topic: 'Nutrition',
          raw_caption: 'תזונה נכונה חשובה לניהול ליפאדמה.',
          image_url: 'https://example.com/2.jpg',
          user_questions: ['מה לאכול?'],
        },
      ];
      
      const result = convertPosts(posts);
      
      expect(result.success).toBe(true);
      expect(result.articles.length).toBe(2);
      expect(result.statistics.totalProcessed).toBe(2);
      expect(result.statistics.articlesGenerated).toBe(2);
      expect(result.statistics.postsSkipped).toBe(0);
    });
    
    it('should skip invalid posts and report in statistics', () => {
      const posts: InstagramPost[] = [
        {
          id: 'valid1',
          topic: 'Treatment',
          raw_caption: 'טיפול בליפאדמה דורש סבלנות והתמדה.',
          image_url: 'https://example.com/1.jpg',
          user_questions: [],
        },
        {
          id: 'invalid1',
          topic: 'Nutrition',
          raw_caption: '#ליפאדמה #תזונה',
          image_url: 'https://example.com/2.jpg',
          user_questions: [],
        },
      ];
      
      const result = convertPosts(posts);
      
      expect(result.success).toBe(true);
      expect(result.articles.length).toBe(1);
      expect(result.statistics.totalProcessed).toBe(2);
      expect(result.statistics.articlesGenerated).toBe(1);
      expect(result.statistics.postsSkipped).toBe(1);
    });
    
    it('should return success=false when no articles generated', () => {
      const posts: InstagramPost[] = [
        {
          id: 'invalid1',
          topic: 'Treatment',
          raw_caption: '#ליפאדמה',
          image_url: 'https://example.com/1.jpg',
          user_questions: [],
        },
      ];
      
      const result = convertPosts(posts);
      
      expect(result.success).toBe(false);
      expect(result.articles.length).toBe(0);
    });
  });
  
  describe('convertFromJSON', () => {
    it('should convert valid JSON to articles', () => {
      const posts: InstagramPost[] = [
        {
          id: 'json1',
          topic: 'Diagnosis',
          raw_caption: 'אבחון ליפאדמה הוא צעד חשוב בדרך לטיפול.',
          image_url: 'https://example.com/1.jpg',
          user_questions: [],
        },
      ];
      
      const json = serializePosts(posts);
      const result = convertFromJSON(json);
      
      expect(result.success).toBe(true);
      expect(result.articles.length).toBe(1);
    });
    
    it('should handle invalid JSON gracefully', () => {
      const result = convertFromJSON('not valid json');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    it('should handle empty array', () => {
      const result = convertFromJSON('[]');
      
      expect(result.success).toBe(false);
    });
  });
  
  describe('formatStatisticsReport', () => {
    it('should format statistics in Hebrew', () => {
      const report = formatStatisticsReport({
        totalProcessed: 10,
        articlesGenerated: 8,
        postsSkipped: 2,
      });
      
      expect(report).toContain('10');
      expect(report).toContain('8');
      expect(report).toContain('2');
      expect(report).toContain('80%');
    });
    
    it('should handle zero total processed', () => {
      const report = formatStatisticsReport({
        totalProcessed: 0,
        articlesGenerated: 0,
        postsSkipped: 0,
      });
      
      expect(report).toContain('0%');
    });
  });
  
  /**
   * Property-Based Test: Valid Post Count Consistency
   * 
   * Feature: instagram-to-seo-articles, Property 3: Valid Post Count Consistency
   * 
   * For any set of posts, the reported count of valid posts should equal
   * the total posts minus the skipped posts:
   * totalProcessed = articlesGenerated + postsSkipped
   * 
   * **Validates: Requirements 1.4, 7.5**
   */
  describe('Property 3: Valid Post Count Consistency', () => {
    it('should maintain count consistency: totalProcessed = articlesGenerated + postsSkipped', () => {
      fc.assert(
        fc.property(
          fc.array(validInstagramPostArb, { minLength: 0, maxLength: 10 }),
          (posts) => {
            const result = convertPosts(posts);
            
            // Property: totalProcessed = articlesGenerated + postsSkipped
            const countConsistent = 
              result.statistics.totalProcessed === 
              result.statistics.articlesGenerated + result.statistics.postsSkipped;
            
            // Also verify totalProcessed equals input length
            const totalMatchesInput = 
              result.statistics.totalProcessed === posts.length;
            
            return countConsistent && totalMatchesInput;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain count consistency with mixed valid and invalid posts', () => {
      fc.assert(
        fc.property(
          mixedPostsArb,
          ({ combined }) => {
            const result = convertPosts(combined);
            
            // Property: totalProcessed = articlesGenerated + postsSkipped
            return result.statistics.totalProcessed === 
              result.statistics.articlesGenerated + result.statistics.postsSkipped;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have articlesGenerated <= totalProcessed', () => {
      fc.assert(
        fc.property(
          fc.array(validInstagramPostArb, { minLength: 0, maxLength: 10 }),
          (posts) => {
            const result = convertPosts(posts);
            
            return result.statistics.articlesGenerated <= result.statistics.totalProcessed;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have postsSkipped >= 0', () => {
      fc.assert(
        fc.property(
          fc.array(validInstagramPostArb, { minLength: 0, maxLength: 10 }),
          (posts) => {
            const result = convertPosts(posts);
            
            return result.statistics.postsSkipped >= 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
