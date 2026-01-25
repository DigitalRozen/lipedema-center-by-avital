# Lipedema Authority Platform

פלטפורמת סמכות מקיפה לליפאדמה ולימפדמה בעברית - משלבת 80% תוכן חינוכי עם 20% מנועי מונטיזציה.

## 🎯 סקירה כללית

פלטפורמה B2C המשמשת כ"ויקיפדיה לליפאדמה" עם ארגון תוכן היררכי ושלושה זרמי הכנסה:

### ערכי הליבה
- **מרכז ידע**: ארגון תוכן היררכי (אבחון, תזונה, פיזיותרפיה, מחשבה)
- **המלצות מוצרים חכמות**: התאמת מוצרי שותפות קונטקסטואלית
- **יצירת לידים**: לידים בעלי ערך גבוה לייעוץ קליני
- **סמכות תוכן**: תוכן מאינסטגרם המבסס מומחיות

### קהל יעד
- נשים דוברות עברית עם ליפאדמה/לימפדמה
- מחפשות מידע רפואי אמין ואפשרויות טיפול
- מעוניינות בפתרונות עצמיים וטיפול מקצועי

## 🏗️ מבנה הפרויקט

```
.
├── lipedema-platform/          # פרויקט Next.js ראשי
│   ├── src/app/               # Next.js App Router
│   │   ├── admin/            # ממשק ניהול
│   │   ├── knowledge/        # דפי מרכז הידע
│   │   └── clinic/           # מידע על הקליניקה
│   ├── src/components/       # רכיבי React
│   └── src/lib/             # לוגיקה עסקית
├── simple_server.py          # שרת API פשוט
├── test_simple_server.py     # בדיקות API
├── lipedema_upload/          # נתוני מקור
│   └── site_content_db.json  # פוסטים מאינסטגרם
└── shared_data/             # נתונים משותפים
```

## 🚀 התחלה מהירה

### 1. הפעלת השרת
```bash
python simple_server.py
```
השרת יפעל על `http://localhost:8001`

### 2. הפעלת הפרונטאנד
```bash
cd lipedema-platform
npm install
npm run dev
```
הפרונטאנד יפעל על `http://localhost:3000`

### 3. גישה לממשק הניהול
```
http://localhost:3000/admin/editor
```

## 🛠️ טכנולוגיות

### Frontend
- **Framework**: Next.js 16 עם App Router
- **Runtime**: React 19 עם React Compiler
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL עם SSR)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest עם jsdom + Testing Library
- **Icons**: Lucide React

### Backend
- **API Server**: FastAPI (Python)
- **Data Source**: JSON files
- **Port**: 8001

## 📊 זרמי הכנסה

1. **Contextual Upsell (Affiliate)**: מוצרים פיזיים המותאמים לתוכן
2. **Digital Products (Low Ticket)**: מדריכים, קורסים, תוכניות תזונה
3. **Clinic Leads (High Ticket)**: ייעוץ טיפולי אישי

## 🎨 עיצוב ותוכן

### קווים מנחים לטון וקול
- **ישירות על המציאות הרפואית**: "ליפאדמה לא נעלמת עם דיאטה"
- **אמפתיה עמוקה**: "אני יודעת איך הרגליים שלך מרגישות כבדות בלילה"
- **איזון בין אמת מדעית לתמיכה רגשית**

### אוצר מילים רפואי (עברית)
- **לימפה** (lymph)
- **בצקת** (edema)
- **רקמה פיברוטית** (fibrotic tissue)
- **דלקתיות** (inflammation)
- **נוגדי חמצון** (antioxidants)
- **מערכת הלימפה** (lymphatic system)

## 🔧 פיתוח

### הפעלת בדיקות
```bash
cd lipedema-platform
npm test
```

### בדיקת API
```bash
python test_simple_server.py
```

### בניית פרודקשן
```bash
cd lipedema-platform
npm run build
```

## 📝 תיעוד נוסף

- [API Server Documentation](API_SERVER_README.md)
- [Steering Guidelines](.kiro/steering/)

## 🎯 מטריקות מפתח

- 10 מוצרי שותפות פעילים (₪15,037 ערך פורטפוליו)
- תמיכה מלאה בעברית RTL
- תוכן מיובא מפוסטים באינסטגרם
- מערכת אנליטיקס מבוססת Supabase

## 🤝 תרומה

הפרויקט מנוהל על ידי אביטל רוזן, מומחית ליפאדמה מובילה בישראל.

---

**הערה**: זהו פרויקט פיתוח פעיל. המבנה והתכונות עשויים להשתנות.