/**
 * Property-Based Tests for Blog Utilities
 * 
 * @module lib/blog/utils.property.test
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getFallbackImage, isValidCategory, calculateReadingTime, type BlogCategory } from './utils';
import { categoryLabels } from '../keystatic';

/**
 * Valid category values as defined in the Keystatic schema
 */
const VALID_CATEGORIES: BlogCategory[] = ['diagnosis', 'nutrition', 'physical', 'mindset'];

describe('Property-Based Tests: Blog Utilities', () => {
  /**
   * Property 1: Category Mapping Completeness
   * 
   * For any valid category value ('diagnosis', 'nutrition', 'physical', 'mindset'),
   * both a Hebrew label and a fallback image path SHALL be defined and non-empty.
   * 
   * **Validates: Requirements 2.1, 2.9**
   */
  describe('Property 1: Category Mapping Completeness', () => {
    it('Feature: premium-blog-article-page, Property 1: For any valid category, a Hebrew label SHALL be defined and non-empty', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_CATEGORIES),
          (category) => {
            const label = categoryLabels[category];
            
            // Label must be defined
            expect(label).toBeDefined();
            
            // Label must be a non-empty string
            expect(typeof label).toBe('string');
            expect(label.length).toBeGreaterThan(0);
            
            // Label should contain Hebrew characters (Unicode range for Hebrew: \u0590-\u05FF)
            const hebrewPattern = /[\u0590-\u05FF]/;
            expect(hebrewPattern.test(label)).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 1: For any valid category, a fallback image path SHALL be defined and valid', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_CATEGORIES),
          (category) => {
            const fallbackImage = getFallbackImage(category);
            
            // Fallback image must be defined
            expect(fallbackImage).toBeDefined();
            
            // Fallback image must be a non-empty string
            expect(typeof fallbackImage).toBe('string');
            expect(fallbackImage.length).toBeGreaterThan(0);
            
            // Fallback image must start with /assets/ path
            expect(fallbackImage.startsWith('/assets/')).toBe(true);
            
            // Fallback image must have a valid image extension
            const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
            const hasValidExtension = validExtensions.some(ext => 
              fallbackImage.toLowerCase().endsWith(ext)
            );
            expect(hasValidExtension).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 1: Category labels and fallback images SHALL be complete for all valid categories', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_CATEGORIES),
          (category) => {
            // Both mappings must exist for every valid category
            const hasLabel = category in categoryLabels && categoryLabels[category].length > 0;
            const hasFallback = getFallbackImage(category).length > 0;
            
            expect(hasLabel).toBe(true);
            expect(hasFallback).toBe(true);
            
            return hasLabel && hasFallback;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 1: isValidCategory SHALL correctly identify all valid categories', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_CATEGORIES),
          (category) => {
            // All valid categories should return true
            expect(isValidCategory(category)).toBe(true);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 1: isValidCategory SHALL reject invalid category strings', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => !VALID_CATEGORIES.includes(s as BlogCategory)),
          (invalidCategory) => {
            // Invalid categories should return false
            expect(isValidCategory(invalidCategory)).toBe(false);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Reading Time Calculation
   * 
   * For any non-empty content string, the calculated reading time SHALL be
   * a positive integer greater than zero.
   * 
   * **Validates: Requirements 2.6**
   */
  describe('Property 3: Reading Time Calculation', () => {
    it('Feature: premium-blog-article-page, Property 3: For any non-empty content, reading time SHALL be a positive integer', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (content) => {
            const readingTime = calculateReadingTime(content);
            
            // Reading time must be a positive integer
            expect(Number.isInteger(readingTime)).toBe(true);
            expect(readingTime).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 3: Reading time SHALL be at least 1 minute for any content', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (content) => {
            const readingTime = calculateReadingTime(content);
            
            // Minimum reading time is 1 minute
            expect(readingTime).toBeGreaterThanOrEqual(1);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 3: Reading time SHALL increase with word count', () => {
      fc.assert(
        fc.property(
          // Generate two word arrays where the second has more words
          fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 50 }),
          fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 200, maxLength: 500 }),
          (shortWords, longWords) => {
            const shortContent = shortWords.join(' ');
            const longContent = longWords.join(' ');
            
            const shortTime = calculateReadingTime(shortContent);
            const longTime = calculateReadingTime(longContent);
            
            // Longer content should have equal or greater reading time
            expect(longTime).toBeGreaterThanOrEqual(shortTime);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 3: Reading time SHALL be consistent for same content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (content) => {
            const time1 = calculateReadingTime(content);
            const time2 = calculateReadingTime(content);
            
            // Same content should always produce same reading time
            expect(time1).toBe(time2);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Feature: premium-blog-article-page, Property 3: Reading time SHALL handle Hebrew content correctly', () => {
      // Hebrew alphabet characters for generating test content
      const hebrewChars = 'אבגדהוזחטיכלמנסעפצקרשת';
      
      fc.assert(
        fc.property(
          // Generate Hebrew-like content using array of Hebrew words
          fc.array(
            fc.array(
              fc.constantFrom(...hebrewChars.split('')),
              { minLength: 2, maxLength: 10 }
            ).map(chars => chars.join('')),
            { minLength: 1, maxLength: 100 }
          ),
          (hebrewWords) => {
            const hebrewContent = hebrewWords.join(' ');
            const readingTime = calculateReadingTime(hebrewContent);
            
            // Hebrew content should produce valid reading time
            expect(Number.isInteger(readingTime)).toBe(true);
            expect(readingTime).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
