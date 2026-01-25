const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../content/posts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Map of slug to Hebrew title and description
const articles = [
  {
    slug: 'anti-inflammatory-foods-lipedema',
    title: 'תזונה אנטי-דלקתית לליפאדמה: 5 המזונות שמחמירים את הכאבים',
    description: 'המדריך המלא לתזונה אנטי-דלקתית - גלי אילו מזונות מחמירים את הדלקת בליפאדמה ומה כדאי לאכול במקום'
  },
  {
    slug: 'coping-with-lipedema-shame',
    title: 'להתמודד עם הבושה של ליפאדמה: מסע אישי לקבלה עצמית',
    description: 'המדריך המלא להתמודדות עם הבושה והסטיגמה של ליפאדמה - כלים פרקטיים לבניית ביטחון עצמי'
  },
  {
    slug: 'lipedema-vs-obesity-diagnosis',
    title: 'ליפאדמה או השמנה? איך לקבל אבחנה נכונה',
    description: 'המדריך המלא להבדלים בין ליפאדמה להשמנה - סימנים קליניים, בדיקות ואבחון מדויק'
  },
  {
    slug: 'morning-routine-lymphatic-drainage',
    title: 'שגרת בוקר לניקוז לימפתי: 10 דקות שישנו את היום שלך',
    description: 'המדריך המלא לשגרת בוקר אפקטיבית לניקוז לימפתי - טכניקות פשוטות שמפחיתות נפיחות'
  },
  {
    slug: 'natural-lipedema-treatment-guide',
    title: 'הטיפול הטבעי בליפאדמה: מדריך מקיף לשיפור התסמינים',
    description: 'המדריך המלא לטיפול טבעי בליפאדמה - שיטות מוכחות לשיפור הסימפטומים ללא ניתוח'
  },
  {
    slug: 'best-supplements-for-lipedema',
    title: 'התוספים הטובים ביותר לליפאדמה: מה באמת עובד?',
    description: 'המדריך המלא לתוספי תזונה לליפאדמה - מחקרים, מינונים והמלצות מבוססות ראיות'
  },
  {
    slug: 'lipedema-friendly-exercises',
    title: 'פעילות גופנית לליפאדמה: התרגילים הכי מומלצים',
    description: 'המדריך המלא לפעילות גופנית מותאמת לליפאדמה - תרגילים שמסייעים ולא מזיקים'
  },
  {
    slug: 'lipedema-liposuction-pros-cons',
    title: 'שאיבת שומן לליפאדמה: יתרונות, חסרונות והאם זה בשבילך?',
    description: 'המדריך המלא לשאיבת שומן בליפאדמה - כל מה שצריך לדעת לפני קבלת ההחלטה'
  },
  {
    slug: 'managing-lipedema-in-summer',
    title: 'ניהול ליפאדמה בקיץ: 7 טיפים להקלה בחום',
    description: 'המדריך המלא לניהול ליפאדמה בעונה החמה - טיפים פרקטיים להפחתת נפיחות וכאב'
  },
  {
    slug: 'clothing-tips-for-swollen-legs',
    title: 'טיפי לבוש לרגליים נפוחות: איך להרגיש בנוח וביטחון',
    description: 'המדריך המלא ללבוש מותאם לליפאדמה - בחירת בגדים שמחמיאים ונוחים'
  }
];

function createMDXContent(article) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `---
title: "${article.title}"
date: ${currentDate}
description: "${article.description}"
image: /images/blog/${article.slug}.jpg
alt: "${article.title}"
category: physical
tags:
  - ליפאדמה
  - טיפול
  - בריאות
keywords:
  - ליפאדמה
  - "${article.title.split(':')[0]}"
originalPostId: ""
---

# ${article.title}

המאמר בבנייה...

תוכן מפורט יתווסף בקרוב.
`;
}

function syncArticles() {
  console.log('🚀 Starting article sync to images...\n');
  
  let created = 0;
  let overwritten = 0;
  
  articles.forEach(article => {
    const filePath = path.join(OUTPUT_DIR, `${article.slug}.mdx`);
    const existed = fs.existsSync(filePath);
    
    const content = createMDXContent(article);
    fs.writeFileSync(filePath, content, 'utf8');
    
    if (existed) {
      console.log(`✏️  Overwritten: ${article.slug}.mdx`);
      overwritten++;
    } else {
      console.log(`✅ Created: ${article.slug}.mdx`);
      created++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created: ${created}`);
  console.log(`✏️  Overwritten: ${overwritten}`);
  console.log(`📝 Total: ${articles.length}`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
}

syncArticles();

