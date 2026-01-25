/**
 * Content Debug Script
 * Checks why posts might not be showing in Keystatic dashboard
 * 
 * Run: node scripts/check_content.js
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let isArray = false;
  
  for (const line of lines) {
    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && isArray) {
        if (!frontmatter[currentKey]) frontmatter[currentKey] = [];
        frontmatter[currentKey].push(line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, ''));
      }
      continue;
    }
    
    // Check for key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      
      if (value === '' || value === '[]') {
        isArray = true;
        frontmatter[currentKey] = [];
      } else {
        isArray = false;
        frontmatter[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }
  
  return frontmatter;
}

function checkDirectory(dirPath, label) {
  log(colors.cyan, `\n${'='.repeat(60)}`);
  log(colors.bright, `📁 Checking: ${label}`);
  log(colors.cyan, `   Path: ${path.resolve(dirPath)}`);
  log(colors.cyan, `${'='.repeat(60)}`);
  
  if (!fs.existsSync(dirPath)) {
    log(colors.red, `❌ Directory does not exist!`);
    return { exists: false, files: 0, valid: 0, issues: [] };
  }
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  log(colors.green, `✅ Directory exists with ${files.length} MDX/MD files`);
  
  if (files.length === 0) {
    log(colors.yellow, `⚠️  No content files found`);
    return { exists: true, files: 0, valid: 0, issues: [] };
  }
  
  // Check first 3 files for schema validation
  const issues = [];
  let validCount = 0;
  
  log(colors.blue, `\n📄 Sample file analysis:`);
  
  const samplesToCheck = files.slice(0, 3);
  for (const file of samplesToCheck) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    log(colors.yellow, `\n   File: ${file}`);
    
    if (!frontmatter) {
      log(colors.red, `   ❌ No valid frontmatter found`);
      issues.push({ file, issue: 'No frontmatter' });
      continue;
    }
    
    // Check required fields for Keystatic
    const requiredFields = ['title', 'date', 'category'];
    const missingFields = requiredFields.filter(f => !frontmatter[f]);
    
    if (missingFields.length > 0) {
      log(colors.red, `   ❌ Missing required fields: ${missingFields.join(', ')}`);
      issues.push({ file, issue: `Missing: ${missingFields.join(', ')}` });
    } else {
      log(colors.green, `   ✅ All required fields present`);
      validCount++;
    }
    
    // Show frontmatter keys
    log(colors.cyan, `   📋 Frontmatter keys: ${Object.keys(frontmatter).join(', ')}`);
    
    // Check for case sensitivity issues
    const titleVariants = ['title', 'Title', 'TITLE'];
    const foundTitle = titleVariants.find(t => frontmatter[t]);
    if (foundTitle && foundTitle !== 'title') {
      log(colors.yellow, `   ⚠️  Title field uses "${foundTitle}" instead of "title" (case sensitive!)`);
      issues.push({ file, issue: `Case mismatch: ${foundTitle}` });
    }
  }
  
  return { exists: true, files: files.length, valid: validCount, issues };
}

function main() {
  log(colors.bright, '\n🔍 Keystatic Content Debug Tool');
  log(colors.cyan, '================================\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  log(colors.blue, `Project root: ${projectRoot}`);
  
  // Check both content directories
  const results = {
    posts: checkDirectory(path.join(projectRoot, 'content/posts'), 'content/posts (Keystatic posts)'),
    articles: checkDirectory(path.join(projectRoot, 'src/content/articles'), 'src/content/articles (SEO articles)'),
    products: checkDirectory(path.join(projectRoot, 'content/products'), 'content/products'),
  };
  
  // Summary
  log(colors.cyan, `\n${'='.repeat(60)}`);
  log(colors.bright, '📊 SUMMARY');
  log(colors.cyan, `${'='.repeat(60)}`);
  
  console.log('\n');
  console.table({
    'content/posts': { 
      Exists: results.posts.exists ? '✅' : '❌', 
      Files: results.posts.files,
      'Valid Schema': results.posts.valid,
      Issues: results.posts.issues.length
    },
    'src/content/articles': { 
      Exists: results.articles.exists ? '✅' : '❌', 
      Files: results.articles.files,
      'Valid Schema': results.articles.valid,
      Issues: results.articles.issues.length
    },
    'content/products': { 
      Exists: results.products.exists ? '✅' : '❌', 
      Files: results.products.files,
      'Valid Schema': results.products.valid,
      Issues: results.products.issues.length
    },
  });
  
  // Recommendations
  log(colors.cyan, `\n${'='.repeat(60)}`);
  log(colors.bright, '💡 RECOMMENDATIONS');
  log(colors.cyan, `${'='.repeat(60)}\n`);
  
  if (results.posts.files > 0 && results.articles.files > 0) {
    log(colors.yellow, `⚠️  You have content in TWO locations:`);
    log(colors.cyan, `   - content/posts: ${results.posts.files} files (Keystatic managed)`);
    log(colors.cyan, `   - src/content/articles: ${results.articles.files} files (SEO articles)`);
    log(colors.green, `\n   ✅ The updated keystatic.config.ts now supports BOTH collections!`);
    log(colors.blue, `   - "מאמרים" collection → content/posts`);
    log(colors.blue, `   - "מאמרי SEO" collection → src/content/articles`);
  }
  
  const allIssues = [...results.posts.issues, ...results.articles.issues];
  if (allIssues.length > 0) {
    log(colors.yellow, `\n⚠️  Found ${allIssues.length} potential issues:`);
    allIssues.forEach(({ file, issue }) => {
      log(colors.red, `   - ${file}: ${issue}`);
    });
  }
  
  log(colors.green, `\n✅ Restart the dev server to see changes in Keystatic dashboard`);
  log(colors.cyan, `   Run: npm run dev`);
  log(colors.cyan, `   Then visit: http://localhost:3000/keystatic\n`);
}

main();
