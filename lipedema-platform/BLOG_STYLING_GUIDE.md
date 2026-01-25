# מדריך עיצוב מאמרי בלוג - Medical Spa & Wellness Design System

## סקירה כללית

מערכת העיצוב של מאמרי הבלוג בנויה על שלושה רכיבים מרכזיים שעובדים ביחד:

1. **Tailwind Config** - מגדיר את צבעי המותג והטיפוגרפיה
2. **Global CSS** - מגדיר את סגנונות ה-prose עם תמיכה ב-RTL
3. **Blog Page Component** - מציג את התוכן עם המבנה הנכון

## 🎨 צבעי המותג (Brand Colors)

```css
brand: {
  gold: '#D4AF37',        /* זהב ראשי */
  gold-light: '#E8D48A',  /* זהב בהיר */
  gold-dark: '#B8960C',   /* זהב כהה */
  pink: '#F8E7E7',        /* ורוד רך */
  pink-deep: '#E6C2BF',   /* ורוד עמוק */
  dark: '#2D3748',        /* טקסט כהה */
  cream: '#FAFAF5',       /* רקע קרם */
}
```

## 📝 איך זה עובד?

### 1. Keystatic מחזיר MDX כ-React Component

כאשר קוראים מאמר מ-Keystatic:
```typescript
const post = await getPostBySlug(slug);
// post.content הוא React component מעובד
```

### 2. התוכן מוצג בתוך div.prose

```tsx
<div className="prose prose-lg max-w-none">
  {post.content}
</div>
```

### 3. ה-CSS דואג לעיצוב RTL

הקובץ `globals.css` מכיל כללים שדורסים את ברירות המחדל של `@tailwindcss/typography`:

```css
.prose :where(h2):not(:where([class~="not-prose"] *)) {
  color: var(--color-brand-gold);
  font-family: var(--font-family-heading-hebrew);
  direction: rtl;
  text-align: right;
  /* ... */
}
```

## 🔧 מבנה הקבצים

### `tailwind.config.ts`
- מגדיר צבעי מותג
- מגדיר פונטים עבריים
- מכיל את ה-typography plugin
- מגדיר את ה-content paths (כולל `content/**/*.mdx`)

### `src/app/globals.css`
- כללי CSS גלובליים
- עיצוב prose עם תמיכה ב-RTL
- דריסות של Tailwind Typography
- משתמש ב-`:where()` selector לספציפיות נמוכה

### `src/app/blog/[slug]/page.tsx`
- מבנה הדף המלא
- Hero header עם gradient
- Article card עם prose wrapper
- Author CTA section

## 🎯 עקרונות עיצוב

### כותרות (Headings)
- **H1**: זהב כהה (#B8960C), Frank Ruhl Libre, 900 weight
- **H2**: זהב (#D4AF37), קו תחתון ורוד, 700 weight
- **H3**: כהה (#2D3748), 700 weight

### טקסט (Text)
- **פסקאות**: line-height 1.9 לקריאות עברית
- **קישורים**: ורוד-זהב (#C06C84) עם hover לזהב
- **Strong**: זהב כהה (#B8960C)

### רשימות (Lists)
- Bullets/Numbers בצד ימין (RTL)
- Markers בצבע זהב
- Padding מימין בלבד

### Blockquotes
- Border ימני בצבע זהב
- Gradient background (ורוד → לבן)
- Border-radius מימין

### תמונות
- Border-radius: 1rem
- Shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15)
- Margin: 2rem למעלה ולמטה

## 🚀 שימוש

### להוסיף מאמר חדש

1. צור קובץ MDX חדש ב-`content/posts/`
2. הוסף frontmatter:
```yaml
---
title: "כותרת המאמר"
date: 2024-01-21
description: "תיאור קצר"
image: /images/blog/image.jpg
category: nutrition
tags:
  - תזונה
  - בריאות
originalPostId: "123456"
---
```

3. כתוב את התוכן ב-Markdown:
```markdown
# כותרת ראשית

פסקה ראשונה...

## כותרת משנית

- רשימה
- עם פריטים

**טקסט מודגש** ו-*טקסט נטוי*
```

4. המאמר יוצג אוטומטית עם כל העיצוב!

### לשנות צבעים

ערוך את `tailwind.config.ts`:
```typescript
colors: {
  brand: {
    gold: '#YOUR_COLOR',
    // ...
  },
}
```

### לשנות פונטים

ערוך את `tailwind.config.ts`:
```typescript
fontFamily: {
  'heading-hebrew': ['Your Font', 'serif'],
  // ...
}
```

## 🐛 פתרון בעיות

### המאמר מוצג כטקסט גולמי

**בעיה**: התוכן מוצג ללא עיצוב, רואים `#` ו-`**` במקום כותרות ו-bold.

**פתרון**:
1. וודא ש-`@tailwindcss/typography` מותקן
2. וודא שיש `plugins: [typography]` ב-`tailwind.config.ts`
3. וודא שה-content path כולל `content/**/*.mdx`
4. הרץ `npm run build` מחדש

### הכיוון לא RTL

**בעיה**: הטקסט מיושר לשמאל במקום לימין.

**פתרון**:
1. וודא שיש `html { direction: rtl; }` ב-`globals.css`
2. וודא שה-prose CSS כולל `direction: rtl` ו-`text-align: right`
3. נקה את ה-cache: `rm -rf .next`

### הצבעים לא מופיעים

**בעיה**: הכותרות לא בצבע זהב.

**פתרון**:
1. וודא שה-CSS variables מוגדרים ב-`@theme` ב-`globals.css`
2. וודא שה-prose CSS משתמש ב-`var(--color-brand-gold)`
3. בדוק ב-DevTools שה-CSS נטען

## 📚 משאבים

- [Tailwind Typography Docs](https://tailwindcss.com/docs/typography-plugin)
- [Keystatic Docs](https://keystatic.com/docs)
- [MDX Docs](https://mdxjs.com/)

## ✅ Checklist לפני Deploy

- [ ] כל המאמרים מוצגים נכון
- [ ] הכיוון RTL עובד
- [ ] הצבעים נכונים (זהב לכותרות, ורוד לקישורים)
- [ ] הפונטים נטענים (Frank Ruhl Libre, Heebo)
- [ ] התמונות מוצגות עם rounded corners
- [ ] הרשימות עם bullets מימין
- [ ] ה-blockquotes עם border מימין
- [ ] Mobile responsive עובד
- [ ] הטסטים עוברים

---

**עודכן לאחרונה**: 21 ינואר 2026
**גרסה**: 2.0 - "Medical Spa & Wellness"
