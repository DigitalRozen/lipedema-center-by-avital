/**
 * SEO Generator Tests
 * 
 * Property-based tests for SEO metadata generation.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateSlug,
  generateMetaDescription,
  generateTitle,
  selectTags,
  generateSEOMetadata,
  isValidTag,
  VALID_TAGS,
  META_DESCRIPTION_KEYWORD,
  META_DESCRIPTION_MAX_LENGTH,
} from './seoGenerator';
import { VALID_TOPICS } from './topicMapper';
import type { TopicType, ArticleTag } from './types';

/**
 * Arbitrary generator for valid topic types
 */
const topicArbitrary = fc.constantFrom(...VALID_TOPICS);

/**
 * Arbitrary generator for post IDs (numeric strings)
 */
const postIdArbitrary = fc.string({ minLength: 10, maxLength: 20 }).filter(s => /^\d+$/.test(s) || s.length >= 10).map(s => {
  // Ensure we have a valid numeric-like string
  if (/^\d+$/.test(s)) return s;
  // Generate a numeric string from the input
  return Array.from(s).map((c, i) => String(c.charCodeAt(0) % 10)).join('').padEnd(10, '0');
});

/**
 * Arbitrary generator for Hebrew captions with actual content
 */
const hebrewCaptionArbitrary = fc.string({ minLength: 10, maxLength: 500 });

/**
 * Arbitrary generator for captions with lipedema-related content
 */
const lipedemaContentArbitrary = fc.oneof(
  fc.constant('ליפאדמה היא מחלה שמשפיעה על רקמת השומן'),
  fc.constant('תזונה נכונה חשובה לטיפול בליפאדמה'),
  fc.constant('מסאז לימפתי עוזר לניקוז הלימפה'),
  fc.constant('אבחון מוקדם של ליפאדמה חשוב מאוד'),
  fc.constant('דלקתיות בגוף יכולה להחמיר את המצב'),
  fc.constant('ניקוז לימפתי הוא טיפול חשוב'),
  fc.constant('בצקת ברגליים היא סימן נפוץ'),
  fc.constant('רקמה פיברוטית מתפתחת עם הזמן'),
  hebrewCaptionArbitrary
);


describe('SEO Generator', () => {
  describe('Property Tests', () => {
    /**
     * Property 4: Title Differs From Caption
     * 
     * For any converted article, the generated title should be different from the original raw_caption.
     * 
     * **Validates: Requirements 2.1**
     */
    it('Property 4: Title Differs From Caption - generated title is different from original caption', () => {
      fc.assert(
        fc.property(
          lipedemaContentArbitrary,
          topicArbitrary,
          postIdArbitrary,
          (caption: string, topic: TopicType, postId: string) => {
            const title = generateTitle(caption, topic, postId);
            
            // Title should not be empty
            expect(title).toBeTruthy();
            expect(title.length).toBeGreaterThan(0);
            
            // Title should be different from caption (case-insensitive, ignoring hashtags)
            const cleanCaption = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim().toLowerCase();
            const cleanTitle = title.toLowerCase();
            
            // They should be different
            expect(cleanTitle).not.toBe(cleanCaption);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 5: Slug Format Validation
     * 
     * For any generated slug, it should contain only lowercase English letters, numbers, and hyphens (kebab-case format).
     * 
     * **Validates: Requirements 2.3**
     */
    it('Property 5: Slug Format Validation - slug is valid kebab-case', () => {
      fc.assert(
        fc.property(
          topicArbitrary,
          lipedemaContentArbitrary,
          postIdArbitrary,
          (topic: TopicType, content: string, postId: string) => {
            const slug = generateSlug(topic, content, postId);
            
            // Slug should not be empty
            expect(slug).toBeTruthy();
            expect(slug.length).toBeGreaterThan(0);
            
            // Slug should only contain lowercase letters, numbers, and hyphens
            const validSlugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
            expect(slug).toMatch(validSlugPattern);
            
            // Slug should not start or end with hyphen
            expect(slug.startsWith('-')).toBe(false);
            expect(slug.endsWith('-')).toBe(false);
            
            // Slug should not have consecutive hyphens
            expect(slug.includes('--')).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });


    /**
     * Property 6: Meta Description Constraints
     * 
     * For any generated meta description, it should be at most 155 characters and contain the keyword "טיפול בליפאדמה".
     * 
     * **Validates: Requirements 2.4**
     */
    it('Property 6: Meta Description Constraints - description is within length and contains keyword', () => {
      fc.assert(
        fc.property(
          lipedemaContentArbitrary,
          (content: string) => {
            const metaDescription = generateMetaDescription(content);
            
            // Meta description should not be empty
            expect(metaDescription).toBeTruthy();
            expect(metaDescription.length).toBeGreaterThan(0);
            
            // Meta description should be at most 155 characters
            expect(metaDescription.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
            
            // Meta description should contain the required keyword
            expect(metaDescription).toContain(META_DESCRIPTION_KEYWORD);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7: Tag Validation
     * 
     * For any article, all assigned tags should be members of the predefined tag set, and the count should be between 1 and 3 inclusive.
     * 
     * **Validates: Requirements 2.5, 2.6**
     */
    it('Property 7: Tag Validation - tags are valid and count is 1-3', () => {
      fc.assert(
        fc.property(
          lipedemaContentArbitrary,
          topicArbitrary,
          (content: string, topic: TopicType) => {
            const tags = selectTags(content, topic);
            
            // Should have between 1 and 3 tags
            expect(tags.length).toBeGreaterThanOrEqual(1);
            expect(tags.length).toBeLessThanOrEqual(3);
            
            // All tags should be from the valid tags list
            for (const tag of tags) {
              expect(VALID_TAGS).toContain(tag);
              expect(isValidTag(tag)).toBe(true);
            }
            
            // Tags should be unique (no duplicates)
            const uniqueTags = new Set(tags);
            expect(uniqueTags.size).toBe(tags.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  describe('Unit Tests', () => {
    describe('generateSlug', () => {
      it('should generate a valid slug for Treatment topic', () => {
        const slug = generateSlug('Treatment', 'טיפול בליפאדמה', '1234567890');
        expect(slug).toMatch(/^[a-z0-9-]+$/);
        expect(slug).toContain('treatment');
      });

      it('should generate a valid slug for Nutrition topic', () => {
        const slug = generateSlug('Nutrition', 'תזונה נכונה', '9876543210');
        expect(slug).toMatch(/^[a-z0-9-]+$/);
        expect(slug).toContain('nutrition');
      });

      it('should include unique ID from post ID', () => {
        const slug = generateSlug('Treatment', 'content', '1234567890');
        expect(slug).toContain('567890');
      });

      it('should handle Hebrew content with known keywords', () => {
        const slug = generateSlug('Treatment', 'מסאז לימפתי לניקוז', '1234567890');
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    describe('generateMetaDescription', () => {
      it('should generate description with keyword', () => {
        const description = generateMetaDescription('תוכן קצר');
        expect(description).toContain('טיפול בליפאדמה');
      });

      it('should not exceed 155 characters', () => {
        const longContent = 'א'.repeat(500);
        const description = generateMetaDescription(longContent);
        expect(description.length).toBeLessThanOrEqual(155);
      });

      it('should handle content that already contains keyword', () => {
        const content = 'טיפול בליפאדמה הוא חשוב מאוד לבריאות';
        const description = generateMetaDescription(content);
        expect(description).toContain('טיפול בליפאדמה');
        expect(description.length).toBeLessThanOrEqual(155);
      });

      it('should remove hashtags from description', () => {
        const content = 'תוכן חשוב #ליפאדמה #בריאות';
        const description = generateMetaDescription(content);
        expect(description).not.toContain('#');
      });
    });

    describe('generateTitle', () => {
      it('should generate a Hebrew title', () => {
        const title = generateTitle('כיתוב מקורי', 'Treatment', '1234567890');
        expect(title).toBeTruthy();
        // Should contain Hebrew characters
        expect(title).toMatch(/[\u0590-\u05FF]/);
      });

      it('should generate different titles for different topics', () => {
        const treatmentTitle = generateTitle('content', 'Treatment', '1234567890');
        const nutritionTitle = generateTitle('content', 'Nutrition', '1234567890');
        expect(treatmentTitle).not.toBe(nutritionTitle);
      });

      it('should be deterministic for same inputs', () => {
        const title1 = generateTitle('content', 'Treatment', '1234567890');
        const title2 = generateTitle('content', 'Treatment', '1234567890');
        expect(title1).toBe(title2);
      });
    });

    describe('selectTags', () => {
      it('should return 1-3 tags', () => {
        const tags = selectTags('תוכן כללי', 'Treatment');
        expect(tags.length).toBeGreaterThanOrEqual(1);
        expect(tags.length).toBeLessThanOrEqual(3);
      });

      it('should include nutrition tag for nutrition content', () => {
        const tags = selectTags('תזונה נכונה ודיאטה מאוזנת', 'Nutrition');
        expect(tags).toContain('תזונה');
      });

      it('should include diagnosis tag for diagnosis content', () => {
        const tags = selectTags('אבחון מוקדם חשוב', 'Diagnosis');
        expect(tags).toContain('אבחון');
      });

      it('should include conservative treatment tag for treatment content', () => {
        const tags = selectTags('מסאז וניקוז לימפתי', 'Treatment');
        expect(tags).toContain('טיפול שמרני');
      });

      it('should return only valid tags', () => {
        const tags = selectTags('תוכן כלשהו', 'General Lipedema');
        for (const tag of tags) {
          expect(VALID_TAGS).toContain(tag);
        }
      });
    });

    describe('isValidTag', () => {
      it('should return true for valid tags', () => {
        expect(isValidTag('תזונה')).toBe(true);
        expect(isValidTag('טיפול שמרני')).toBe(true);
        expect(isValidTag('ניתוחים')).toBe(true);
        expect(isValidTag('סיפורי הצלחה')).toBe(true);
        expect(isValidTag('אבחון')).toBe(true);
        expect(isValidTag('תוספי תזונה')).toBe(true);
      });

      it('should return false for invalid tags', () => {
        expect(isValidTag('invalid')).toBe(false);
        expect(isValidTag('')).toBe(false);
        expect(isValidTag('תג לא קיים')).toBe(false);
      });
    });

    describe('generateSEOMetadata', () => {
      it('should generate complete SEO metadata', () => {
        const metadata = generateSEOMetadata('תוכן לדוגמה', 'Treatment', '1234567890');
        
        expect(metadata.title).toBeTruthy();
        expect(metadata.slug).toBeTruthy();
        expect(metadata.metaDescription).toBeTruthy();
        expect(metadata.tags.length).toBeGreaterThanOrEqual(1);
      });

      it('should have valid slug format', () => {
        const metadata = generateSEOMetadata('תוכן', 'Nutrition', '9876543210');
        expect(metadata.slug).toMatch(/^[a-z0-9-]+$/);
      });

      it('should have meta description with keyword', () => {
        const metadata = generateSEOMetadata('תוכן', 'Diagnosis', '1111111111');
        expect(metadata.metaDescription).toContain('טיפול בליפאדמה');
      });
    });
  });
});
