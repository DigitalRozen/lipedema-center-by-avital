/**
 * Generate Blog Posts from Instagram Scraper Data
 * 
 * Processes raw Instagram scraper JSON and generates MDX blog posts with:
 * - Hebrew keyword filtering (include/exclude logic)
 * - Category mapping based on content analysis
 * - Image downloading to local folder
 * - SEO-optimized MDX file generation
 * 
 * Usage:
 *   node scripts/generate_blog_posts.js <input.json> [--output-dir=content/posts]
 * 
 * Input JSON format (Instagram scraper):
 *   [{ caption, displayUrl, timestamp, id }, ...]
 * 
 * Example:
 *   node scripts/generate_blog_posts.js ../dataset_instagram2026-01-03.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  includeKeywords: [
    'ליפאדמה', 'לימפאדמה', 'בצקות', 'נפיחות', 'תזונה',
    'מתכון', 'ניתוח', 'לימפה', 'דלקתיות',
  ],
  excludeKeywords: ['אוטיזם', 'רצף', 'ASD'],
  categoryRules: {
    nutrition: ['מתכון', 'תזונה', 'אוכל', 'מזון', 'דיאטה', 'נוגדי חמצון', 'אנטי דלקתי'],
    diagnosis: ['אבחון', 'סימפטומים', 'תסמינים', 'כאב', 'לימפאדמה', 'בצקת'],
    physical: ['ניתוח', 'לחץ', 'גרביים', 'פעילות', 'תרגיל', 'עיסוי', 'ניקוז', 'טיפול'],
    mindset: ['נפשי', 'רגשי', 'התמודדות', 'סיפור', 'מסע', 'תמיכה'],
  },
  defaultCategory: 'diagnosis',
  outputDir: 'content/posts',
  imagesDir: 'public/images/blog',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateSlug(text, postId) {
  const cleanText = text
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/@[\w]+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();
  
  const firstSentence = cleanText.split(/[.!?]/)[0] || cleanText;
  const truncated = firstSentence.substring(0, 50).trim();
  
  const hebrewToEnglish = {
    'ליפאדמה': 'lipedema', 'לימפאדמה': 'lymphedema', 'תזונה': 'nutrition',
    'מתכון': 'recipe', 'ניתוח': 'surgery', 'טיפול': 'treatment',
    'בצקת': 'edema', 'לימפה': 'lymph', 'דלקת': 'inflammation',
    'כאב': 'pain', 'גרביים': 'compression', 'עיסוי': 'massage',
  };
  
  let slug = truncated.toLowerCase();
  for (const [heb, eng] of Object.entries(hebrewToEnglish)) {
    slug = slug.replace(new RegExp(heb, 'g'), eng);
  }
  
  slug = slug
    .replace(/[\u0590-\u05FF]+/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
  
  if (!slug || slug.length < 3) {
    slug = `post-${postId.substring(0, 8)}`;
  }
  return slug;
}

function extractTitle(caption) {
  const cleanCaption = caption
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/@[\w]+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();
  
  const sentences = cleanCaption.split(/[.!?]/);
  let title = sentences[0]?.trim() || cleanCaption.substring(0, 100);
  title = title.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  return title || 'פוסט על ליפאדמה';
}

function generateDescription(caption) {
  const cleanCaption = caption
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/@[\w]+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanCaption.length <= 155) return cleanCaption;
  return cleanCaption.substring(0, 152) + '...';
}

function determineCategory(caption) {
  const lowerCaption = caption.toLowerCase();
  for (const [category, keywords] of Object.entries(CONFIG.categoryRules)) {
    for (const keyword of keywords) {
      if (lowerCaption.includes(keyword)) return category;
    }
  }
  return CONFIG.defaultCategory;
}

function extractTags(caption, category) {
  const tags = new Set();
  const categoryTags = {
    nutrition: 'תזונה', diagnosis: 'אבחון',
    physical: 'טיפול שמרני', mindset: 'מיינדסט',
  };
  tags.add(categoryTags[category] || 'ליפאדמה');
  
  const hashtags = caption.match(/#([\w\u0590-\u05FF]+)/g) || [];
  hashtags.map(h => h.replace('#', ''))
    .filter(h => h.length > 2 && h.length < 20)
    .slice(0, 3)
    .forEach(h => tags.add(h));
  
  if (tags.size === 0) tags.add('ליפאדמה');
  return Array.from(tags).slice(0, 5);
}

function formatDate(timestamp) {
  if (!timestamp) return new Date().toISOString().split('T')[0];
  if (typeof timestamp === 'string') {
    return new Date(timestamp).toISOString().split('T')[0];
  }
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}


async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(outputPath); });
      fileStream.on('error', (err) => { fs.unlink(outputPath, () => {}); reject(err); });
    });
    request.on('error', reject);
    request.setTimeout(30000, () => { request.destroy(); reject(new Error('Download timeout')); });
  });
}

function shouldIncludePost(caption) {
  if (!caption || typeof caption !== 'string') return false;
  const lowerCaption = caption.toLowerCase();
  const hasIncludeKeyword = CONFIG.includeKeywords.some(k => lowerCaption.includes(k.toLowerCase()));
  if (!hasIncludeKeyword) return false;
  
  const hasLipedema = lowerCaption.includes('ליפאדמה') || lowerCaption.includes('לימפאדמה');
  if (!hasLipedema) {
    const hasExcludeKeyword = CONFIG.excludeKeywords.some(k => lowerCaption.includes(k.toLowerCase()));
    if (hasExcludeKeyword) return false;
  }
  return true;
}

function enhanceContent(caption) {
  const cleanCaption = caption.replace(/https?:\/\/\S+/g, '').trim();
  const paragraphs = cleanCaption.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
  
  const contentParagraphs = [];
  const hashtags = [];
  
  for (const para of paragraphs) {
    if (para.startsWith('#') && para.split(' ').every(w => w.startsWith('#') || w === '')) {
      hashtags.push(...(para.match(/#[\w\u0590-\u05FF]+/g) || []));
    } else {
      contentParagraphs.push(para);
    }
  }
  
  let body = contentParagraphs.join('\n\n');
  if (body.length < 100) {
    body += '\n\n---\n\n*לפרטים נוספים ושאלות, צרי קשר.*';
  }
  return { body, hashtags: hashtags.map(h => h.replace('#', '')) };
}

function generateFrontmatter(post, slug, imagePath) {
  return {
    title: extractTitle(post.caption),
    slug,
    description: generateDescription(post.caption),
    date: formatDate(post.timestamp),
    image: imagePath,
    category: determineCategory(post.caption),
    tags: extractTags(post.caption, determineCategory(post.caption)),
    originalPostId: post.id,
  };
}

function generateMDX(frontmatter, body) {
  const fm = [
    '---',
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `slug: "${frontmatter.slug}"`,
    `description: "${frontmatter.description.replace(/"/g, '\\"')}"`,
    `date: "${frontmatter.date}"`,
    `image: "${frontmatter.image}"`,
    `category: "${frontmatter.category}"`,
    `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`,
    `originalPostId: "${frontmatter.originalPostId}"`,
    '---',
  ].join('\n');
  return `${fm}\n\n${body}\n`;
}


async function processPost(post, outputDir, imagesDir, existingSlugs) {
  let slug = generateSlug(post.caption, post.id);
  let slugCounter = 1;
  const baseSlug = slug;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${slugCounter}`;
    slugCounter++;
  }
  existingSlugs.add(slug);
  
  let imagePath = `/images/blog/${slug}.jpg`;
  const localImagePath = path.join(imagesDir, `${slug}.jpg`);
  
  if (post.displayUrl) {
    try {
      await downloadImage(post.displayUrl, localImagePath);
      console.log(`  ✓ Downloaded image: ${slug}.jpg`);
    } catch (err) {
      console.log(`  ⚠ Failed to download image: ${err.message}`);
      imagePath = '/images/blog/default-lipedema.jpg';
    }
  } else {
    imagePath = '/images/blog/default-lipedema.jpg';
  }
  
  const { body } = enhanceContent(post.caption);
  const frontmatter = generateFrontmatter(post, slug, imagePath);
  const mdxContent = generateMDX(frontmatter, body);
  
  const mdxPath = path.join(outputDir, `${slug}.mdx`);
  fs.writeFileSync(mdxPath, mdxContent, 'utf8');
  
  return { slug, title: frontmatter.title, category: frontmatter.category };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node generate_blog_posts.js <input.json> [--output-dir=content/posts]');
    process.exit(1);
  }
  
  const inputFile = args[0];
  let outputDir = CONFIG.outputDir;
  let imagesDir = CONFIG.imagesDir;
  
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--output-dir=')) outputDir = arg.split('=')[1];
  }
  
  const inputPath = path.resolve(inputFile);
  const outputPath = path.resolve(outputDir);
  const imagesPath = path.resolve(imagesDir);
  
  console.log('');
  console.log('🚀 Instagram to Blog Posts Generator');
  console.log('=====================================');
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Images: ${imagesPath}`);
  console.log('');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  fs.mkdirSync(outputPath, { recursive: true });
  fs.mkdirSync(imagesPath, { recursive: true });
  
  console.log('📖 Reading input file...');
  let posts;
  try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    posts = JSON.parse(rawData);
    if (!Array.isArray(posts)) posts = posts.posts || posts.data || [];
  } catch (err) {
    console.error(`❌ Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }
  
  console.log(`📊 Found ${posts.length} total posts`);
  console.log('');
  
  console.log('🔍 Filtering posts by keywords...');
  const filteredPosts = posts.filter(post => shouldIncludePost(post.caption));
  console.log(`✓ ${filteredPosts.length} posts match criteria`);
  console.log(`✗ ${posts.length - filteredPosts.length} posts excluded`);
  console.log('');
  
  console.log('📝 Generating blog posts...');
  const existingSlugs = new Set();
  const results = { success: [], failed: [], byCategory: { nutrition: 0, diagnosis: 0, physical: 0, mindset: 0 } };
  
  for (let i = 0; i < filteredPosts.length; i++) {
    const post = filteredPosts[i];
    console.log(`[${i + 1}/${filteredPosts.length}] Processing post ${post.id}...`);
    try {
      const result = await processPost(post, outputPath, imagesPath, existingSlugs);
      results.success.push(result);
      results.byCategory[result.category]++;
      console.log(`  ✓ Created: ${result.slug}.mdx`);
    } catch (err) {
      results.failed.push({ id: post.id, error: err.message });
      console.log(`  ❌ Failed: ${err.message}`);
    }
  }
  
  console.log('');
  console.log('📊 Summary');
  console.log('==========');
  console.log(`Total posts processed: ${filteredPosts.length}`);
  console.log(`Successfully created:  ${results.success.length}`);
  console.log(`Failed:                ${results.failed.length}`);
  console.log('');
  console.log('By Category:');
  console.log(`  - nutrition:  ${results.byCategory.nutrition}`);
  console.log(`  - diagnosis:  ${results.byCategory.diagnosis}`);
  console.log(`  - physical:   ${results.byCategory.physical}`);
  console.log(`  - mindset:    ${results.byCategory.mindset}`);
  console.log('');
  console.log(`✅ Done! MDX files saved to: ${outputPath}`);
  console.log(`✅ Images saved to: ${imagesPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
