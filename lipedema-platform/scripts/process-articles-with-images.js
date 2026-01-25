#!/usr/bin/env node
/**
 * Process Articles with Images Script
 * 
 * Takes processed articles from the converter and:
 * 1. Downloads images locally to /public/images/blog folder
 * 2. Renames images with SEO-friendly kebab-case names
 * 3. Generates .mdx files for the CMS content folder
 * 4. Handles expired image URLs with placeholder fallback
 * 
 * Usage:
 *   node scripts/process-articles-with-images.js <input.json> [--output-dir=src/content/blog]
 * 
 * Arguments:
 *   input.json     - Path to JSON file with processed articles or original Instagram posts
 *   --output-dir   - (Optional) Output directory for MDX files (default: src/content/blog)
 *   --images-dir   - (Optional) Images directory (default: public/images/blog)
 * 
 * Example:
 *   node scripts/process-articles-with-images.js ../relevant_posts.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================
// Configuration
// ============================================

const CONFIG = {
  defaultOutputDir: 'src/content/blog',
  defaultImagesDir: 'public/images/blog',
  placeholderImage: '/images/instagram-placeholder.svg',
  imageTimeout: 10000, // 10 seconds
  maxRetries: 2,
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// ============================================
// Topic and Category Mapping
// ============================================

const TOPIC_TO_CATEGORY = {
  'Treatment': 'physical',
  'Anti-Inflammatory': 'nutrition',
  'Nutrition': 'nutrition',
  'Lymphedema': 'diagnosis',
  'Diagnosis': 'diagnosis',
  'General Lipedema': 'mindset',
};

const VALID_TAGS = [
  'תזונה',
  'טיפול שמרני',
  'ניתוחים',
  'סיפורי הצלחה',
  'אבחון',
  'תוספי תזונה',
];

// ============================================
// Utility Functions
// ============================================

/**
 * Convert Hebrew/mixed text to kebab-case slug
 */
function toKebabCase(text) {
  // Hebrew to English transliteration map for common words
  const hebrewMap = {
    'ליפאדמה': 'lipedema',
    'לימפאדמה': 'lymphedema',
    'תזונה': 'nutrition',
    'טיפול': 'treatment',
    'אבחון': 'diagnosis',
    'דלקת': 'inflammation',
    'לימפה': 'lymph',
    'בצקת': 'edema',
    'ניקוז': 'drainage',
    'מערכת': 'system',
    'בריאות': 'health',
    'גוף': 'body',
    'רגליים': 'legs',
    'ידיים': 'arms',
    'כאב': 'pain',
    'נפיחות': 'swelling',
  };
  
  let result = text.toLowerCase();
  
  // Replace Hebrew words with English equivalents
  Object.entries(hebrewMap).forEach(([hebrew, english]) => {
    result = result.replace(new RegExp(hebrew, 'g'), english);
  });
  
  // Remove remaining Hebrew characters
  result = result.replace(/[\u0590-\u05FF]/g, '');
  
  // Convert to kebab-case
  result = result
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Multiple hyphens to single
    .replace(/^-|-$/g, '')         // Trim hyphens
    .substring(0, 50);             // Limit length
  
  return result || 'article';
}

/**
 * Generate SEO-friendly image filename
 */
function generateImageFilename(topic, postId, originalUrl) {
  const topicSlug = toKebabCase(topic);
  const extension = getImageExtension(originalUrl);
  return `${topicSlug}-${postId}.${extension}`;
}

/**
 * Get image extension from URL
 */
function getImageExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase().replace('.', '');
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
  } catch {
    return 'jpg';
  }
}

/**
 * Download image from URL
 */
async function downloadImage(url, destPath, retries = CONFIG.maxRetries) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { timeout: CONFIG.imageTimeout }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, destPath, retries)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check for success
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: Failed to download image`));
        return;
      }
      
      // Ensure directory exists
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write to file
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {}); // Clean up partial file
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          downloadImage(url, destPath, retries - 1)
            .then(resolve)
            .catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });
    
    request.on('timeout', () => {
      request.destroy();
      if (retries > 0) {
        downloadImage(url, destPath, retries - 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Request timeout'));
      }
    });
  });
}

/**
 * Check if caption contains only hashtags
 */
function isHashtagOnly(caption) {
  const withoutHashtags = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
  return withoutHashtags.length === 0;
}

/**
 * Clean caption from hashtags
 */
function cleanCaption(caption) {
  return caption
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Generate article slug
 */
function generateSlug(topic, content, postId) {
  const topicSlug = toKebabCase(topic);
  // Extract key words from content
  const contentWords = toKebabCase(content.substring(0, 100));
  const slug = contentWords ? `${topicSlug}-${contentWords}` : topicSlug;
  return `${slug}-${postId}`.substring(0, 80);
}

/**
 * Generate meta description
 */
function generateMetaDescription(content) {
  const cleaned = cleanCaption(content);
  const maxLength = 155 - ' | טיפול בליפאדמה'.length;
  let base = cleaned.substring(0, maxLength);
  
  const lastSpace = base.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    base = base.substring(0, lastSpace);
  }
  
  return `${base} | טיפול בליפאדמה`;
}

/**
 * Generate title from content
 */
function generateTitle(content, topic) {
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 10 && firstLine.length < 100) {
      return firstLine;
    }
  }
  
  const topicTitles = {
    'Treatment': 'טיפול יעיל בליפאדמה - מדריך מקיף',
    'Anti-Inflammatory': 'הפחתת דלקתיות בליפאדמה - טיפים מעשיים',
    'Nutrition': 'תזונה נכונה לליפאדמה - מה כדאי לאכול',
    'Lymphedema': 'לימפאדמה - כל מה שצריך לדעת',
    'Diagnosis': 'אבחון ליפאדמה - סימנים ותסמינים',
    'General Lipedema': 'ליפאדמה - מידע חשוב לנשים',
  };
  
  return topicTitles[topic] || 'מידע חשוב על ליפאדמה';
}

/**
 * Select tags based on content and topic
 */
function selectTags(content, topic) {
  const tags = [];
  const contentLower = content.toLowerCase();
  
  const topicTagMap = {
    'Treatment': 'טיפול שמרני',
    'Anti-Inflammatory': 'תזונה',
    'Nutrition': 'תזונה',
    'Lymphedema': 'אבחון',
    'Diagnosis': 'אבחון',
    'General Lipedema': 'טיפול שמרני',
  };
  
  if (topicTagMap[topic]) {
    tags.push(topicTagMap[topic]);
  }
  
  if ((contentLower.includes('תזונה') || contentLower.includes('אוכל')) && !tags.includes('תזונה')) {
    tags.push('תזונה');
  }
  
  if (contentLower.includes('תוסף') || contentLower.includes('ויטמין')) {
    tags.push('תוספי תזונה');
  }
  
  return tags.slice(0, 3);
}

/**
 * Expand content with structure
 */
function expandContent(rawCaption, topic) {
  const cleaned = cleanCaption(rawCaption);
  const isShort = cleaned.length < 200;
  
  const introduction = isShort
    ? `${cleaned}\n\nבמאמר זה נרחיב על הנושא ונספק מידע מקיף.`
    : cleaned.split('\n\n')[0] || cleaned.substring(0, 200);
  
  const sections = [];
  
  if (isShort) {
    sections.push({
      heading: 'מה חשוב לדעת',
      content: `${cleaned}\n\nטיפול בליפאדמה דורש גישה הוליסטית המשלבת תזונה נכונה, פעילות גופנית מותאמת וטיפולים ממוקדים.`,
    });
    
    sections.push({
      heading: 'המלצות מעשיות',
      content: 'מומלץ להתייעץ עם איש מקצוע המתמחה בליפאדמה כדי לבנות תוכנית טיפול אישית. ניקוז לימפתי, תזונה אנטי-דלקתית ופעילות גופנית עדינה יכולים לסייע משמעותית.',
    });
  } else {
    const paragraphs = cleaned.split('\n\n').filter(p => p.trim());
    
    paragraphs.forEach((para, index) => {
      if (index === 0) return;
      sections.push({
        heading: `חלק ${index}`,
        content: para,
      });
    });
    
    if (sections.length === 0) {
      sections.push({
        heading: 'מידע נוסף',
        content: cleaned,
      });
    }
  }
  
  const conclusion = 'לסיכום, חשוב לזכור שליפאדמה היא מצב שניתן לנהל בהצלחה עם הגישה הנכונה. לפרטים נוספים על טיפולים והתאמות אישיות, צרי קשר.';
  
  return { introduction, sections, conclusion };
}

/**
 * Generate Q&A section
 */
function generateQASection(userQuestions) {
  if (!userQuestions || userQuestions.length === 0) {
    return null;
  }
  
  const consultationPhrases = [
    'מומלץ להתייעץ עם איש מקצוע',
    'כדאי לפנות לרופא',
    'התייעצי עם מומחה',
  ];
  
  return {
    questions: userQuestions.map(q => ({
      question: q,
      answer: `תודה על השאלה! זו נקודה חשובה. ${consultationPhrases[0]} לקבלת מענה מותאם אישית למצבך.`,
    })),
  };
}

// ============================================
// MDX Generation
// ============================================

/**
 * Generate MDX frontmatter
 */
function generateFrontmatter(article) {
  const lines = [
    '---',
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `slug: "${article.slug}"`,
    `description: "${article.metaDescription.replace(/"/g, '\\"')}"`,
    `date: "${article.date}"`,
    `image: "${article.imagePath}"`,
    `category: "${article.category}"`,
    `tags:`,
    ...article.tags.map(tag => `  - "${tag}"`),
    `originalPostId: "${article.originalPostId}"`,
    '---',
  ];
  
  return lines.join('\n');
}

/**
 * Generate MDX content
 */
function generateMDXContent(article) {
  const lines = [];
  
  // Frontmatter
  lines.push(generateFrontmatter(article));
  lines.push('');
  
  // Introduction
  lines.push(article.content.introduction);
  lines.push('');
  
  // Sections
  article.content.sections.forEach(section => {
    lines.push(`## ${section.heading}`);
    lines.push('');
    lines.push(section.content);
    lines.push('');
  });
  
  // Q&A Section
  if (article.qaSection && article.qaSection.questions.length > 0) {
    lines.push('## שאלות ותשובות');
    lines.push('');
    
    article.qaSection.questions.forEach(qa => {
      lines.push(`### ${qa.question}`);
      lines.push('');
      lines.push(qa.answer);
      lines.push('');
    });
  }
  
  // Conclusion
  lines.push('## סיכום');
  lines.push('');
  lines.push(article.content.conclusion);
  
  return lines.join('\n');
}

// ============================================
// Main Processing Logic
// ============================================

/**
 * Process a single post
 */
async function processPost(post, imagesDir, outputDir) {
  // Validate post
  if (!post.raw_caption || isHashtagOnly(post.raw_caption)) {
    return { success: false, reason: 'Invalid or hashtag-only caption' };
  }
  
  const topic = post.topic || 'General Lipedema';
  const postId = post.id || Date.now().toString();
  
  // Generate image filename and path
  const imageFilename = generateImageFilename(topic, postId, post.image_url || '');
  const localImagePath = path.join(imagesDir, imageFilename);
  const webImagePath = `/images/blog/${imageFilename}`;
  
  // Download image
  let finalImagePath = webImagePath;
  let imageDownloaded = false;
  
  if (post.image_url) {
    try {
      await downloadImage(post.image_url, localImagePath);
      imageDownloaded = true;
      log(`  ✓ Downloaded: ${imageFilename}`, colors.dim);
    } catch (error) {
      log(`  ⚠ Image download failed: ${error.message}`, colors.yellow);
      finalImagePath = CONFIG.placeholderImage;
    }
  } else {
    finalImagePath = CONFIG.placeholderImage;
  }
  
  // Generate article data
  const category = TOPIC_TO_CATEGORY[topic] || 'mindset';
  const title = generateTitle(post.raw_caption, topic);
  const slug = generateSlug(topic, post.raw_caption, postId);
  const metaDescription = generateMetaDescription(post.raw_caption);
  const tags = selectTags(post.raw_caption, topic);
  const content = expandContent(post.raw_caption, topic);
  const qaSection = generateQASection(post.user_questions);
  
  // Create article object
  const article = {
    title,
    slug,
    metaDescription,
    date: new Date().toISOString().split('T')[0],
    imagePath: finalImagePath,
    category,
    tags,
    originalPostId: postId,
    content,
    qaSection,
  };
  
  // Generate MDX content
  const mdxContent = generateMDXContent(article);
  
  // Write MDX file
  const mdxFilename = `${slug}.mdx`;
  const mdxPath = path.join(outputDir, mdxFilename);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(mdxPath, mdxContent, 'utf-8');
  
  return {
    success: true,
    article,
    mdxPath,
    imageDownloaded,
    imagePath: finalImagePath,
  };
}

/**
 * Process all posts
 */
async function processAllPosts(posts, imagesDir, outputDir) {
  const results = {
    total: posts.length,
    processed: 0,
    skipped: 0,
    imagesDownloaded: 0,
    imagesFailed: 0,
    articles: [],
    errors: [],
  };
  
  log(`\n📝 Processing ${posts.length} posts...`, colors.cyan);
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    log(`\n[${i + 1}/${posts.length}] Processing post ${post.id || i}...`, colors.dim);
    
    try {
      const result = await processPost(post, imagesDir, outputDir);
      
      if (result.success) {
        results.processed++;
        results.articles.push(result.article);
        
        if (result.imageDownloaded) {
          results.imagesDownloaded++;
        } else {
          results.imagesFailed++;
        }
        
        log(`  ✓ Created: ${path.basename(result.mdxPath)}`, colors.green);
      } else {
        results.skipped++;
        results.errors.push(`Post ${post.id}: ${result.reason}`);
        log(`  ⊘ Skipped: ${result.reason}`, colors.yellow);
      }
    } catch (error) {
      results.skipped++;
      results.errors.push(`Post ${post.id}: ${error.message}`);
      log(`  ✗ Error: ${error.message}`, colors.red);
    }
  }
  
  return results;
}

/**
 * Generate summary JSON file
 */
function generateSummaryJSON(results, outputDir) {
  const summary = {
    generatedAt: new Date().toISOString(),
    statistics: {
      total: results.total,
      processed: results.processed,
      skipped: results.skipped,
      imagesDownloaded: results.imagesDownloaded,
      imagesFailed: results.imagesFailed,
    },
    articles: results.articles.map(a => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      tags: a.tags,
      imagePath: a.imagePath,
    })),
    errors: results.errors,
  };
  
  const summaryPath = path.join(outputDir, '_articles-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  
  return summaryPath;
}

/**
 * Print final results
 */
function printResults(results) {
  log('\n' + '='.repeat(50), colors.cyan);
  log('📊 Processing Summary', colors.bright);
  log('='.repeat(50), colors.cyan);
  
  log(`\nTotal posts:        ${results.total}`);
  log(`Articles created:   ${results.processed}`, colors.green);
  log(`Posts skipped:      ${results.skipped}`, results.skipped > 0 ? colors.yellow : colors.reset);
  log(`Images downloaded:  ${results.imagesDownloaded}`, colors.green);
  log(`Images failed:      ${results.imagesFailed}`, results.imagesFailed > 0 ? colors.yellow : colors.reset);
  
  if (results.errors.length > 0) {
    log(`\n⚠️ Errors (${results.errors.length}):`, colors.yellow);
    results.errors.slice(0, 5).forEach(err => log(`  • ${err}`, colors.dim));
    if (results.errors.length > 5) {
      log(`  ... and ${results.errors.length - 5} more`, colors.dim);
    }
  }
  
  log('\n' + '='.repeat(50), colors.cyan);
}

// ============================================
// CLI Entry Point
// ============================================

function printUsage() {
  log('\n📝 Process Articles with Images', colors.bright);
  log('================================\n');
  log('Usage:', colors.cyan);
  log('  node scripts/process-articles-with-images.js <input.json> [options]\n');
  log('Options:', colors.cyan);
  log('  --output-dir=<path>  Output directory for MDX files (default: src/content/blog)');
  log('  --images-dir=<path>  Images directory (default: public/images/blog)');
  log('  --help, -h           Show this help message\n');
  log('Example:', colors.cyan);
  log('  node scripts/process-articles-with-images.js ../relevant_posts.json\n');
}

function parseArgs(args) {
  const options = {
    inputFile: null,
    outputDir: CONFIG.defaultOutputDir,
    imagesDir: CONFIG.defaultImagesDir,
  };
  
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg.startsWith('--output-dir=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg.startsWith('--images-dir=')) {
      options.imagesDir = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
      options.inputFile = arg;
    }
  }
  
  return options;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (!options.inputFile) {
    log('\n❌ Error: Missing input file', colors.red);
    printUsage();
    process.exit(1);
  }
  
  // Validate input file
  if (!fs.existsSync(options.inputFile)) {
    log(`\n❌ Error: Input file not found: ${options.inputFile}`, colors.red);
    process.exit(1);
  }
  
  log('\n🚀 Starting article processing...', colors.cyan);
  log(`📥 Input:  ${options.inputFile}`);
  log(`📤 Output: ${options.outputDir}`);
  log(`🖼️  Images: ${options.imagesDir}`);
  
  // Read input file
  let posts;
  try {
    const content = fs.readFileSync(options.inputFile, 'utf-8');
    const data = JSON.parse(content);
    posts = Array.isArray(data) ? data : (data.posts || []);
  } catch (error) {
    log(`\n❌ Error reading input file: ${error.message}`, colors.red);
    process.exit(1);
  }
  
  if (posts.length === 0) {
    log('\n⚠️ No posts found in input file', colors.yellow);
    process.exit(0);
  }
  
  // Process all posts
  const results = await processAllPosts(posts, options.imagesDir, options.outputDir);
  
  // Generate summary
  const summaryPath = generateSummaryJSON(results, options.outputDir);
  log(`\n📋 Summary saved to: ${summaryPath}`, colors.green);
  
  // Print results
  printResults(results);
  
  log(`\n✅ Done! Created ${results.processed} MDX files.`, colors.green);
  process.exit(results.processed > 0 ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});
