# Requirements Document

## Introduction

פלטפורמת B2C Authority לליפאדמה - מערכת שמשלבת 80% תוכן לבניית סמכות ואמון עם 20% מנועי הכנסה. המערכת מבוססת על תוכן שנאסף מאינסטגרם ומאורגן בצורה היררכית כ"ויקי-ליפאדמה", עם שלושה מנועי מונטיזציה: Contextual Upsell (אפיליאייט), מוצרים דיגיטליים (Low Ticket), ולידים לקליניקה (High Ticket).

## Glossary

- **Knowledge_Hub**: מרכז הידע ההיררכי ("ויקי-ליפאדמה") המכיל את כל התוכן המאורגן לפי קטגוריות
- **Category_Tree**: עץ הקטגוריות ההיררכי (אבחון, תזונה, טיפול פיזי, מיינדסט)
- **Tagging_System**: מערכת התגיות האוטומטית לסיווג תוכן
- **Contextual_Upsell_Engine**: מנוע ההמלצות שמציג מוצרי אפיליאייט רלוונטיים בתוך מאמרים
- **Digital_Product**: מוצר דיגיטלי (PDF, מדריך) למכירה ישירה
- **Affiliate_Product**: מוצר פיזי עם לינק שותפים (אמזון/אייהרב)
- **Lead_Capture_Form**: טופס לאיסוף לידים לקליניקה
- **Content_Importer**: מודול לייבוא תוכן מאינסטגרם
- **Post**: מאמר/פוסט במרכז הידע
- **Product**: מוצר (דיגיטלי או אפיליאייט)
- **Waitlist_Entry**: רשומת ליד ברשימת ההמתנה לקליניקה

## Requirements

### Requirement 1: מרכז ידע היררכי (Knowledge Hub)

**User Story:** כמבקרת באתר, אני רוצה לגלוש במרכז ידע מאורגן היררכית, כדי שאוכל למצוא מידע רלוונטי לליפאדמה בקלות ולהרגיש שמישהו מבין אותי.

#### Acceptance Criteria

1. WHEN a visitor navigates to the Knowledge_Hub, THE System SHALL display a hierarchical category tree with main categories: diagnosis (אבחון וזיהוי), nutrition (תזונה ונוטריציה), physical (טיפול פיזי ושיקום), mindset (מיינדסט ורגש)
2. WHEN a visitor selects a category, THE System SHALL display all posts belonging to that category
3. WHEN displaying posts, THE System SHALL show post title, excerpt, image_url, tags, category_display badge, and date
4. WHEN a visitor searches for content, THE System SHALL filter posts by title, content, and tags
5. THE System SHALL support Hebrew RTL layout throughout the Knowledge_Hub
6. WHEN a post has related posts (by shared tags), THE System SHALL display them as suggestions
7. WHEN displaying a single post, THE System SHALL show the full content with original_url link to Instagram source

### Requirement 2: מערכת תגיות אוטומטית (Tagging System)

**User Story:** כמנהלת תוכן, אני רוצה שהמערכת תתייג פוסטים אוטומטית, כדי שאוכל לארגן תוכן ביעילות ולאפשר התאמת מוצרים.

#### Acceptance Criteria

1. WHEN a new post is created, THE Tagging_System SHALL suggest relevant tags based on content analysis
2. WHEN tags are assigned to a post, THE System SHALL store them for product matching and search
3. THE System SHALL maintain a predefined tag taxonomy aligned with product trigger_tags
4. WHEN displaying a post, THE System SHALL show all associated tags as clickable filters

### Requirement 3: מנוע Contextual Upsell (אפיליאייט)

**User Story:** כמבקרת שקוראת מאמר, אני רוצה לראות מוצרים רלוונטיים להקשר, כדי שאוכל לרכוש פתרונות מומלצים בקלות.

#### Acceptance Criteria

1. WHEN a visitor reads a post with monetization_strategy "Affiliate (Products)", THE Contextual_Upsell_Engine SHALL display matching products based on trigger_tags matching post tags
2. WHEN displaying an Affiliate_Product, THE System SHALL show product name, image_url, description, price in ₪, and affiliate_link
3. WHEN a visitor clicks an affiliate link, THE System SHALL open the external store in a new tab with rel="noopener noreferrer"
4. THE System SHALL track affiliate link clicks for analytics
5. WHEN no matching products exist for a post, THE Contextual_Upsell_Engine SHALL hide the recommendations section
6. THE System SHALL prioritize products with type "Physical" for affiliate posts

### Requirement 4: מוצרים דיגיטליים (Low Ticket)

**User Story:** כמבקרת מעוניינת, אני רוצה לרכוש מדריכים דיגיטליים, כדי שאוכל ליישם פרוטוקולים בעצמי.

#### Acceptance Criteria

1. WHEN a post has monetization_strategy "Low Ticket (Digital Guide)", THE System SHALL display relevant Digital_Products prominently
2. WHEN displaying a Digital_Product, THE System SHALL show name, description, price in ₪, and purchase button
3. WHEN a visitor clicks purchase, THE System SHALL redirect to a checkout flow (affiliate_link)
4. THE System SHALL support displaying Digital_Products in a sticky sidebar or end-of-article CTA
5. WHEN a Digital_Product relates to article content (by trigger_tags), THE System SHALL highlight it as "מומלץ עבורך"
6. THE System SHALL filter products by type "Digital" for digital product displays

### Requirement 5: לידים לקליניקה (High Ticket)

**User Story:** כמבקרת שרוצה טיפול אישי, אני רוצה להירשם לתור בקליניקה, כדי שאקבל תוכנית טיפול מותאמת.

#### Acceptance Criteria

1. THE System SHALL display a prominent "התאמת תוכנית טיפול אישית" CTA in the header and footer
2. WHEN a post has monetization_strategy "High Ticket (Clinic Lead)", THE System SHALL display the clinic CTA more prominently within the article
3. WHEN a visitor clicks the CTA, THE Lead_Capture_Form SHALL open with fields: name (required), email (required), phone (optional), treatment_interest (multi-select)
4. WHEN a visitor submits the form, THE System SHALL validate all required fields are non-empty and email format is valid
5. WHEN form validation passes, THE System SHALL store the Waitlist_Entry in the database with quiz_answers if provided
6. WHEN submission succeeds, THE System SHALL display a confirmation message "תודה! ניצור איתך קשר בקרוב"
7. IF form validation fails, THEN THE System SHALL display specific error messages per field in Hebrew
8. THE System SHALL support an optional quiz to qualify leads before form submission, storing answers in quiz_answers JSON field

### Requirement 6: ייבוא תוכן מאינסטגרם

**User Story:** כמנהלת תוכן, אני רוצה לייבא פוסטים מאינסטגרם, כדי שאוכל להפוך תוכן קיים למאמרים באתר.

#### Acceptance Criteria

1. WHEN an admin uploads Instagram export JSON (site_content_db.json format), THE Content_Importer SHALL parse the content
2. WHEN parsing succeeds, THE Content_Importer SHALL create draft posts with: id, title, content, image_url, date, category_slug, category_display, monetization_strategy, original_url
3. WHEN creating a draft post, THE System SHALL auto-generate slug from title and set published to false
4. THE System SHALL allow admin to review and edit imported posts before setting published to true
5. IF parsing fails, THEN THE Content_Importer SHALL display an error with details about the malformed data
6. WHEN importing, THE System SHALL preserve the original Instagram post URL in original_url field

### Requirement 7: ניהול מוצרים

**User Story:** כמנהלת, אני רוצה לנהל מוצרים (אפיליאייט ודיגיטליים), כדי שאוכל לעדכן מחירים, לינקים ותגיות התאמה.

#### Acceptance Criteria

1. WHEN an admin accesses the products admin page, THE System SHALL display all products with filtering by type (Digital/Physical) and active status
2. WHEN an admin creates a product, THE System SHALL require: name, type (Digital/Physical), price (number), affiliate_link (valid URL), and optional trigger_tags array
3. WHEN an admin updates a product, THE System SHALL save changes and immediately reflect them in all contextual displays
4. WHEN an admin toggles product active status, THE System SHALL immediately show/hide it from the public site
5. THE System SHALL validate that affiliate_link is a valid URL format before saving
6. WHEN displaying products in admin, THE System SHALL show which posts would match each product based on trigger_tags

### Requirement 8: אנליטיקס ומעקב

**User Story:** כבעלת העסק, אני רוצה לעקוב אחר ביצועי התוכן והמוצרים, כדי שאוכל לייעל את האסטרטגיה.

#### Acceptance Criteria

1. THE System SHALL track page views per post
2. THE System SHALL track affiliate link clicks per product
3. THE System SHALL track lead form submissions
4. WHEN an admin views analytics, THE System SHALL display summary metrics and trends
5. THE System SHALL store analytics data for historical comparison
