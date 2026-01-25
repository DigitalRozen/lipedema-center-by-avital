# Scripts - Lipedema Platform

סקריפטים לניהול הפלטפורמה.

---

## Instagram to SEO Articles Converter

### `convert-instagram-to-seo.js`
סקריפט להמרת פוסטים מאינסטגרם למאמרי SEO בפורמט Markdown.

```bash
# הצגת עזרה
node scripts/convert-instagram-to-seo.js --help

# המרת פוסטים מקובץ JSON
node scripts/convert-instagram-to-seo.js ../relevant_posts.json ./seo_articles.md

# המרה עם קובץ פלט ברירת מחדל (seo_articles.md)
node scripts/convert-instagram-to-seo.js ../relevant_posts.json
```

**תכונות:**
- קריאת פוסטים מקובץ JSON
- יצירת מאמרי SEO עם frontmatter מלא
- מיפוי נושאים לקטגוריות
- יצירת מקטעי Q&A מתוך שאלות משתמשים
- דילוג על פוסטים עם האשטגים בלבד
- הדפסת סטטיסטיקות המרה

**פורמט קלט (JSON):**
```json
[
  {
    "id": "123456789",
    "topic": "Treatment",
    "raw_caption": "תוכן הפוסט...",
    "image_url": "https://...",
    "user_questions": ["שאלה 1?", "שאלה 2?"]
  }
]
```

**פורמט פלט (Markdown):**
```markdown
---
title: "כותרת המאמר"
slug: "treatment-123456789"
meta_description: "תיאור קצר | טיפול בליפאדמה"
tags: ["תזונה", "טיפול שמרני"]
category: "physical"
original_post_id: "123456789"
image_url: "https://..."
---

תוכן המאמר...

## שאלות ותשובות

**שאלה:** שאלה 1?
**תשובה:** תשובה מקצועית...
```

---

## Product Image Management Scripts

סקריפטים לניהול תמונות מוצרי אפילייאיט בפלטפורמת ליפאדמה.

## סקריפטים זמינים

### 1. `update-product-images.js`
סקריפט בסיסי לעדכון תמונות מוצרים.

```bash
# עדכון תמונות למוצרים ספציפיים
node scripts/update-product-images.js

# הוספת תמונות למוצרים ללא תמונות
node scripts/update-product-images.js --add-missing
```

**תכונות:**
- עדכון תמונות למוצרים ספציפיים
- הוספת תמונות למוצרים ללא תמונות
- תמונות איכותיות מ-Unsplash
- דיווח מפורט על הסטטוס

### 2. `update-premium-images.js`
סקריפט לעדכון תמונות לאיכות פרימיום.

```bash
# עדכון לתמונות פרימיום (90% איכות)
node scripts/update-premium-images.js

# אופטימיזציה של תמונות קיימות
node scripts/update-premium-images.js --optimize
```

**תכונות:**
- תמונות באיכות פרימיום (90% quality)
- אופטימיזציה של תמונות קיימות
- תמונות ספציפיות לכל סוג מוצר
- דיווח על איכות התמונות

### 3. `manage-product-images.js`
סקריפט מתקדם לניהול מקיף של תמונות.

```bash
# ניתוח סטטוס התמונות הנוכחי
node scripts/manage-product-images.js analyze

# עדכון חכם של תמונות
node scripts/manage-product-images.js update

# בדיקת תקינות התמונות
node scripts/manage-product-images.js validate

# תהליך מלא (ניתוח + עדכון + בדיקה)
node scripts/manage-product-images.js full
```

**תכונות:**
- ניתוח מפורט של סטטוס התמונות
- בחירה חכמה של תמונות לפי סוג המוצר
- בדיקת תקינות URL של התמונות
- דיווחים סטטיסטיים מפורטים
- קטגוריזציה של תמונות לפי סוג

## קטגוריות תמונות

### מוצרי דחיסה (Compression)
- **גרבי דחיסה**: תמונות של גרביים רפואיות
- **שרוולי דחיסה**: תמונות של שרוולים לזרוע
- **תחבושות**: תמונות של תחבושות רפואיות

### מוצרי יופי ובריאות (Beauty)
- **מברשות**: מברשות עיסוי ולימפה
- **מסכות**: מסכות LED וטיפוח
- **מכשירים**: מכשירי יופי מתקדמים

### ציוד רפואי (Medical)
- **מכשירים**: מכשירי דחיסה פנאומטיים
- **ציוד**: ציוד רפואי כללי

### מוצרים דיגיטליים (Digital)
- **ספרים**: ספרים דיגיטליים ומדריכים
- **קורסים**: קורסי וידאו ולמידה מקוונת
- **מדריכים**: מדריכים דיגיטליים

## איכות תמונות

### תמונות רגילות
- רזולוציה: 400x400 פיקסלים
- איכות: 80% (q=80)
- פורמט: WebP אוטומטי

### תמונות פרימיום ⭐
- רזולוציה: 400x400 פיקסלים
- איכות: 90% (q=90)
- פורמט: WebP אוטומטי
- אופטימיזציה מתקדמת

## דרישות מערכת

```bash
# התקנת dependencies
npm install @supabase/supabase-js dotenv

# הגדרת משתני סביבה ב-.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## מבנה בסיס הנתונים

הסקריפטים עובדים עם טבלת `products` שכוללת:
- `id`: מזהה ייחודי
- `name`: שם המוצר
- `image_url`: URL של התמונה
- `type`: סוג המוצר (Physical/Digital)
- `active`: האם המוצר פעיל
- `price`: מחיר המוצר
- `description`: תיאור המוצר

## טיפים לשימוש

1. **הרץ ניתוח לפני עדכון**: השתמש ב-`analyze` כדי לראות את המצב הנוכחי
2. **בדוק תקינות**: השתמש ב-`validate` לאחר עדכונים
3. **גיבוי**: גבה את בסיס הנתונים לפני עדכונים גדולים
4. **איכות**: השתמש בתמונות פרימיום לחוויית משתמש טובה יותר

## פתרון בעיות

### שגיאות נפוצות
- **Missing Supabase credentials**: בדוק את קובץ `.env.local`
- **Product not found**: וודא שהשם מדויק בדיוק
- **Image URL invalid**: בדוק שה-URL תקין ונגיש

### לוגים
כל הסקריפטים מספקים לוגים מפורטים עם:
- ✅ פעולות שהצליחו
- ❌ שגיאות
- ⚠️ אזהרות
- 💡 הצעות לשיפור
