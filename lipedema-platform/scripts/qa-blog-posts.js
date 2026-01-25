/**
 * Content Quality Assurance Script
 * Analyzes MDX blog posts for deployment readiness
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');
const IMAGES_DIR = path.join(__dirname, '../public/images/blog');

// Generic/weak title patterns to detect
const WEAK_TITLE_PATTERNS = [
  /^מאמר/i,
  /^פוסט/i,
  /^כתבה/i,
  /untitled/i,
  /^\d+$/,  // Just numbers
];

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

function countWords(content) {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  // Remove MDX/HTML tags
  const withoutTags = withoutFrontmatter.replace(/<[^>]*>/g, ' ');
  
  // Remove markdown syntax
  const withoutMarkdown = withoutTags
    .replace(/[#*_`\[\]()]/g, ' ')
    .replace(/\n+/g, ' ');
  
  // Count words (Hebrew and English)
  const words = withoutMarkdown
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  return words.length;
}

function checkImageExists(imagePath) {
  if (!imagePath) return false;
  
  // Handle different image path formats
  let cleanPath = imagePath;
  
  // Remove leading slash if present
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // If path starts with 'images/', prepend 'public/'
  if (cleanPath.startsWith('images/')) {
    cleanPath = path.join(__dirname, '../public', cleanPath);
  } else {
    cleanPath = path.join(__dirname, '..', cleanPath);
  }
  
  return fs.existsSync(cleanPath);
}

function assessTitleQuality(title) {
  if (!title) return 'Missing';
  
  // Check for weak patterns
  for (const pattern of WEAK_TITLE_PATTERNS) {
    if (pattern.test(title)) {
      return 'Generic';
    }
  }
  
  // Check length (good titles are usually 30-70 chars)
  if (title.length < 20) return 'Too Short';
  if (title.length > 100) return 'Too Long';
  
  // Check for engagement indicators
  const engagementWords = ['איך', 'למה', 'מדריך', 'סוד', 'טיפים', 'שינה', 'חיים'];
  const hasEngagement = engagementWords.some(word => title.includes(word));
  
  return hasEngagement ? 'Strong' : 'Moderate';
}

function analyzePost(filename) {
  const filePath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const frontmatter = extractFrontmatter(content);
  const wordCount = countWords(content);
  const slug = filename.replace('.mdx', '');
  
  const title = frontmatter?.title || 'No Title';
  const imagePath = frontmatter?.image || '';
  const imageExists = checkImageExists(imagePath);
  const titleQuality = assessTitleQuality(title);
  
  const status = wordCount >= 500 ? 'Ready' : 'Draft';
  
  return {
    slug,
    title,
    wordCount,
    status,
    imageExists,
    imagePath,
    titleQuality,
  };
}

function generateReport() {
  console.log('\n🔍 CONTENT QUALITY ASSURANCE REPORT\n');
  console.log('='.repeat(120));
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const results = files.map(analyzePost);
  
  // Sort by status (Ready first) then by word count
  results.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'Ready' ? -1 : 1;
    }
    return b.wordCount - a.wordCount;
  });
  
  // Print table header
  console.log(
    '| Status | Words | Image | Title Quality | Slug'.padEnd(60) + '| Title'
  );
  console.log('|' + '-'.repeat(118) + '|');
  
  // Print each post
  results.forEach(post => {
    const statusIcon = post.status === 'Ready' ? '✅' : '⚠️';
    const imageIcon = post.imageExists ? '✓' : '✗';
    const titleIcon = 
      post.titleQuality === 'Strong' ? '🔥' :
      post.titleQuality === 'Moderate' ? '👍' :
      post.titleQuality === 'Generic' ? '⚠️' : '❌';
    
    const statusCol = `${statusIcon} ${post.status}`.padEnd(8);
    const wordsCol = post.wordCount.toString().padEnd(7);
    const imageCol = `${imageIcon}`.padEnd(7);
    const titleQualityCol = `${titleIcon} ${post.titleQuality}`.padEnd(15);
    const slugCol = post.slug.substring(0, 40).padEnd(42);
    const titleCol = post.title.substring(0, 50);
    
    console.log(
      `| ${statusCol}| ${wordsCol}| ${imageCol}| ${titleQualityCol}| ${slugCol}| ${titleCol}`
    );
  });
  
  console.log('='.repeat(120));
  
  // Generate summary
  const ready = results.filter(r => r.status === 'Ready' && r.imageExists);
  const needsRewrite = results.filter(r => r.status === 'Draft');
  const missingImages = results.filter(r => !r.imageExists);
  const weakTitles = results.filter(r => 
    r.titleQuality === 'Generic' || r.titleQuality === 'Too Short' || r.titleQuality === 'Missing'
  );
  
  console.log('\n📊 SUMMARY\n');
  console.log(`✅ ${ready.length} articles are READY (Long + Image + Good Title)`);
  console.log(`⚠️  ${needsRewrite.length} articles need REWRITING (< 500 words)`);
  console.log(`🖼️  ${missingImages.length} articles are MISSING IMAGES`);
  console.log(`📝 ${weakTitles.length} articles have WEAK TITLES`);
  
  console.log('\n🎯 DEPLOYMENT READINESS\n');
  const deploymentReady = results.filter(r => 
    r.status === 'Ready' && 
    r.imageExists && 
    (r.titleQuality === 'Strong' || r.titleQuality === 'Moderate')
  );
  console.log(`${deploymentReady.length}/${results.length} articles are deployment-ready`);
  console.log(`${Math.round((deploymentReady.length / results.length) * 100)}% completion rate`);
  
  // Detailed issues
  if (needsRewrite.length > 0) {
    console.log('\n⚠️  ARTICLES NEEDING REWRITE (< 500 words):\n');
    needsRewrite.forEach(post => {
      console.log(`   - ${post.slug} (${post.wordCount} words)`);
    });
  }
  
  if (missingImages.length > 0) {
    console.log('\n🖼️  ARTICLES MISSING IMAGES:\n');
    missingImages.forEach(post => {
      console.log(`   - ${post.slug}`);
      if (post.imagePath) {
        console.log(`     Expected: ${post.imagePath}`);
      }
    });
  }
  
  if (weakTitles.length > 0) {
    console.log('\n📝 ARTICLES WITH WEAK TITLES:\n');
    weakTitles.forEach(post => {
      console.log(`   - ${post.slug}: "${post.title}" (${post.titleQuality})`);
    });
  }
  
  console.log('\n' + '='.repeat(120) + '\n');
  
  // Export JSON report
  const reportPath = path.join(__dirname, 'qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);
}

// Run the report
try {
  generateReport();
} catch (error) {
  console.error('❌ Error generating report:', error.message);
  process.exit(1);
}
