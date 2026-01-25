# Lipedema Authority Platform

פלטפורמה מקיפה למידע, טיפולים ומוצרים לליפאדמה ולימפדמה. הפלטפורמה מספקת תוכן איכותי, המלצות מוצרים מותאמות אישית ומערכת ניהול תוכן מתקדמת.

## תכונות עיקריות

### 🏥 תוכן רפואי מקצועי
- מאמרים מקצועיים על ליפאדמה ולימפדמה
- מדריכי טיפול ותרגילים
- מידע על טיפולים וטכנולוגיות חדשות

### 🛍️ מערכת המלצות מוצרים חכמה
- **10 מוצרי אפילייאיט פעילים** עם תמונות איכותיות
- התאמה אוטומטית של מוצרים לתוכן
- תמיכה במוצרים פיזיים ודיגיטליים
- מערכת תיוג מתקדמת לזיהוי רלוונטיות

### 🎨 עיצוב מותאם
- ממשק משתמש נקי ונגיש
- תמיכה בעברית ואנגלית
- עיצוב רספונסיבי לכל המכשירים

### 📊 ניהול תוכן מתקדם
- מערכת ייבוא תוכן אוטומטית
- ניהול מוצרי אפילייאיט
- מערכת בדיקות מקיפה

## התקנה והרצה

### דרישות מערכת
- Node.js 18+
- npm או yarn
- חשבון Supabase

### התקנה
```bash
# שכפול הפרויקט
git clone <repository-url>
cd lipedema-platform

# התקנת dependencies
npm install

# הגדרת משתני סביבה
cp .env.example .env.local
# ערוך את .env.local עם הפרטים שלך
```

### הרצת הפרויקט
```bash
# הרצה במצב פיתוח
npm run dev

# בנייה לפרודקשן
npm run build
npm start

# הרצת בדיקות
npm test
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן לצפייה בתוצאה.

## מוצרי אפילייאיט

הפלטפורמה כוללת **10 מוצרי אפילייאיט פעילים** עם תמונות איכותיות:

### מוצרים פיזיים (8)
1. **Lympha Press Optimal Plus** - מכשיר דחיסה פנאומטי מתקדם (₪12,000)
2. **FaradBeauty מסכת LED** - מסכת טיפוח פנים מתקדמת (₪620)
3. **FaradBeauty מברשת לימפה** - מברשת עיסוי מחוממת (₪480)
4. **JOBST Elvarex Soft** - גרבי דחיסה רכות פרימיום (₪450)
5. **שרוול דחיסה רפואי** - לזרוע, ליפאדמה ולימפדמה (₪320)
6. **גרביים דחיסה רפואיות** - איכותיות לתמיכה (₪299)
7. **תחבושות דחיסה קצרות** - סט מקצועי (₪280)
8. **גרבי דחיסה רפואיות** - מיוחדות לליפאדמה (₪240)

### מוצרים דיגיטליים (2)
1. **קורס וידאו: תרגילים לליפאדמה** - סדרת תרגילים מותאמים (₪199)
2. **ספר דיגיטלי: מדריך התזונה** - מדריך מקיף עם תפריטים (₪149)

**סה"כ ערך הפורטפוליו: ₪15,037**

### ניהול מוצרים
```bash
# בדיקת סטטוס כל המוצרים
node scripts/check-products.js

# עדכון תמונות למוצרים
node scripts/update-product-images.js

# עדכון לתמונות פרימיום
node scripts/update-premium-images.js

# ניהול מתקדם של תמונות
node scripts/manage-product-images.js [analyze|update|validate|full]
```

## כתיבה מחדש של מאמרים (Batch Rewriter)

הפלטפורמה כוללת כלי אוטומטי לכתיבה מחדש של מאמרים חלשים (< 500 מילים) למאמרים מקיפים ומותאמי SEO.

### תכונות
- ✅ זיהוי אוטומטי של מאמרים חלשים
- ✅ כתיבה מחדש למאמרים של 600+ מילים
- ✅ שמירה על קול אביטל רוזן האותנטי
- ✅ מבנה תוכן מובנה (Hook, Empathy, Science, Protocol, Bridge)
- ✅ גיבוי אוטומטי של קבצים מקוריים
- ✅ תמיכה במצב dry-run לתצוגה מקדימה

### שימוש
```bash
# סריקה וכתיבה מחדש של מאמרים חלשים
npx tsx scripts/batch-rewriter.ts

# תצוגה מקדימה ללא שינוי קבצים
npx tsx scripts/batch-rewriter.ts --dry-run
```

### תוצאות
ראה `BATCH_REWRITE_REPORT.md` לדוח מפורט על הכתיבה מחדש של 15 מאמרים עם שיפור ממוצע של 1,028% במספר המילים.

**גיבויים:** כל הקבצים המקוריים נשמרים ב-`content/posts/.backup/`

## מבנה הפרויקט

```
lipedema-platform/
├── src/
│   ├── app/                    # דפי Next.js App Router
│   ├── components/             # רכיבי React
│   │   ├── layout/            # רכיבי פריסה
│   │   └── products/          # רכיבי מוצרים
│   ├── lib/                   # ספריות ועזרים
│   │   ├── supabase/         # הגדרות Supabase
│   │   ├── products/         # מנוע התאמת מוצרים
│   │   └── i18n/             # תמיכה רב-לשונית
│   └── types/                 # הגדרות TypeScript
├── scripts/                   # סקריפטי ניהול
│   ├── check-products.js     # בדיקת מוצרים
│   ├── update-product-images.js
│   ├── update-premium-images.js
│   └── manage-product-images.js
└── supabase/                  # מיגרציות בסיס נתונים
```

## טכנולוגיות

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest, Testing Library
- **Icons**: Lucide React

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

