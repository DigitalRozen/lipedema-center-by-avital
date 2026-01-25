# Requirements Document

## Introduction

מערכת להמרת פוסטים מאינסטגרם למאמרי SEO מלאים בעברית עבור פלטפורמת הסמכות של אביטל רוזן בנושא ליפאדמה. המערכת לוקחת תוכן גולמי מאינסטגרם (כולל כיתובים, נושאים ושאלות משתמשים) והופכת אותו למאמרים מקצועיים, מותאמי SEO, בקול ובסגנון של אביטל.

## Glossary

- **Instagram_Post**: פוסט מקורי מאינסטגרם הכולל id, topic, raw_caption, image_url, user_questions
- **SEO_Article**: מאמר מלא מותאם SEO הכולל כותרת, slug, meta description, תוכן מורחב, Q&A ותגיות
- **Article_Converter**: מודול ההמרה שמרחיב תוכן קצר למאמר מלא
- **Avital_Voice**: סגנון הכתיבה הייחודי של אביטל - "Tough Love but with a hug"
- **Topic_Category**: קטגוריית הנושא (Treatment, Anti-Inflammatory, Lymphedema, Nutrition, Diagnosis, General Lipedema)
- **SEO_Keywords**: מילות מפתח לאופטימיזציה: "טיפול בליפאדמה", "תזונה לליפאדמה", "הצרת היקפים", "ניקוז לימפתי"
- **User_Question**: שאלה שנשאלה על ידי עוקבים בתגובות לפוסט המקורי
- **Article_Tag**: תגית לסיווג מאמר מתוך: [תזונה, טיפול שמרני, ניתוחים, סיפורי הצלחה, אבחון, תוספי תזונה]

## Requirements

### Requirement 1: קריאת ופענוח פוסטים מאינסטגרם

**User Story:** כמנהלת תוכן, אני רוצה לטעון פוסטים מקובץ JSON, כדי שאוכל להמיר אותם למאמרי SEO.

#### Acceptance Criteria

1. WHEN the system receives a JSON file with Instagram posts, THE Article_Converter SHALL parse all posts with fields: id, topic, raw_caption, image_url, user_questions
2. WHEN parsing succeeds, THE Article_Converter SHALL validate that each post has a non-empty raw_caption
3. IF a post has an empty raw_caption (only hashtags), THEN THE Article_Converter SHALL skip it and log a warning
4. WHEN parsing completes, THE Article_Converter SHALL report the count of valid posts ready for conversion

### Requirement 2: יצירת מטא-דאטה SEO

**User Story:** כמנהלת תוכן, אני רוצה שכל מאמר יכלול מטא-דאטה מותאם SEO, כדי שהמאמרים ידורגו גבוה בגוגל.

#### Acceptance Criteria

1. WHEN converting a post to an article, THE Article_Converter SHALL generate a catchy Hebrew title (H1) that is NOT the original caption
2. WHEN generating a title, THE Article_Converter SHALL create an engaging hook that addresses the reader's pain point
3. WHEN converting a post, THE Article_Converter SHALL generate an English slug in kebab-case format derived from the topic and key content
4. WHEN generating a meta description, THE Article_Converter SHALL create a description of maximum 155 characters that includes the keyword "טיפול בליפאדמה"
5. WHEN assigning tags, THE Article_Converter SHALL select from the predefined list: [תזונה, טיפול שמרני, ניתוחים, סיפורי הצלחה, אבחון, תוספי תזונה]
6. THE Article_Converter SHALL assign 1-3 relevant tags per article based on content analysis

### Requirement 3: הרחבת תוכן בסגנון אביטל

**User Story:** כמבקרת באתר, אני רוצה לקרוא מאמרים מקצועיים ואמפתיים, כדי שארגיש שמישהי מבינה אותי ומספקת לי מידע אמין.

#### Acceptance Criteria

1. WHEN expanding content, THE Article_Converter SHALL follow the Avital Voice structure: Hook (Pain Point) → Empathy → Science → Protocol → Bridge (CTA)
2. WHEN writing in Hebrew, THE Article_Converter SHALL avoid translationese (עברית מתורגמת) and use natural Hebrew phrasing
3. WHEN discussing medical topics, THE Article_Converter SHALL use specific medical vocabulary: לימפה, בצקת, רקמה פיברוטית, דלקתיות, נוגדי חמצון, מערכת הלימפה
4. WHEN the original caption is short (under 200 characters), THE Article_Converter SHALL expand it using Lipedema domain knowledge to create a full article
5. WHEN the original caption is detailed, THE Article_Converter SHALL restructure and enhance it with additional context and explanations
6. THE Article_Converter SHALL maintain a tone that is "direct about medical reality but deeply empathetic"

### Requirement 4: מענה לשאלות משתמשים

**User Story:** כמבקרת באתר, אני רוצה לראות תשובות לשאלות נפוצות, כדי שאמצא מענה לשאלות שגם לי יש.

#### Acceptance Criteria

1. WHEN a post has user_questions, THE Article_Converter SHALL include a Q&A section in the article
2. WHEN answering user questions, THE Article_Converter SHALL respond as Avital - professionally, empathetically, and with authority
3. WHEN a question asks for doctor recommendations, THE Article_Converter SHALL provide general guidance without specific names
4. WHEN a question is about diagnosis or treatment, THE Article_Converter SHALL answer with medical accuracy while recommending professional consultation
5. IF a post has no user_questions, THEN THE Article_Converter SHALL omit the Q&A section

### Requirement 5: מבנה מאמר SEO

**User Story:** כמנהלת תוכן, אני רוצה שכל מאמר יהיה במבנה אחיד, כדי שיהיה קל לפרסם ולתחזק.

#### Acceptance Criteria

1. WHEN generating an article, THE Article_Converter SHALL structure it with: Introduction (hook), H2 sections (expanded content), Q&A section (if applicable), Conclusion with CTA
2. WHEN creating H2 sections, THE Article_Converter SHALL use descriptive Hebrew headings that include relevant keywords
3. WHEN writing the conclusion, THE Article_Converter SHALL include a call-to-action directing to clinic consultation or related content
4. THE Article_Converter SHALL naturally incorporate SEO keywords: "טיפול בליפאדמה", "תזונה לליפאדמה", "הצרת היקפים", "ניקוז לימפתי"
5. WHEN outputting articles, THE Article_Converter SHALL format them as Markdown with articles separated by "---"

### Requirement 6: מיפוי נושאים לקטגוריות

**User Story:** כמנהלת תוכן, אני רוצה שהמאמרים יסווגו לקטגוריות הנכונות, כדי שיתאימו למבנה האתר.

#### Acceptance Criteria

1. WHEN a post has topic "Treatment", THE Article_Converter SHALL map it to category "physical" (טיפול פיזי ושיקום)
2. WHEN a post has topic "Anti-Inflammatory" or "Nutrition", THE Article_Converter SHALL map it to category "nutrition" (תזונה ונוטריציה)
3. WHEN a post has topic "Lymphedema" or "Diagnosis", THE Article_Converter SHALL map it to category "diagnosis" (אבחון וזיהוי)
4. WHEN a post has topic "General Lipedema", THE Article_Converter SHALL map it to category "mindset" (מיינדסט ורגש) or the most relevant category based on content
5. THE Article_Converter SHALL include the mapped category in the article metadata

### Requirement 7: פלט מאמרים

**User Story:** כמנהלת תוכן, אני רוצה לקבל קובץ Markdown עם כל המאמרים, כדי שאוכל לפרסם אותם באתר.

#### Acceptance Criteria

1. WHEN conversion completes, THE Article_Converter SHALL output a single Markdown file containing all articles
2. WHEN formatting the output, THE Article_Converter SHALL separate articles with "---" delimiter
3. WHEN outputting an article, THE Article_Converter SHALL include frontmatter with: title, slug, meta_description, tags, category, original_post_id, image_url
4. THE Article_Converter SHALL preserve the original image_url for each article
5. WHEN conversion completes, THE Article_Converter SHALL report statistics: total posts processed, articles generated, posts skipped

