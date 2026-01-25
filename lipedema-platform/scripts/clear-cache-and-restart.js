const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js cache...\n');

const cacheDirs = [
  '.next',
  'node_modules/.cache'
];

let clearedCount = 0;

cacheDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Cleared: ${dir}`);
      clearedCount++;
    } catch (error) {
      console.log(`⚠️  Could not clear ${dir}: ${error.message}`);
    }
  } else {
    console.log(`ℹ️  ${dir} does not exist (already clean)`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Cache cleared! (${clearedCount} directories removed)`);
console.log('='.repeat(60));
console.log('\n📝 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open your browser and refresh the blog page');
console.log('3. All 16 articles should now appear!\n');
