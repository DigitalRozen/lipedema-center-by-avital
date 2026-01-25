# Implementation Plan: Instagram to SEO Articles Converter

## Overview

תוכנית יישום לממיר פוסטים מאינסטגרם למאמרי SEO. המימוש מתבסס על TypeScript ומשתמש ב-pipeline של עיבוד. הגישה היא incremental - כל שלב בונה על הקודם ומאפשר בדיקה מיידית.

## Tasks

- [x] 1. הקמת תשתית הממיר
  - [x] 1.1 יצירת מבנה תיקיות ו-types בסיסיים
    - יצירת תיקיית src/lib/converter
    - הגדרת TypeScript interfaces: InstagramPost, TopicType, SEOArticle
    - _Requirements: 1.1_
  - [x] 1.2 כתיבת property test לפענוח JSON
    - **Property 1: JSON Parsing Round-Trip**
    - **Validates: Requirements 1.1, 7.4**

- [x] 2. מודול וולידציה
  - [x] 2.1 יצירת Post Validator
    - מימוש validatePost לבדיקת כיתובים תקינים
    - מימוש isHashtagOnly לזיהוי פוסטים עם האשטגים בלבד
    - _Requirements: 1.2, 1.3_
  - [x] 2.2 כתיבת property test לוולידציה
    - **Property 2: Hashtag-Only Caption Detection**
    - **Validates: Requirements 1.2, 1.3**

- [x] 3. מודול מיפוי נושאים
  - [x] 3.1 יצירת Topic Mapper
    - מימוש mapTopicToCategory עם מיפוי קבוע
    - הגדרת TOPIC_TO_CATEGORY ו-CATEGORY_DISPLAY
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 3.2 כתיבת property test למיפוי
    - **Property 14: Topic to Category Mapping**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 4. Checkpoint - וידוא תשתית עובדת
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. מודול יצירת SEO
  - [x] 5.1 יצירת SEO Generator
    - מימוש generateSlug ליצירת slug באנגלית
    - מימוש generateMetaDescription עם מגבלת 155 תווים
    - מימוש selectTags לבחירת 1-3 תגיות
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6_
  - [x] 5.2 כתיבת property tests ל-SEO
    - **Property 4: Title Differs From Caption**
    - **Property 5: Slug Format Validation**
    - **Property 6: Meta Description Constraints**
    - **Property 7: Tag Validation**
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.6**

- [x] 6. מודול הרחבת תוכן
  - [x] 6.1 יצירת Content Expander
    - מימוש expandContent עם זיהוי כיתובים קצרים/ארוכים
    - מימוש expandShortCaption להרחבה עם ידע תחום
    - מימוש restructureDetailedCaption לארגון מחדש
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  - [x] 6.2 כתיבת property tests להרחבה
    - **Property 8: Short Caption Expansion**
    - **Property 9: Medical Vocabulary Presence**
    - **Validates: Requirements 3.3, 3.4**

- [x] 7. מודול Q&A
  - [x] 7.1 יצירת Q&A Generator
    - מימוש generateQASection ליצירת מקטע שאלות ותשובות
    - מימוש generateAnswer לתשובות בסגנון אביטל
    - וידוא אי-הכללת שמות רופאים ספציפיים
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 7.2 כתיבת property tests ל-Q&A
    - **Property 10: Q&A Section Presence**
    - **Property 11: No Specific Doctor Names in Answers**
    - **Validates: Requirements 4.1, 4.3, 4.5**

- [x] 8. Checkpoint - וידוא מודולי עיבוד
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. מודול פורמט Markdown
  - [x] 9.1 יצירת Markdown Formatter
    - מימוש formatArticle ליצירת מאמר בודד
    - מימוש formatFrontmatter ליצירת YAML frontmatter
    - מימוש formatOutput לחיבור כל המאמרים עם מפריד "---"
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 7.1, 7.2, 7.3_
  - [x] 9.2 כתיבת property tests לפורמט
    - **Property 12: Article Structure Completeness**
    - **Property 13: SEO Keywords Presence**
    - **Property 15: Frontmatter Completeness**
    - **Property 16: Article Separator Format**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3**

- [x] 10. אינטגרציה וסטטיסטיקות
  - [x] 10.1 יצירת Main Converter
    - חיבור כל המודולים ל-pipeline אחד
    - מימוש convertPosts כפונקציה ראשית
    - מימוש generateStatistics לדיווח סטטיסטיקות
    - _Requirements: 1.4, 7.5_
  - [x] 10.2 כתיבת property test לסטטיסטיקות
    - **Property 3: Valid Post Count Consistency**
    - **Validates: Requirements 1.4, 7.5**

- [x] 11. סקריפט הרצה
  - [x] 11.1 יצירת CLI script
    - סקריפט להרצת ההמרה מקובץ JSON
    - פלט לקובץ Markdown
    - הדפסת סטטיסטיקות
    - _Requirements: 7.1, 7.5_

- [x] 12. Checkpoint - וידוא מערכת מלאה
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. הרצת ההמרה על relevant_posts.json
  - [x] 13.1 המרת כל הפוסטים למאמרי SEO
    - הרצת הסקריפט על relevant_posts.json
    - יצירת קובץ seo_articles.md
    - בדיקת תוצאות והתאמות
    - _Requirements: All_

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript for type safety

