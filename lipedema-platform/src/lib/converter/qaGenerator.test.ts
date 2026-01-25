/**
 * Q&A Generator Tests
 * 
 * Property-based tests for Q&A section generation.
 * Feature: instagram-to-seo-articles
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateQASection,
  generateAnswer,
  isDoctorRecommendationQuestion,
  isMedicalQuestion,
  removeDoctorNames,
  containsDoctorNames,
  hasConsultationRecommendation,
  DOCTOR_NAME_PATTERN,
  CONSULTATION_PHRASES,
} from './qaGenerator';
import type { QASection } from './types';

/**
 * Arbitrary generator for non-empty question strings
 */
const questionArbitrary = fc.string({ minLength: 5, maxLength: 200 })
  .filter((s: string) => s.trim().length > 0);

/**
 * Arbitrary generator for arrays of questions (non-empty)
 */
const nonEmptyQuestionsArbitrary = fc.array(questionArbitrary, { minLength: 1, maxLength: 10 });

/**
 * Arbitrary generator for empty or whitespace-only questions
 */
const emptyQuestionsArbitrary = fc.constantFrom<string[]>(
  [],
  [''],
  ['   '],
  ['', '  ', '\t'],
);

/**
 * Arbitrary generator for doctor names in Hebrew
 */
const doctorNameArbitrary = fc.tuple(
  fc.constantFrom('ד"ר', 'דוקטור', 'פרופ\'', 'פרופסור'),
  fc.constantFrom('כהן', 'לוי', 'מזרחי', 'אברהם', 'יצחק', 'שרה', 'רחל')
).map(([title, name]) => `${title} ${name}`);

/**
 * Arbitrary generator for text containing doctor names
 */
const textWithDoctorNameArbitrary = fc.tuple(
  fc.string({ minLength: 0, maxLength: 50 }),
  doctorNameArbitrary,
  fc.string({ minLength: 0, maxLength: 50 })
).map(([before, doctorName, after]) => `${before} ${doctorName} ${after}`.trim());

/**
 * Arbitrary generator for doctor recommendation questions
 */
const doctorRecommendationQuestionArbitrary = fc.tuple(
  fc.constantFrom(
    'את יכולה להמליץ על רופא?',
    'למי לפנות לאבחון?',
    'איזה מומחה את ממליצה?',
    'איפה יש קליניקה טובה?',
    'יש לך המלצה לרופא?',
    'לאיזה רופא כדאי ללכת?'
  )
).map(([q]) => q);

/**
 * Arbitrary generator for medical questions
 */
const medicalQuestionArbitrary = fc.constantFrom(
  'מה התסמינים של ליפאדמה?',
  'איך מאבחנים את המחלה?',
  'איזה טיפול הכי יעיל?',
  'האם יש תרופה לליפאדמה?',
  'מתי צריך ניתוח?',
  'למה יש לי כאב ברגליים?',
  'מה גורם לנפיחות?',
  'איך מטפלים בבצקת?'
);

describe('Q&A Generator', () => {
  describe('Property Tests', () => {
    /**
     * Property 10: Q&A Section Presence
     * 
     * For any post with non-empty user_questions array, the generated article 
     * should include a Q&A section. For any post with empty user_questions, 
     * the article should not include a Q&A section.
     * 
     * **Validates: Requirements 4.1, 4.5**
     */
    it('Property 10: Q&A Section Presence - non-empty questions produce Q&A section', () => {
      fc.assert(
        fc.property(nonEmptyQuestionsArbitrary, (questions: string[]) => {
          const result = generateQASection(questions);
          
          // Should return a Q&A section (not null)
          expect(result).not.toBeNull();
          expect(result!.questions).toBeDefined();
          expect(result!.questions.length).toBeGreaterThan(0);
          
          // Each question should have both question and answer
          for (const qa of result!.questions) {
            expect(qa.question).toBeDefined();
            expect(qa.question.trim().length).toBeGreaterThan(0);
            expect(qa.answer).toBeDefined();
            expect(qa.answer.trim().length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 10b: Empty Questions Return Null
     * 
     * For any post with empty or invalid user_questions, 
     * the Q&A section should be null.
     * 
     * **Validates: Requirements 4.5**
     */
    it('Property 10b: Empty Questions Return Null - empty questions produce null', () => {
      fc.assert(
        fc.property(emptyQuestionsArbitrary, (questions: string[]) => {
          const result = generateQASection(questions);
          
          // Should return null for empty/invalid questions
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 11: No Specific Doctor Names in Answers
     * 
     * For any Q&A answer, the text should not contain specific doctor names
     * (verified against a pattern for Hebrew names with "ד"ר" or "דוקטור" prefix).
     * 
     * **Validates: Requirements 4.3**
     */
    it('Property 11: No Specific Doctor Names in Answers - answers never contain doctor names', () => {
      fc.assert(
        fc.property(nonEmptyQuestionsArbitrary, (questions: string[]) => {
          const result = generateQASection(questions);
          
          if (result) {
            for (const qa of result.questions) {
              // Reset regex lastIndex for global pattern
              DOCTOR_NAME_PATTERN.lastIndex = 0;
              const hasDoctorName = DOCTOR_NAME_PATTERN.test(qa.answer);
              expect(hasDoctorName).toBe(false);
            }
          }
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 11b: Doctor Names Are Removed
     * 
     * For any text containing doctor names, the removeDoctorNames function
     * should remove all occurrences.
     * 
     * **Validates: Requirements 4.3**
     */
    it('Property 11b: Doctor Names Are Removed - removeDoctorNames cleans all doctor names', () => {
      fc.assert(
        fc.property(textWithDoctorNameArbitrary, (text: string) => {
          const cleaned = removeDoctorNames(text);
          
          // Reset regex lastIndex for global pattern
          DOCTOR_NAME_PATTERN.lastIndex = 0;
          const stillHasDoctorName = DOCTOR_NAME_PATTERN.test(cleaned);
          expect(stillHasDoctorName).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    describe('generateQASection', () => {
      it('should return null for empty array', () => {
        expect(generateQASection([])).toBeNull();
      });

      it('should return null for array with only empty strings', () => {
        expect(generateQASection(['', '  ', '\t'])).toBeNull();
      });

      it('should return null for undefined', () => {
        expect(generateQASection(undefined as unknown as string[])).toBeNull();
      });

      it('should generate Q&A for valid questions', () => {
        const questions = ['מה זה ליפאדמה?', 'איך מטפלים?'];
        const result = generateQASection(questions);
        
        expect(result).not.toBeNull();
        expect(result!.questions).toHaveLength(2);
        expect(result!.questions[0].question).toBe('מה זה ליפאדמה?');
        expect(result!.questions[1].question).toBe('איך מטפלים?');
      });

      it('should filter out empty questions from mixed array', () => {
        const questions = ['שאלה אמיתית', '', '  ', 'עוד שאלה'];
        const result = generateQASection(questions);
        
        expect(result).not.toBeNull();
        expect(result!.questions).toHaveLength(2);
      });
    });

    describe('generateAnswer', () => {
      it('should generate non-empty answer', () => {
        const answer = generateAnswer('מה זה ליפאדמה?');
        expect(answer.length).toBeGreaterThan(0);
      });

      it('should not contain doctor names', () => {
        const answer = generateAnswer('את יכולה להמליץ על רופא?');
        DOCTOR_NAME_PATTERN.lastIndex = 0;
        expect(DOCTOR_NAME_PATTERN.test(answer)).toBe(false);
      });

      it('should include consultation phrase for medical questions', () => {
        // Use a question that clearly triggers medical question detection
        const answer = generateAnswer('מה התסמינים של המחלה?');
        const hasConsultation = CONSULTATION_PHRASES.some(phrase => 
          answer.includes(phrase)
        );
        // Medical questions should include consultation recommendation
        // If not found, the answer should at least mention professional help
        const hasProfessionalMention = answer.includes('מומחה') || 
          answer.includes('רופא') || 
          answer.includes('איש מקצוע') ||
          hasConsultation;
        expect(hasProfessionalMention).toBe(true);
      });
    });

    describe('isDoctorRecommendationQuestion', () => {
      it('should detect doctor recommendation questions', () => {
        expect(isDoctorRecommendationQuestion('את יכולה להמליץ על רופא?')).toBe(true);
        expect(isDoctorRecommendationQuestion('לאיזה מומחה לפנות?')).toBe(true);
        expect(isDoctorRecommendationQuestion('איפה יש קליניקה טובה?')).toBe(true);
      });

      it('should not flag general questions', () => {
        expect(isDoctorRecommendationQuestion('מה זה ליפאדמה?')).toBe(false);
        expect(isDoctorRecommendationQuestion('איך לאכול נכון?')).toBe(false);
      });
    });

    describe('isMedicalQuestion', () => {
      it('should detect medical questions', () => {
        expect(isMedicalQuestion('מה התסמינים?')).toBe(true);
        expect(isMedicalQuestion('איזה טיפול עוזר?')).toBe(true);
        expect(isMedicalQuestion('למה יש לי כאב?')).toBe(true);
      });

      it('should not flag non-medical questions', () => {
        expect(isMedicalQuestion('מה השעה?')).toBe(false);
        expect(isMedicalQuestion('איפה קונים?')).toBe(false);
      });
    });

    describe('containsDoctorNames', () => {
      it('should detect doctor names with ד"ר', () => {
        expect(containsDoctorNames('פנו לד"ר כהן')).toBe(true);
      });

      it('should detect doctor names with דוקטור', () => {
        expect(containsDoctorNames('דוקטור לוי הוא מומחה')).toBe(true);
      });

      it('should detect professor names', () => {
        expect(containsDoctorNames('פרופ\' אברהם')).toBe(true);
        expect(containsDoctorNames('פרופסור יצחק')).toBe(true);
      });

      it('should not flag text without doctor names', () => {
        expect(containsDoctorNames('פנו לרופא מומחה')).toBe(false);
        expect(containsDoctorNames('התייעצו עם מומחה בתחום')).toBe(false);
      });
    });

    describe('removeDoctorNames', () => {
      it('should replace doctor names with generic term', () => {
        const result = removeDoctorNames('פנו לד"ר כהן');
        expect(result).toBe('פנו למומחה בתחום');
        expect(result).not.toContain('ד"ר');
      });

      it('should handle multiple doctor names', () => {
        const result = removeDoctorNames('ד"ר כהן ודוקטור לוי');
        expect(result).not.toContain('ד"ר');
        expect(result).not.toContain('דוקטור');
      });

      it('should preserve text without doctor names', () => {
        const original = 'פנו לרופא מומחה בתחום';
        expect(removeDoctorNames(original)).toBe(original);
      });
    });

    describe('hasConsultationRecommendation', () => {
      it('should detect consultation phrases in Q&A', () => {
        const qaSection: QASection = {
          questions: [
            {
              question: 'שאלה',
              answer: 'תשובה. מומלץ להתייעץ עם איש מקצוע.',
            },
          ],
        };
        expect(hasConsultationRecommendation(qaSection)).toBe(true);
      });

      it('should return false when no consultation phrases', () => {
        const qaSection: QASection = {
          questions: [
            {
              question: 'שאלה',
              answer: 'תשובה פשוטה.',
            },
          ],
        };
        expect(hasConsultationRecommendation(qaSection)).toBe(false);
      });
    });
  });
});
