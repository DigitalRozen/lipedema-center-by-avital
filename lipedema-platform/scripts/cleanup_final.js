const fs = require('fs');
const path = require('path');

// Approved slugs - DO NOT DELETE THESE
const APPROVED_SLUGS = [
  'anti-inflammatory-foods-lipedema',
  'coping-with-lipedema-shame',
  'lipedema-vs-obesity-diagnosis',
  'morning-routine-lymphatic-drainage',
  'natural-lipedema-treatment-guide',
  'best-supplements-for-lipedema',
  'lipedema-friendly-exercises',
  'lipedema-liposuction-pros-cons',
  'managing-lipedema-in-summer',
  'clothing-tips-for-swollen-legs',
  'lipedema-and-pregnancy',
  'keto-diet-for-lipedema',
  'flying-with-lipedema-travel-tips',
  'lipedema-at-work-ergonomics',
  'lipedema-intimacy-relationships',
  'self-manual-lymphatic-drainage'
];

const POSTS_DIR = path.join(__dirname, '../content/posts');

console.log('🧹 Starting cleanup of non-authority articles...\n');
console.log(`📁 Scanning directory: ${POSTS_DIR}\n`);

// Read all files in the posts directory
const files = fs.readdirSync(POSTS_DIR);

let deletedCount = 0;
let keptCount = 0;
const deletedFiles = [];
const keptFiles = [];

files.forEach(file => {
  // Skip directories (like .backup)
  const filePath = path.join(POSTS_DIR, file);
  if (fs.statSync(filePath).isDirectory()) {
    console.log(`⏭️  Skipping directory: ${file}`);
    return;
  }

  // Extract slug from filename (remove .mdx extension)
  const slug = file.replace('.mdx', '');

  // Check if this slug is in the approved list
  if (APPROVED_SLUGS.includes(slug)) {
    console.log(`✅ KEEPING: ${file}`);
    keptCount++;
    keptFiles.push(file);
  } else {
    console.log(`❌ DELETING: ${file}`);
    try {
      fs.unlinkSync(filePath);
      deletedCount++;
      deletedFiles.push(file);
    } catch (error) {
      console.error(`   ⚠️  Error deleting ${file}:`, error.message);
    }
  }
});

// Summary report
console.log('\n' + '='.repeat(60));
console.log('📊 CLEANUP SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Files kept: ${keptCount}`);
console.log(`❌ Files deleted: ${deletedCount}`);
console.log(`📁 Total processed: ${files.length - 1}`); // -1 for .backup directory

if (deletedFiles.length > 0) {
  console.log('\n🗑️  DELETED FILES:');
  deletedFiles.forEach(file => console.log(`   - ${file}`));
}

if (keptFiles.length > 0) {
  console.log('\n✅ KEPT FILES (Authority Articles):');
  keptFiles.forEach(file => console.log(`   - ${file}`));
}

console.log('\n✨ Cleanup complete! Your platform now has 100% Lipedema focus.\n');
