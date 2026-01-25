/**
 * reset_and_build_blog.js
 * 
 * Fresh Start Script for Blog Content
 * 
 * This script performs a complete cleanup and regeneration of blog content:
 * 1. CLEANUP: Deletes all existing MDX articles and blog images
 * 2. REGENERATION: Filters relevant posts from Instagram JSON and creates new MDX files
 * 3. VERIFICATION: Reports statistics on deleted and generated files
 * 
 * Usage: node scripts/reset_and_build_blog.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  // Source data
  sourceJsonPath: path.join(__dirname, '../../lipedema_upload/dataset_instagram2026-01-03.json'),
  
  // Target directories
  articlesDir: path.join(__dirname, '../src/content/articles'),
  blogImagesDir: path.join(__dirname, '../public/images/blog'),
  
  // Filter keywords (Hebrew) - posts must contain at least one
  relevantKeywords: [
    'ליפאדמה',
    'לימפאדמה', 
    'בצקות',
    'נפיחות',
    'ניתוח',
    'תזונה',
    'לימפה',
    'דלקת',
    'אנטי-דלקתי'
  ],
  
  // Exclusion patterns (personal/political content without medical context)
  exclusionPatterns: [
    /פוליטי/i,
    /בחירות/i,
    /מלחמה(?!.*ליפאדמה)/i,  // "war" unless also mentions lipedema
  ]
};

// Statistics tracking
const stats = {
  deletedArticles: 0,
  deletedImages: 0,
  totalPostsInJson: 0,
  relevantPosts: 0,
  generatedArticles: 0,
  skippedPosts: 0,
  imageDownloadSuccess: 0,
  imageDownloadFailed: 0
};

/**
 * STEP 1: CLEANUP - Delete all existing content
 */
async function cleanupExistingContent() {
  console.log('\n📁 STEP 1: CLEANUP - Removing existing content...\n');
  
  // Clean articles directory
  if (fs.existsSync(CONFIG.articlesDir)) {
    const articleFiles = fs.readdirSync(CONFIG.articlesDir);
    for (const file of articleFiles) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        fs.unlinkSync(path.join(CONFIG.articlesDir, file));
        stats.deletedArticles++;
      }
    }
    console.log(`   ✓ Deleted ${stats.deletedArticles} article files from ${CONFIG.articlesDir}`);
  } else {
    fs.mkdirSync(CONFIG.articlesDir, { recursive: true });
    console.log(`   ✓ Created articles directory: ${CONFIG.articlesDir}`);
  }
  
  // Clean blog images directory
  if (fs.existsSync(CONFIG.blogImagesDir)) {
    const imageFiles = fs.readdirSync(CONFIG.blogImagesDir);
    for (const file of imageFiles) {
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        fs.unlinkSync(path.join(CONFIG.blogImagesDir, file));
        stats.deletedImages++;
      }
    }
    console.log(`   ✓ Deleted ${stats.deletedImages} image files from ${CONFIG.blogImagesDir}`);
  } else {
    fs.mkdirSync(CONFIG.blogImagesDir, { recursive: true });
    console.log(`   ✓ Created blog images directory: ${CONFIG.blogImagesDir}`);
  }
}

/**
 * Check if a post is relevant based on keywords
 */
function isRelevantPost(post) {
  const caption = post.caption || '';
  const hashtags = (post.hashtags || []).join(' ');
  const fullText = `${caption} ${hashtags}`.toLowerCase();
  
  // Check for relevant keywords
  const hasRelevantKeyword = CONFIG.relevantKeywords.some(keyword => 
    fullText.includes(keyword.toLowerCase())
  );
  
  if (!hasRelevantKeyword) return false;
  
  // Check for exclusion patterns
  const isExcluded = CONFIG.exclusionPatterns.some(pattern => 
    pattern.test(caption)
  );
  
  return !isExcluded;
}

/**
 * Generate SEO-friendly slug from Hebrew text
 */
function generateSlug(text, postId) {
  // Extract first meaningful words from caption
  const cleanText = text
    .replace(/#[\w\u0590-\u05FF]+/g, '') // Remove hashtags
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 100);
  
  // Create a simple slug based on post ID and topic detection
  const topics = {
    'תזונה': 'nutrition',
    'ליפאדמה': 'lipedema',
    'לימפאדמה': 'lymphedema',
    'ניתוח': 'surgery',
    'טיפול': 'treatment',
    'דלקת': 'inflammation',
    'בצקות': 'edema',
    'נפיחות': 'swelling'
  };
  
  let topicSlug = 'article';
  for (const [hebrew, english] of Object.entries(topics)) {
    if (cleanText.includes(hebrew)) {
      topicSlug = english;
      break;
    }
  }
  
  return `${topicSlug}-${postId}`;
}

/**
 * Generate SEO-friendly image filename
 */
function generateImageFilename(post) {
  const slug = generateSlug(post.caption || '', post.id);
  return `${slug}.jpg`;
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Detect category from content
 */
function detectCategory(caption) {
  const text = caption.toLowerCase();
  
  if (text.includes('תזונה') || text.includes('אוכל') || text.includes('מתכון') || text.includes('דיאטה')) {
    return 'nutrition';
  }
  if (text.includes('ניתוח') || text.includes('טיפול') || text.includes('עיסוי') || text.includes('לימפתי')) {
    return 'physical';
  }
  if (text.includes('אבחון') || text.includes('סימפטום') || text.includes('תסמין')) {
    return 'diagnosis';
  }
  return 'mindset';
}

/**
 * Generate title from caption
 */
function generateTitle(caption) {
  // Remove hashtags and clean up
  let clean = caption
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  // Take first sentence or first 80 chars
  const firstSentence = clean.split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
    return firstSentence.trim();
  }
  
  // Fallback: first 80 chars
  return clean.substring(0, 80).trim() + (clean.length > 80 ? '...' : '');
}

/**
 * Generate MDX content for a post
 */
function generateMdxContent(post, imageFilename) {
  const caption = post.caption || '';
  const title = generateTitle(caption);
  const slug = generateSlug(caption, post.id);
  const category = detectCategory(caption);
  const date = post.timestamp || new Date().toISOString();
  
  // Extract keywords from hashtags
  const keywords = (post.hashtags || [])
    .filter(tag => tag.length > 2)
    .slice(0, 5)
    .map(tag => `"${tag}"`);
  
  // Generate meta description (max 155 chars)
  const cleanCaption = caption.replace(/#[\w\u0590-\u05FF]+/g, '').replace(/\n+/g, ' ').trim();
  const metaDescription = cleanCaption.substring(0, 150) + (cleanCaption.length > 150 ? '...' : '');
  
  // Format content with proper structure
  const contentBody = formatContentBody(caption);
  
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${metaDescription.replace(/"/g, '\\"')}"
date: "${date}"
category: "${category}"
image: "/images/blog/${imageFilename}"
alt: "${title.substring(0, 50).replace(/"/g, '\\"')}"
keywords: [${keywords.join(', ')}]
originalPostId: "${post.id}"
---`;

  return `${frontmatter}

# ${title}

${contentBody}

---

**לקביעת תור לייעוץ אישי ובניית תוכנית טיפול מותאמת, שלחי הודעה לאביטל רוזן.**

*המידע במאמר זה הוא למטרות חינוכיות בלבד ואינו מהווה תחליף לייעוץ רפואי מקצועי.*
`;
}

/**
 * Format content body with proper structure
 */
function formatContentBody(caption) {
  // Remove hashtags
  let content = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
  
  // Split into paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  
  // Format each paragraph
  return paragraphs.map(p => p.trim()).join('\n\n');
}

/**
 * STEP 2: REGENERATION - Load, filter, and generate new content
 */
async function regenerateContent() {
  console.log('\n📝 STEP 2: REGENERATION - Creating new content...\n');
  
  // Load source JSON
  if (!fs.existsSync(CONFIG.sourceJsonPath)) {
    throw new Error(`Source JSON not found: ${CONFIG.sourceJsonPath}`);
  }
  
  const rawData = fs.readFileSync(CONFIG.sourceJsonPath, 'utf8');
  const posts = JSON.parse(rawData);
  stats.totalPostsInJson = posts.length;
  console.log(`   📊 Loaded ${posts.length} posts from source JSON`);
  
  // Filter relevant posts
  const relevantPosts = posts.filter(isRelevantPost);
  stats.relevantPosts = relevantPosts.length;
  stats.skippedPosts = posts.length - relevantPosts.length;
  console.log(`   ✓ Found ${relevantPosts.length} relevant posts (skipped ${stats.skippedPosts})`);
  
  // Process each relevant post
  console.log('\n   Processing posts...\n');
  
  for (let i = 0; i < relevantPosts.length; i++) {
    const post = relevantPosts[i];
    const progress = `[${i + 1}/${relevantPosts.length}]`;
    
    try {
      // Generate filenames
      const imageFilename = generateImageFilename(post);
      const mdxFilename = `${post.id}.mdx`;
      
      // Download image (if available)
      const imageUrl = post.displayUrl || post.imageUrl || 
        (post.images && post.images[0]) || 
        (post.sidecarImages && post.sidecarImages[0]?.url);
      
      if (imageUrl) {
        const imagePath = path.join(CONFIG.blogImagesDir, imageFilename);
        try {
          await downloadImage(imageUrl, imagePath);
          stats.imageDownloadSuccess++;
          console.log(`   ${progress} ✓ Downloaded: ${imageFilename}`);
        } catch (imgErr) {
          stats.imageDownloadFailed++;
          console.log(`   ${progress} ⚠ Image failed: ${imageFilename} (${imgErr.message})`);
        }
      } else {
        stats.imageDownloadFailed++;
        console.log(`   ${progress} ⚠ No image URL for post ${post.id}`);
      }
      
      // Generate MDX content
      const mdxContent = generateMdxContent(post, imageFilename);
      const mdxPath = path.join(CONFIG.articlesDir, mdxFilename);
      fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      stats.generatedArticles++;
      
    } catch (err) {
      console.error(`   ${progress} ✗ Error processing post ${post.id}: ${err.message}`);
    }
  }
}

/**
 * STEP 3: VERIFICATION - Report statistics
 */
function reportStatistics() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION - Final Statistics');
  console.log('='.repeat(60));
  console.log(`
   CLEANUP:
   ├── Deleted ${stats.deletedArticles} old article files
   └── Deleted ${stats.deletedImages} old image files

   REGENERATION:
   ├── Total posts in JSON: ${stats.totalPostsInJson}
   ├── Relevant posts found: ${stats.relevantPosts}
   ├── Posts skipped (irrelevant): ${stats.skippedPosts}
   ├── Articles generated: ${stats.generatedArticles}
   ├── Images downloaded: ${stats.imageDownloadSuccess}
   └── Image downloads failed: ${stats.imageDownloadFailed}

   OUTPUT:
   ├── Articles: ${CONFIG.articlesDir}
   └── Images: ${CONFIG.blogImagesDir}
`);
  console.log('='.repeat(60));
  console.log('✅ Fresh Start Complete!\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 FRESH START: Blog Content Reset & Rebuild');
  console.log('='.repeat(60));
  
  try {
    await cleanupExistingContent();
    await regenerateContent();
    reportStatistics();
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

// Run the script
main();
