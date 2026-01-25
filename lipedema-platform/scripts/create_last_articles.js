const fs = require('fs');
const path = require('path');

// Data map: slug -> Hebrew title
const articles = [
  {
    slug: 'lipedema-and-pregnancy',
    title: 'ליפאדמה והריון: מה קורה לגוף ואיך עוברים את זה בשלום?',
    excerpt: 'מדריך מקיף להתמודדות עם ליפאדמה במהלך ההריון - מה לצפות ואיך לשמור על בריאות הגוף והנפש'
  },
  {
    slug: 'keto-diet-for-lipedema',
    title: 'תזונה קטוגנית וליפאדמה: האם זה באמת עובד?',
    excerpt: 'האמת על דיאטה קטוגנית וליפאדמה - מה המחקרים אומרים ומה באמת עוזר'
  },
  {
    slug: 'flying-with-lipedema-travel-tips',
    title: 'לטוס ללא כאבים: המדריך המלא לטיסות עם רגליים נפוחות',
    excerpt: 'טיפים מעשיים לטיסות נוחות עם ליפאדמה - מה לארוז, איך לשבת ומתי לזוז'
  },
  {
    slug: 'lipedema-at-work-ergonomics',
    title: 'יושבת כל היום? כך תמנעי כאבים במשרד',
    excerpt: 'ארגונומיה נכונה במשרד יכולה לשנות הכל - המדריך המלא לעבודה נוחה עם ליפאדמה'
  },
  {
    slug: 'lipedema-intimacy-relationships',
    title: 'זוגיות, אינטימיות וליפאדמה: איך מדברים על זה?',
    excerpt: 'שיחה כנה על זוגיות ואינטימיות עם ליפאדמה - איך לשתף, איך להתמודד ואיך לשמור על הקשר'
  },
  {
    slug: 'self-manual-lymphatic-drainage',
    title: 'עיסוי לימפטי עצמי: 5 דקות ביום שעושות פלאים',
    excerpt: 'טכניקות פשוטות לעיסוי לימפטי עצמי שאפשר לעשות בבית - צעד אחר צעד'
  }
];

const postsDir = path.join(__dirname, '..', 'content', 'posts');

// Ensure directory exists
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

console.log('Creating 6 MDX article files...\n');

articles.forEach((article, index) => {
  const mdxContent = `---
title: "${article.title}"
slug: "${article.slug}"
excerpt: "${article.excerpt}"
coverImage: "/images/blog/${article.slug}.jpg"
date: "2024-05-21"
category: "physical"
tags: ["ליפאדמה", "טיפול", "בריאות"]
author: "אביטל רוזן"
readingTime: "5 דקות קריאה"
---

# ${article.title}

בקרוב...

## מבוא

תוכן המאמר יתווסף בקרוב.

## נקודות מפתח

- נקודה 1
- נקודה 2
- נקודה 3

## סיכום

המאמר המלא יפורסם בקרוב.
`;

  const filePath = path.join(postsDir, `${article.slug}.mdx`);
  
  fs.writeFileSync(filePath, mdxContent, 'utf8');
  
  console.log(`✅ Created: ${article.slug}.mdx`);
  console.log(`   Title: ${article.title}`);
  console.log(`   Image: /images/blog/${article.slug}.jpg\n`);
});

console.log('✨ All 6 MDX files created successfully!');
console.log(`📁 Location: ${postsDir}`);
