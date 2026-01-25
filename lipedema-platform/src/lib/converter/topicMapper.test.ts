/**
 * Topic Mapper Tests
 * 
 * Property-based tests for topic to category mapping.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  mapTopicToCategory,
  isValidTopic,
  isValidCategory,
  TOPIC_TO_CATEGORY,
  CATEGORY_DISPLAY,
  VALID_CATEGORIES,
  VALID_TOPICS,
} from './topicMapper';
import type { TopicType, CategorySlug } from './types';

/**
 * Arbitrary generator for valid topic types
 */
const topicArbitrary = fc.constantFrom(...VALID_TOPICS);

/**
 * Arbitrary generator for valid category slugs
 */
const categoryArbitrary = fc.constantFrom(...VALID_CATEGORIES);

describe('Topic Mapper', () => {
  describe('Property Tests', () => {
    /**
     * Property 14: Topic to Category Mapping
     * 
     * For any post with a valid topic, the mapped category should follow the defined mapping rules:
     * - Treatment → physical
     * - Anti-Inflammatory, Nutrition → nutrition
     * - Lymphedema, Diagnosis → diagnosis
     * - General Lipedema → one of the valid categories
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
     */
    it('Property 14: Topic to Category Mapping - all topics map to valid categories', () => {
      fc.assert(
        fc.property(topicArbitrary, (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          
          // Result should have a valid category slug
          expect(VALID_CATEGORIES).toContain(result.slug);
          
          // Result should have a non-empty display name
          expect(result.display).toBeTruthy();
          expect(typeof result.display).toBe('string');
          expect(result.display.length).toBeGreaterThan(0);
          
          // Display name should match the category display mapping
          expect(result.display).toBe(CATEGORY_DISPLAY[result.slug]);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 14b: Specific Topic Mappings
     * 
     * Verifies that each topic maps to its expected category according to requirements.
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
     */
    it('Property 14b: Specific Topic Mappings - Treatment maps to physical', () => {
      fc.assert(
        fc.property(fc.constant('Treatment' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('physical');
          expect(result.display).toBe('טיפול פיזי ושיקום');
        }),
        { numRuns: 100 }
      );
    });

    it('Property 14c: Specific Topic Mappings - Anti-Inflammatory maps to nutrition', () => {
      fc.assert(
        fc.property(fc.constant('Anti-Inflammatory' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('nutrition');
          expect(result.display).toBe('תזונה ונוטריציה');
        }),
        { numRuns: 100 }
      );
    });

    it('Property 14d: Specific Topic Mappings - Nutrition maps to nutrition', () => {
      fc.assert(
        fc.property(fc.constant('Nutrition' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('nutrition');
          expect(result.display).toBe('תזונה ונוטריציה');
        }),
        { numRuns: 100 }
      );
    });

    it('Property 14e: Specific Topic Mappings - Lymphedema maps to diagnosis', () => {
      fc.assert(
        fc.property(fc.constant('Lymphedema' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('diagnosis');
          expect(result.display).toBe('אבחון וזיהוי');
        }),
        { numRuns: 100 }
      );
    });

    it('Property 14f: Specific Topic Mappings - Diagnosis maps to diagnosis', () => {
      fc.assert(
        fc.property(fc.constant('Diagnosis' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('diagnosis');
          expect(result.display).toBe('אבחון וזיהוי');
        }),
        { numRuns: 100 }
      );
    });

    it('Property 14g: Specific Topic Mappings - General Lipedema maps to mindset', () => {
      fc.assert(
        fc.property(fc.constant('General Lipedema' as TopicType), (topic: TopicType) => {
          const result = mapTopicToCategory(topic);
          expect(result.slug).toBe('mindset');
          expect(result.display).toBe('מיינדסט ורגש');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 14h: Mapping Consistency
     * 
     * For any topic, calling mapTopicToCategory multiple times should return the same result.
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
     */
    it('Property 14h: Mapping Consistency - same topic always maps to same category', () => {
      fc.assert(
        fc.property(topicArbitrary, (topic: TopicType) => {
          const result1 = mapTopicToCategory(topic);
          const result2 = mapTopicToCategory(topic);
          
          expect(result1.slug).toBe(result2.slug);
          expect(result1.display).toBe(result2.display);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    describe('mapTopicToCategory', () => {
      it('should map Treatment to physical', () => {
        const result = mapTopicToCategory('Treatment');
        expect(result.slug).toBe('physical');
        expect(result.display).toBe('טיפול פיזי ושיקום');
      });

      it('should map Anti-Inflammatory to nutrition', () => {
        const result = mapTopicToCategory('Anti-Inflammatory');
        expect(result.slug).toBe('nutrition');
        expect(result.display).toBe('תזונה ונוטריציה');
      });

      it('should map Nutrition to nutrition', () => {
        const result = mapTopicToCategory('Nutrition');
        expect(result.slug).toBe('nutrition');
        expect(result.display).toBe('תזונה ונוטריציה');
      });

      it('should map Lymphedema to diagnosis', () => {
        const result = mapTopicToCategory('Lymphedema');
        expect(result.slug).toBe('diagnosis');
        expect(result.display).toBe('אבחון וזיהוי');
      });

      it('should map Diagnosis to diagnosis', () => {
        const result = mapTopicToCategory('Diagnosis');
        expect(result.slug).toBe('diagnosis');
        expect(result.display).toBe('אבחון וזיהוי');
      });

      it('should map General Lipedema to mindset', () => {
        const result = mapTopicToCategory('General Lipedema');
        expect(result.slug).toBe('mindset');
        expect(result.display).toBe('מיינדסט ורגש');
      });
    });

    describe('isValidTopic', () => {
      it('should return true for valid topics', () => {
        expect(isValidTopic('Treatment')).toBe(true);
        expect(isValidTopic('Anti-Inflammatory')).toBe(true);
        expect(isValidTopic('Lymphedema')).toBe(true);
        expect(isValidTopic('Nutrition')).toBe(true);
        expect(isValidTopic('Diagnosis')).toBe(true);
        expect(isValidTopic('General Lipedema')).toBe(true);
      });

      it('should return false for invalid topics', () => {
        expect(isValidTopic('InvalidTopic')).toBe(false);
        expect(isValidTopic('')).toBe(false);
        expect(isValidTopic('treatment')).toBe(false); // case sensitive
      });
    });

    describe('isValidCategory', () => {
      it('should return true for valid categories', () => {
        expect(isValidCategory('diagnosis')).toBe(true);
        expect(isValidCategory('nutrition')).toBe(true);
        expect(isValidCategory('physical')).toBe(true);
        expect(isValidCategory('mindset')).toBe(true);
      });

      it('should return false for invalid categories', () => {
        expect(isValidCategory('invalid')).toBe(false);
        expect(isValidCategory('')).toBe(false);
        expect(isValidCategory('Diagnosis')).toBe(false); // case sensitive
      });
    });

    describe('Constants', () => {
      it('should have all topics mapped', () => {
        expect(Object.keys(TOPIC_TO_CATEGORY)).toHaveLength(6);
        VALID_TOPICS.forEach(topic => {
          expect(TOPIC_TO_CATEGORY[topic]).toBeDefined();
        });
      });

      it('should have all categories with display names', () => {
        expect(Object.keys(CATEGORY_DISPLAY)).toHaveLength(4);
        VALID_CATEGORIES.forEach(category => {
          expect(CATEGORY_DISPLAY[category]).toBeDefined();
          expect(CATEGORY_DISPLAY[category].length).toBeGreaterThan(0);
        });
      });
    });
  });
});
