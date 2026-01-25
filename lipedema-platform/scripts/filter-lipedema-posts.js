const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');

// Keywords that indicate lipedema-related content
const relevantKeywords = [
  'ליפאדמה',
  'ליפאדמה', 
  'לימפדמה',
  'לימפאדמה',
  'lipedema',
  'lymphedema',
  'לימפה',
  'lymph',
  'בצקת',
  'edema',
  'לימפתי',
  'lymphatic',
  'ניקוז לימפתי',
  'lymphatic drainage',
  'מערכת הלימפה',
  'lymphatic system',
  'לימפה פרס',
  'lympha press',
];

// Read all MDX files
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

console.log(`Found ${files.length} posts to analyze...\n`);

const toDelete = [];
const toKeep = [];

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if content contains any relevant keywords
  const isRelevant = relevantKeywords.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (isRelevant) {
    toKeep.push(file);
  } else {
    toDelete.push(file);
  }
});

console.log(`\n📊 Analysis Results:`);
console.log(`✅ Relevant posts (to keep): ${toKeep.length}`);
console.log(`❌ Non-relevant posts (to delete): ${toDelete.length}\n`);

console.log(`\n🗑️  Posts to DELETE (not lipedema-related):\n`);
toDelete.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'No title';
  console.log(`  - ${file}`);
  console.log(`    Title: ${title.substring(0, 80)}...`);
});

console.log(`\n\n✅ Posts to KEEP (lipedema-related):\n`);
toKeep.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'No title';
  console.log(`  - ${file}`);
  console.log(`    Title: ${title.substring(0, 80)}...`);
});

// Ask for confirmation before deleting
console.log(`\n\n⚠️  Ready to delete ${toDelete.length} non-relevant posts.`);
console.log(`Run with --confirm flag to actually delete the files.\n`);

if (process.argv.includes('--confirm')) {
  console.log('🗑️  Deleting non-relevant posts...\n');
  
  toDelete.forEach(file => {
    const filePath = path.join(postsDir, file);
    fs.unlinkSync(filePath);
    console.log(`  ✓ Deleted: ${file}`);
  });
  
  console.log(`\n✅ Successfully deleted ${toDelete.length} posts!`);
  console.log(`📝 Remaining posts: ${toKeep.length}`);
} else {
  console.log('ℹ️  No files were deleted. Run with --confirm to delete.');
}

