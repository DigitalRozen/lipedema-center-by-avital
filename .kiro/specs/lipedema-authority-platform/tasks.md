# Implementation Plan: Lipedema Authority Platform

## Overview

תוכנית יישום לפלטפורמת B2C Authority לליפאדמה. המימוש מתבסס על התשתית הקיימת (Next.js + Supabase) ומרחיב אותה עם מנועי מונטיזציה קונטקסטואליים. הגישה היא incremental - כל שלב בונה על הקודם ומאפשר בדיקה מיידית.

## Tasks

- [x] 1. הרחבת סכמת מסד הנתונים
  - [x] 1.1 הוספת שדות monetization_strategy, original_url, category_display לטבלת posts
    - הרצת migration ב-Supabase להוספת העמודות
    - _Requirements: 1.1, 6.2_
  - [x] 1.2 יצירת טבלת analytics_events
    - יצירת טבלה עם שדות: id, event_type, post_id, product_id, metadata, created_at
    - הוספת אינדקסים לשאילתות
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 1.3 עדכון TypeScript types
    - הרחבת database.ts עם הטיפוסים החדשים
    - _Requirements: 1.1, 8.1_

- [x] 2. מודול ייבוא תוכן מאינסטגרם
  - [x] 2.1 יצירת Content Importer parser
    - מימוש parseInstagramExport לפענוח JSON
    - מימוש generateSlug ליצירת slug מעברית
    - _Requirements: 6.1, 6.3_
  - [ ]* 2.2 כתיבת property test לייבוא
    - **Property 15: JSON Import Parsing**
    - **Property 16: Import Field Mapping Round-Trip**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [x] 2.3 יצירת דף admin לייבוא
    - ממשק להעלאת קובץ JSON
    - תצוגת תוצאות ייבוא עם שגיאות
    - _Requirements: 6.4, 6.5_

- [x] 3. Checkpoint - וידוא ייבוא עובד
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. מנוע התאמת מוצרים
  - [x] 4.1 יצירת Product Matching Engine
    - מימוש matchProductsToPost עם tag matching
    - מימוש סינון לפי product type
    - מימוש מיון לפי match score ו-type priority
    - _Requirements: 3.1, 3.6, 4.1, 4.6_
  - [x] 4.2 כתיבת property tests למנוע ההתאמה
    - **Property 6: Product-Post Tag Matching**
    - **Property 10: Product Type Prioritization**
    - **Validates: Requirements 3.1, 3.6, 4.1, 4.6**

- [x] 5. קומפוננטת Contextual Upsell
  - [x] 5.1 שדרוג RecommendedProducts component
    - הוספת תמיכה ב-monetization_strategy
    - הוספת תצוגת "מומלץ עבורך" למוצרים תואמים
    - הוספת rel="noopener noreferrer" לקישורים
    - _Requirements: 3.2, 3.3, 4.2, 4.5_
  - [x] 5.2 כתיבת property tests לתצוגת מוצרים
    - **Property 7: Product Display Completeness**
    - **Property 8: Affiliate Link Security Attributes**
    - **Property 11: Recommended Label for Matching Products**
    - **Validates: Requirements 3.2, 3.3, 4.5**

- [x] 6. מערכת אנליטיקס
  - [x] 6.1 יצירת Analytics service
    - מימוש trackPageView, trackAffiliateClick, trackLeadSubmit
    - שמירה לטבלת analytics_events
    - _Requirements: 3.4, 8.1, 8.2, 8.3_
  - [x] 6.2 כתיבת property test לאנליטיקס
    - **Property 9: Analytics Event Creation**
    - **Validates: Requirements 3.4, 8.1, 8.3**

- [x] 7. שילוב Analytics בקומפוננטים
  - [x] 7.1 הוספת page view tracking לפוסטים
    - שילוב trackPageView ב-[slug]/page.tsx
    - _Requirements: 8.1_
  - [x] 7.2 הוספת affiliate click tracking למוצרים
    - שילוב trackAffiliateClick ב-RecommendedProducts
    - _Requirements: 8.2_

- [x] 8. טופס לידים לקליניקה - שדרוג הקיים
  - [x] 8.1 יצירת Form Validation module
    - מימוש validateLeadForm עם הודעות שגיאה בעברית
    - מימוש isValidEmail
    - _Requirements: 5.4, 5.7_
  - [ ]* 8.2 כתיבת property test לוולידציה
    - **Property 13: Form Validation Correctness**
    - **Validates: Requirements 5.4, 5.7**
  - [x] 8.3 שדרוג clinic page עם validation
    - הוספת client-side validation לטופס הקיים
    - שיפור הודעות שגיאה
    - _Requirements: 5.4, 5.7_
  - [x] 8.4 הוספת analytics tracking לטופס
    - שילוב trackLeadSubmit בטופס הקיים
    - _Requirements: 8.3_
  - [ ]* 8.5 כתיבת property test לשמירת לידים
    - **Property 14: Lead Storage Round-Trip**
    - **Validates: Requirements 5.5**

- [x] 9. שילוב CTA בקליניקה
  - [x] 9.1 הוספת Clinic CTA ל-Header ו-Footer
    - כפתור "התאמת תוכנית טיפול אישית" בולט
    - _Requirements: 5.1_
  - [x] 9.2 הוספת Clinic CTA לפוסטים High Ticket
    - תצוגה בולטת בתוך מאמרים עם monetization_strategy מתאים
    - _Requirements: 5.2_
  - [ ]* 9.3 כתיבת property test ל-CTA
    - **Property 12: Clinic CTA in High Ticket Posts**
    - **Validates: Requirements 5.2**

- [x] 10. שדרוג Knowledge Hub לקטגוריות חדשות
  - [x] 10.1 הוספת קטגוריות חדשות (diagnosis, nutrition, physical, mindset)
    - עדכון CATEGORIES array בקומפוננט Knowledge Hub
    - עדכון translations עם תרגומים עבריים
    - עדכון PostCategory type ב-database.ts
    - _Requirements: 1.1_
  - [x] 10.2 שיפור תצוגת פוסטים
    - הוספת original_url link בתצוגת פוסט יחיד
    - שימוש ב-category_display במקום category
    - _Requirements: 1.3, 1.7_
  - [ ]* 10.3 כתיבת property tests לתצוגה
    - **Property 2: Post Display Completeness**
    - **Validates: Requirements 1.3, 1.7, 2.4**

- [x] 11. מערכת חיפוש וסינון
  - [x] 11.1 שיפור פונקציית חיפוש
    - חיפוש ב-title, content, tags
    - _Requirements: 1.4_
  - [ ]* 11.2 כתיבת property tests לחיפוש
    - **Property 1: Category Filtering Correctness**
    - **Property 3: Search Filtering Correctness**
    - **Validates: Requirements 1.2, 1.4**
  - [ ] 11.3 הוספת פוסטים קשורים
    - תצוגת פוסטים עם תגיות משותפות בתצוגת פוסט יחיד
    - _Requirements: 1.6_
  - [ ]* 11.4 כתיבת property test לפוסטים קשורים
    - **Property 4: Related Posts Tag Overlap**
    - **Validates: Requirements 1.6**

- [x] 12. ניהול מוצרים (Admin)
  - [x] 12.1 שיפור דף ניהול מוצרים
    - סינון לפי type ו-active status
    - תצוגת פוסטים תואמים לכל מוצר
    - _Requirements: 7.1, 7.6_
  - [ ] 12.2 יצירת Product Validation module
    - וולידציה של שדות חובה
    - וולידציה של URL format
    - _Requirements: 7.2, 7.5_
  - [ ]* 12.3 כתיבת property tests לוולידציה
    - **Property 17: Product Validation**
    - **Property 18: Product Update Round-Trip**
    - **Property 19: Product Active Status Filtering**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

- [ ] 13. דף אנליטיקס (Admin)
  - [ ] 13.1 יצירת דף סיכום אנליטיקס
    - תצוגת מטריקות: צפיות, קליקים, לידים
    - גרפים של מגמות
    - _Requirements: 8.4, 8.5_

- [ ] 14. Checkpoint - וידוא כל המערכת
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation builds on existing Next.js + Supabase infrastructure
