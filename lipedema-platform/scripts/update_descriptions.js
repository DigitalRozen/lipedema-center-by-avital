const fs = require('fs');
const path = require('path');

// Mapping of slug to new Hebrew description
const DESCRIPTION_MAP = {
  'anti-inflammatory-foods-lipedema': 'האם גלוטן באמת מחמיר נפיחות? 5 המזונות שכדאי להוציא מהתפריט כדי להפחית כאב באופן מיידי.',
  'coping-with-lipedema-shame': 'את לא אשמה ברגליים שלך. צעדים מעשיים לבניית חוסן נפשי מול הערות הסביבה והמבטים ברחוב.',
  'lipedema-vs-obesity-diagnosis': 'חושבת שזה סתם שומן? הסימנים הקריטיים שמבדילים בין השמנה רגילה לליפאדמה (כולל מבחן ה\'קאף\').',
  'morning-routine-lymphatic-drainage': 'אל תצאי מהמיטה לפני שתקראי את זה: 10 דקות בבוקר שיכולות לשנות את כל היום של הרגליים שלך.',
  'natural-lipedema-treatment-guide': 'לפני שאת רצה לניתוח: הסקירה המלאה של הטיפולים השמרניים שעובדים (ומה בזבוז זמן).',
  'best-supplements-for-lipedema': 'לא רק כורכום: התוספים הטבעיים שבאמת עוזרים להוריד דלקתיות ונוזלים, לפי מחקרים עדכניים.',
  'lipedema-friendly-exercises': 'למה ריצה עלולה להזיק לליפאדמה? גלי איזה סוגי ספורט יעזרו לך להתחטב בלי להגביר את הכאב.',
  'lipedema-liposuction-pros-cons': 'שוקלת שאיבת שומן? כל האמת על ההחלמה, הסיכונים, והאם הליפאדמה יכולה לחזור אחרי הניתוח.',
  'managing-lipedema-in-summer': 'איך שורדים את אוגוסט עם גרבי לחץ? הטיפים שיהפכו את הקיץ הישראלי לאפשרי (ואפילו נעים).',
  'clothing-tips-for-swollen-legs': 'הג\'ינס לא עולה? כך תתלבשי בסטייל מחמיא בלי לוותר על הנוחות ובלי ללחוץ על אזורים רגישים.',
  'lipedema-and-pregnancy': 'מתכננת הריון? כל מה שאת צריכה לדעת על השינויים ההורמונליים ואיך לשמור על הגוף בתקופה הרגישה הזו.',
  'keto-diet-for-lipedema': 'טרנד או פתרון אמיתי? איך תזונה קטוגנית משפיעה על רקמת השומן הליפאדמית ועל רמות הכאב.',
  'flying-with-lipedema-travel-tips': 'פוחדת מהטיסה? המדריך להישרדות בגובה 30,000 רגל: גרביים, תנועה וכל מה שצריך בתיק היד.',
  'lipedema-at-work-ergonomics': 'יושבת כל היום במשרד? השינויים הקטנים בסביבת העבודה שימנעו ממך לחזור הביתה עם רגליים בצקתיות.',
  'lipedema-intimacy-relationships': 'איך מסבירים לבן הזוג? לדבר על ליפאדמה, דימוי גוף ואינטימיות בפתיחות ובביטחון.',
  'self-manual-lymphatic-drainage': 'הכוח בידיים שלך: מדריך מצולם לעיסוי לימפטי עצמי שמשחרר נוזלים ומקל על תחושת הכבדות.'
};

const POSTS_DIR = path.join(__dirname, '../content/posts');

console.log('✍️  Starting description updates...\n');
console.log(`📁 Working directory: ${POSTS_DIR}\n`);

let updatedCount = 0;
let errorCount = 0;
const updatedFiles = [];
const errors = [];

// Iterate through each slug in the mapping
Object.keys(DESCRIPTION_MAP).forEach(slug => {
  const filename = `${slug}.mdx`;
  const filePath = path.join(POSTS_DIR, filename);
  const newDescription = DESCRIPTION_MAP[slug];

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      errorCount++;
      errors.push({ file: filename, error: 'File not found' });
      return;
    }

    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the description or excerpt line using regex
    // This matches: description: "any text" or excerpt: "any text"
    const descriptionRegex = /description:\s*["'].*?["']/;
    const excerptRegex = /excerpt:\s*["'].*?["']/;
    
    let updatedContent;
    let fieldFound = false;
    
    if (descriptionRegex.test(content)) {
      // Replace description field
      updatedContent = content.replace(
        descriptionRegex,
        `description: "${newDescription}"`
      );
      fieldFound = true;
    } else if (excerptRegex.test(content)) {
      // Replace excerpt field
      updatedContent = content.replace(
        excerptRegex,
        `excerpt: "${newDescription}"`
      );
      fieldFound = true;
    }
    
    if (!fieldFound) {
      console.log(`⚠️  No description or excerpt field found in: ${filename}`);
      errorCount++;
      errors.push({ file: filename, error: 'No description or excerpt field found' });
      return;
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');

    console.log(`✅ Updated: ${filename}`);
    console.log(`   📝 New description: ${newDescription.substring(0, 60)}...`);
    updatedCount++;
    updatedFiles.push(filename);

  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    errorCount++;
    errors.push({ file: filename, error: error.message });
  }
});

// Summary report
console.log('\n' + '='.repeat(80));
console.log('📊 UPDATE SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Successfully updated: ${updatedCount} files`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`📁 Total processed: ${Object.keys(DESCRIPTION_MAP).length}`);

if (updatedFiles.length > 0) {
  console.log('\n✅ UPDATED FILES:');
  updatedFiles.forEach(file => console.log(`   - ${file}`));
}

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach(({ file, error }) => console.log(`   - ${file}: ${error}`));
}

console.log('\n✨ Description update complete! Your articles now have engaging Hebrew copy.\n');
