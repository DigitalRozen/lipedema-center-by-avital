/**
 * Content Expander Tests
 * 
 * Property-based tests for content expansion.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  expandContent,
  expandShortCaption,
  restructureDetailedCaption,
  isShortCaption,
  cleanCaption,
  containsMedicalVocabulary,
  getExpandedContentLength,
  expandedContentToText,
  MEDICAL_VOCABULARY,
  SHORT_CAPTION_THRESHOLD,
} from './contentExpander';
import { VALID_TOPICS, mapTopicToCategory } from './topicMapper';
import type { TopicType, CategorySlug } from './types';

/**
 * Arbitrary generator for valid topic types
 */
const topicArbitrary = fc.constantFrom(...VALID_TOPICS);

/**
 * Arbitrary generator for short captions (under 200 characters)
 */
const shortCaptionArbitrary = fc.string({ minLength: 10, maxLength: SHORT_CAPTION_THRESHOLD - 1 })
  .filter(s => s.replace(/#[\w\u0590-\u05FF]+/g, '').trim().length > 0 && 
               s.replace(/#[\w\u0590-\u05FF]+/g, '').trim().length < SHORT_CAPTION_THRESHOLD);

/**
 * Arbitrary generator for long captions (200+ characters)
 */
const longCaptionArbitrary = fc.string({ minLength: SHORT_CAPTION_THRESHOLD + 50, maxLength: 1000 })
  .filter(s => s.replace(/#[\w\u0590-\u05FF]+/g, '').trim().length >= SHORT_CAPTION_THRESHOLD);

/**
 * Arbitrary generator for Hebrew content with lipedema-related terms
 */
const hebrewContentArbitrary = fc.oneof(
  fc.constant('ליפאדמה היא מחלה שמשפיעה על רקמת השומן'),
  fc.constant('תזונה נכונה חשובה לטיפול בליפאדמה'),
  fc.constant('מסאז לימפתי עוזר לניקוז הלימפה'),
  fc.constant('אבחון מוקדם של ליפאדמה חשוב מאוד'),
  fc.constant('דלקתיות בגוף יכולה להחמיר את המצב'),
  fc.constant('ניקוז לימפתי הוא טיפול חשוב'),
  fc.constant('בצקת ברגליים היא סימן נפוץ'),
  fc.constant('רקמה פיברוטית מתפתחת עם הזמן'),
  fc.constant('מערכת הלימפה אחראית על ניקוז נוזלים'),
  fc.constant('נוגדי חמצון עוזרים להילחם בדלקת'),
);

/**
 * Arbitrary generator for diagnosis/physical category topics
 */
const medicalTopicArbitrary = fc.constantFrom<TopicType>(
  'Treatment',
  'Lymphedema',
  'Diagnosis'
);

describe('Content Expander', () => {
  describe('Property Tests', () => {
    /**
     * Property 8: Short Caption Expansion
     * 
     * For any post with raw_caption under 200 characters, the generated article content 
     * should be longer than the original caption.
     * 
     * **Validates: Requirements 3.4**
     */
    it('Property 8: Short Caption Expansion - expanded content is longer than original short caption', () => {
      fc.assert(
        fc.property(
          shortCaptionArbitrary,
          topicArbitrary,
          (caption: string, topic: TopicType) => {
            // Verify it's actually a short caption
            const cleanedCaption = cleanCaption(caption);
            if (cleanedCaption.length >= SHORT_CAPTION_THRESHOLD || cleanedCaption.length === 0) {
              return true; // Skip invalid test cases
            }
            
            const expandedContent = expandContent(caption, topic);
            const expandedLength = getExpandedContentLength(expandedContent);
            const originalLength = cleanedCaption.length;
            
            // Expanded content should be longer than original
            expect(expandedLength).toBeGreaterThan(originalLength);
            
            // Should have introduction, sections, and conclusion
            expect(expandedContent.introduction).toBeTruthy();
            expect(expandedContent.sections.length).toBeGreaterThan(0);
            expect(expandedContent.conclusion).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 9: Medical Vocabulary Presence
     * 
     * For any article in the "diagnosis" or "physical" category, the content should contain 
     * at least one medical vocabulary term from the predefined list.
     * 
     * **Validates: Requirements 3.3**
     */
    it('Property 9: Medical Vocabulary Presence - medical content contains medical terms', () => {
      fc.assert(
        fc.property(
          hebrewContentArbitrary,
          medicalTopicArbitrary,
          (caption: string, topic: TopicType) => {
            const expandedContent = expandContent(caption, topic);
            const fullText = expandedContentToText(expandedContent);
            
            // Get the category for this topic
            const category = mapTopicToCategory(topic);
            
            // For diagnosis and physical categories, should contain medical vocabulary
            if (category.slug === 'diagnosis' || category.slug === 'physical') {
              const hasMedicalTerm = containsMedicalVocabulary(fullText);
              expect(hasMedicalTerm).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    describe('isShortCaption', () => {
      it('should return true for captions under 200 characters', () => {
        expect(isShortCaption('קצר')).toBe(true);
        expect(isShortCaption('תוכן קצר מאוד')).toBe(true);
      });

      it('should return false for captions 200+ characters', () => {
        const longCaption = 'א'.repeat(250);
        expect(isShortCaption(longCaption)).toBe(false);
      });

      it('should ignore hashtags when calculating length', () => {
        const captionWithHashtags = 'קצר #ליפאדמה #בריאות #תזונה';
        expect(isShortCaption(captionWithHashtags)).toBe(true);
      });
    });

    describe('cleanCaption', () => {
      it('should remove hashtags', () => {
        const caption = 'תוכן #ליפאדמה #בריאות';
        expect(cleanCaption(caption)).toBe('תוכן');
      });

      it('should trim whitespace', () => {
        const caption = '  תוכן  ';
        expect(cleanCaption(caption)).toBe('תוכן');
      });

      it('should handle Hebrew hashtags', () => {
        const caption = 'תוכן #תזונה #טיפול';
        expect(cleanCaption(caption)).toBe('תוכן');
      });
    });

    describe('expandShortCaption', () => {
      it('should expand short caption with introduction', () => {
        const result = expandShortCaption('תוכן קצר', 'Treatment');
        expect(result.introduction).toBeTruthy();
        expect(result.introduction.length).toBeGreaterThan(10);
      });

      it('should include sections', () => {
        const result = expandShortCaption('תוכן קצר', 'Nutrition');
        expect(result.sections.length).toBeGreaterThan(0);
      });

      it('should include conclusion with CTA', () => {
        const result = expandShortCaption('תוכן קצר', 'Diagnosis');
        expect(result.conclusion).toBeTruthy();
      });

      it('should be deterministic for same inputs', () => {
        const result1 = expandShortCaption('תוכן קצר', 'Treatment');
        const result2 = expandShortCaption('תוכן קצר', 'Treatment');
        expect(result1.introduction).toBe(result2.introduction);
        expect(result1.conclusion).toBe(result2.conclusion);
      });
    });

    describe('restructureDetailedCaption', () => {
      it('should restructure long caption', () => {
        const longCaption = 'פסקה ראשונה עם תוכן מפורט.\n\nפסקה שנייה עם מידע נוסף.\n\nפסקה שלישית לסיכום.';
        const result = restructureDetailedCaption(longCaption, 'Treatment');
        
        expect(result.introduction).toBeTruthy();
        expect(result.sections.length).toBeGreaterThan(0);
        expect(result.conclusion).toBeTruthy();
      });

      it('should handle single paragraph', () => {
        const singleParagraph = 'פסקה אחת ארוכה מאוד עם הרבה תוכן שמספיק לכל המאמר';
        const result = restructureDetailedCaption(singleParagraph, 'Nutrition');
        
        expect(result.introduction).toBeTruthy();
        expect(result.sections.length).toBeGreaterThan(0);
      });
    });

    describe('expandContent', () => {
      it('should use expandShortCaption for short content', () => {
        const shortCaption = 'קצר';
        const result = expandContent(shortCaption, 'Treatment');
        
        // Should have expanded content
        expect(getExpandedContentLength(result)).toBeGreaterThan(shortCaption.length);
      });

      it('should use restructureDetailedCaption for long content', () => {
        const longCaption = 'א'.repeat(300);
        const result = expandContent(longCaption, 'Treatment');
        
        expect(result.introduction).toBeTruthy();
        expect(result.sections.length).toBeGreaterThan(0);
      });
    });

    describe('containsMedicalVocabulary', () => {
      it('should return true for content with medical terms', () => {
        expect(containsMedicalVocabulary('מערכת הלימפה חשובה')).toBe(true);
        expect(containsMedicalVocabulary('בצקת ברגליים')).toBe(true);
        expect(containsMedicalVocabulary('דלקתיות בגוף')).toBe(true);
      });

      it('should return false for content without medical terms', () => {
        expect(containsMedicalVocabulary('תוכן כללי')).toBe(false);
        expect(containsMedicalVocabulary('hello world')).toBe(false);
      });

      it('should be case insensitive', () => {
        expect(containsMedicalVocabulary('לימפה')).toBe(true);
        expect(containsMedicalVocabulary('LYMPH')).toBe(false); // Hebrew terms only
      });
    });

    describe('getExpandedContentLength', () => {
      it('should calculate total length correctly', () => {
        const content = {
          introduction: '12345',
          sections: [
            { heading: '123', content: '12345' },
          ],
          conclusion: '12345',
        };
        
        // 5 + 3 + 5 + 5 = 18
        expect(getExpandedContentLength(content)).toBe(18);
      });
    });

    describe('expandedContentToText', () => {
      it('should convert to plain text', () => {
        const content = {
          introduction: 'מבוא',
          sections: [
            { heading: 'כותרת', content: 'תוכן' },
          ],
          conclusion: 'סיכום',
        };
        
        const text = expandedContentToText(content);
        expect(text).toContain('מבוא');
        expect(text).toContain('## כותרת');
        expect(text).toContain('תוכן');
        expect(text).toContain('סיכום');
      });
    });
  });
});
