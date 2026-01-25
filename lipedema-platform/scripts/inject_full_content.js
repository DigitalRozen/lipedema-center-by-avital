const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');

// Comprehensive content for all 16 articles
const templates = require('./content-templates.js');

const articleContent = {
  'anti-inflammatory-foods-lipedema': templates['anti-inflammatory-foods-lipedema'],
  'coping-with-lipedema-shame': templates['coping-with-lipedema-shame'],
  'lipedema-vs-obesity-diagnosis': templates['lipedema-vs-obesity-diagnosis'],
  'morning-routine-lymphatic-drainage': templates['morning-routine-lymphatic-drainage'],
  'natural-lipedema-treatment-guide': templates['natural-lipedema-treatment-guide'],
  'best-supplements-for-lipedema': templates['best-supplements-for-lipedema'],
  'lipedema-friendly-exercises': templates['lipedema-friendly-exercises'],
  'lipedema-liposuction-pros-cons': templates['lipedema-liposuction-pros-cons'],
  'managing-lipedema-in-summer': templates['managing-lipedema-in-summer'],
  'clothing-tips-for-swollen-legs': templates['clothing-tips-for-swollen-legs'],
  'lipedema-and-pregnancy': templates['lipedema-and-pregnancy'],
  'keto-diet-for-lipedema': templates['keto-diet-for-lipedema'],
  'flying-with-lipedema-travel-tips': templates['flying-with-lipedema-travel-tips'],
  'lipedema-at-work-ergonomics': templates['lipedema-at-work-ergonomics'],
  'lipedema-intimacy-relationships': templates['lipedema-intimacy-relationships'],
  'self-manual-lymphatic-drainage': templates['self-manual-lymphatic-drainage']
};

console.log('📝 Starting content injection for 16 articles...\n');

let successCount = 0;
let errorCount = 0;

Object.keys(articleContent).forEach(slug => {
  const filename = `${slug}.mdx`;
  const filePath = path.join(POSTS_DIR, filename);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      errorCount++;
      return;
    }

    // Read existing file
    const existingContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter (everything between --- markers)
    const frontmatterMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in: ${filename}`);
      errorCount++;
      return;
    }

    const frontmatter = frontmatterMatch[0];
    const newContent = articleContent[slug];
    
    // Combine frontmatter with new content
    const updatedFile = `${frontmatter}\n${newContent}`;
    
    // Write back to file
    fs.writeFileSync(filePath, updatedFile, 'utf8');
    
    console.log(`✅ Injected content: ${filename}`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 CONTENT INJECTION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`📁 Total in map: ${Object.keys(articleContent).length}`);
console.log('\n✨ Content injection complete!\n');
