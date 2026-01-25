#!/usr/bin/env node

/**
 * סקריפט לבדיקת התמונות של המאמרים
 * בודק אילו מאמרים יש להם תמונות מותאמות ואילו לא
 */

const fs = require('fs');
const path = require('path');

// קריאת קובץ המיפוי
const keywordMapPath = path.join(__dirname, '../src/lib/article_keyword_map.json');
const keywordMap = JSON.parse(fs.readFileSync(keywordMapPath, 'utf8'));

// קריאת בסיס הנתונים של המאמרים
const contentDbPath = path.join(__dirname, '../site_content_db.json');
const articles = JSON.parse(fs.readFileSync(contentDbPath, 'utf8'));

// תיקיית התמונות
const articlesImagesDir = path.join(__dirname, '../public/articles');

console.log('🔍 בודק התמונות של המאמרים...\n');

// בדיקת אילו תמונות קיימות
const existingImages = fs.readdirSync(articlesImagesDir).filter(file => file.endsWith('.png'));
console.log(`📁 נמצאו ${existingImages.length} תמונות בתיקיית /articles/:`);
existingImages.forEach(img => console.log(`   ✅ ${img}`));

console.log('\n📊 ניתוח התאמות מאמרים לתמונות:\n');

let matchedCount = 0;
let fallbackCount = 0;
let unmatchedCount = 0;

articles.forEach((article, index) => {
  const titleLower = article.title.toLowerCase();
  const contentLower = article.content.toLowerCase();
  
  // חיפוש התאמה
  const matchedEntry = keywordMap.find(entry =>
    entry.keywords.some(kw => 
      titleLower.includes(kw.toLowerCase()) || 
      contentLower.includes(kw.toLowerCase())
    )
  );
  
  if (matchedEntry) {
    const imagePath = `${matchedEntry.image}.png`;
    const imageExists = existingImages.includes(imagePath);
    
    console.log(`${index + 1}. ✅ "${article.title.substring(0, 50)}..."`);
    console.log(`   🖼️  תמונה מותאמת: ${imagePath} ${imageExists ? '✅' : '❌ לא קיימת'}`);
    console.log(`   🔑 מילות מפתח: ${matchedEntry.keywords.join(', ')}`);
    console.log('');
    
    matchedCount++;
  } else {
    // בדיקת תמונת ברירת מחדל
    const categoryFallbacks = {
      'diagnosis': 'diagnosis_fallback.png',
      'nutrition': 'nutrition_fallback.png', 
      'physical': 'physical_fallback.png',
      'mindset': 'mindset_fallback.png',
      'Nutrition': 'nutrition_fallback.png',
      'Treatment': 'physical_fallback.png',
      'Success': 'mindset_fallback.png'
    };
    
    const fallbackImage = categoryFallbacks[article.category_slug];
    
    if (fallbackImage) {
      console.log(`${index + 1}. 🔄 "${article.title.substring(0, 50)}..."`);
      console.log(`   🖼️  תמונת ברירת מחדל: ${fallbackImage} (קטגוריה: ${article.category_display || article.category_slug})`);
      console.log('');
      
      fallbackCount++;
    } else {
      console.log(`${index + 1}. ❌ "${article.title.substring(0, 50)}..."`);
      console.log(`   🖼️  אין תמונה (לא מותאמת ולא ברירת מחדל)`);
      console.log(`   📂 קטגוריה: ${article.category_display || article.category_slug}`);
      console.log('');
      
      unmatchedCount++;
    }
  }
});

console.log('\n📈 סיכום:');
console.log(`✅ מאמרים עם תמונות מותאמות: ${matchedCount}`);
console.log(`🔄 מאמרים עם תמונות ברירת מחדל: ${fallbackCount}`);
console.log(`❌ מאמרים ללא תמונות: ${unmatchedCount}`);
console.log(`📊 אחוז כיסוי כולל: ${Math.round(((matchedCount + fallbackCount) / articles.length) * 100)}%`);

// הצעות לשיפור
console.log('\n💡 הצעות לשיפור:');

if (unmatchedCount > 0) {
  console.log('\n🔧 מאמרים שזקוקים לתמונות:');
  
  articles.forEach((article, index) => {
    const titleLower = article.title.toLowerCase();
    const contentLower = article.content.toLowerCase();
    
    const matchedEntry = keywordMap.find(entry =>
      entry.keywords.some(kw => 
        titleLower.includes(kw.toLowerCase()) || 
        contentLower.includes(kw.toLowerCase())
      )
    );
    
    if (!matchedEntry) {
      // חיפוש מילות מפתח פוטנציאליות
      const potentialKeywords = [];
      
      // מילות מפתח נפוצות בתחום
      const commonKeywords = [
        'ליפאדמה', 'לימפדמה', 'תזונה', 'דיאטה', 'עיסוי', 'טיפול', 
        'בריאות', 'מכשיר', 'תרגיל', 'דלקת', 'נפיחות', 'כאב'
      ];
      
      commonKeywords.forEach(keyword => {
        if (titleLower.includes(keyword) || contentLower.includes(keyword)) {
          potentialKeywords.push(keyword);
        }
      });
      
      console.log(`\n${index + 1}. "${article.title.substring(0, 40)}..."`);
      if (potentialKeywords.length > 0) {
        console.log(`   🏷️  מילות מפתח פוטנציאליות: ${potentialKeywords.join(', ')}`);
      }
      console.log(`   📂 קטגוריה: ${article.category_display || article.category_slug}`);
    }
  });
}

console.log('\n🎯 המלצות:');
console.log('1. צור תמונות נוספות עבור המאמרים ללא תמונות');
console.log('2. הוסף מילות מפתח נוספות לקובץ המיפוי');
console.log('3. שקול להשתמש בתמונות ברירת מחדל לפי קטגוריה');
console.log('4. בדוק שהתמונות נטענות נכון בדפדפן');
