#!/usr/bin/env node

/**
 * יוצר תמונת ברירת מחדל לקטגוריית mindset
 */

const fs = require('fs');
const path = require('path');

// נתיב לתמונת ברירת מחדל זמנית (נעתיק מקטגוריה אחרת)
const sourceImage = path.join(__dirname, '../public/assets/generated/nutrition_fallback.png');
const targetImage = path.join(__dirname, '../public/assets/generated/mindset_fallback.png');

if (!fs.existsSync(targetImage)) {
  if (fs.existsSync(sourceImage)) {
    fs.copyFileSync(sourceImage, targetImage);
    console.log('✅ נוצרה תמונת ברירת מחדל לקטגוריית mindset');
  } else {
    console.log('❌ לא נמצאה תמונת מקור');
  }
} else {
  console.log('✅ תמונת ברירת מחדל לקטגוריית mindset כבר קיימת');
}