/**
 * Instagram to Keystatic Import Script
 * Imports Instagram posts into Keystatic MDX format
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const SOURCE_FILE = path.join(__dirname, '../../lipedema_upload/dataset_instagram2026-01-03.json');
const OUTPUT_DIR = path.join(__dirname, '../content/posts');
const IMAGES_DIR = path.join(__dirname, '../public/images/blog');

// Keywords for filtering relevant posts
const RELEVANT_KEYWORDS = [
  'ליפאדמה', 'לימפאדמה', 'בצקות', 'נפיחות', 
  'ניתוח', 'תזונה', 'מתכון', 'לימפה', 'דלקת'
];

// Category mapping keywords
const CATEGORY_KEYWORDS = {
  nutrition: ['מתכון', 'אוכל', 'תזונה', 'מזון', 'אכילה', 'דיאטה', 'צום'],
  physical: ['ניתוח', 'טיפול', 'עיסוי', 'לימפה', 'דרנאז', 'גרביים', 'לחץ'],
  mindset: ['נפש', 'רגש', 'מנטלי', 'חרדה', 'דיכאון', 'תמיכה', 'קהילה'],
  diagnosis: ['אבחון', 'סימפטום', 'תסמין', 'שלב', 'בדיקה']
};

// Hebrew to English transliteration map
const TRANSLITERATION = {
  'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
  'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
  'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'f',
  'צ': 'ts', 'ץ': 'ts', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
};

/**
 * Transliterate Hebrew text to English slug
 */
function transliterate(text) {
  let result = '';
  for (const char of text) {
    if (TRANSLITERATION[char]) {
      result += TRANSLITERATION[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    } else if (char === ' ' || char === '-') {
      result += '-';
    }
  }
  return result
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Extract title from caption (first sentence, cleaned)
 */
function extractTitle(caption) {
  if (!caption) return 'untitled';
  
  // Remove emojis
  let cleaned = caption.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Remove hashtags
  cleaned = cleaned.replace(/#[\u0590-\u05FFa-zA-Z0-9_]+/g, '');
  
  // Get first sentence (up to period, newline, or 100 chars)
  const match = cleaned.match(/^[^\n.!?]{10,100}/);
  if (match) {
    return match[0].trim();
  }
  
  // Fallback: first 80 chars
  return cleaned.substring(0, 80).trim() || 'untitled';
}

/**
 * Generate slug from title and post ID
 */
function generateSlug(title, postId) {
  const transliterated = transliterate(title);
  if (transliterated.length >= 10) {
    return `${transliterated}-${postId.substring(0, 6)}`;
  }
  return `post-${postId}`;
}

/**
 * Determine category based on caption content
 */
function determineCategory(caption) {
  if (!caption) return 'diagnosis';
  const lowerCaption = caption.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerCaption.includes(keyword)) {
        return category;
      }
    }
  }
  return 'diagnosis';
}

/**
 * Check if post is relevant based on keywords
 */
function isRelevantPost(post) {
  if (!post.caption || post.caption.length < 50) return false;
  
  const caption = post.caption.toLowerCase();
  return RELEVANT_KEYWORDS.some(keyword => caption.includes(keyword));
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(timestamp) {
  if (!timestamp) return new Date().toISOString().split('T')[0];
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });
    
    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Clean caption for MDX content
 */
function cleanContentForMdx(caption) {
  if (!caption) return '';
  
  // Escape special MDX characters
  let content = caption
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
  
  // Convert newlines to proper markdown paragraphs
  content = content
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .join('\n\n');
  
  return content;
}

/**
 * Generate MDX file content
 */
function generateMdxContent(post, slug, imagePath) {
  const title = extractTitle(post.caption);
  const date = formatDate(post.timestamp);
  const category = determineCategory(post.caption);
  const content = cleanContentForMdx(post.caption);
  
  // Extract hashtags as tags
  const tags = post.hashtags || [];
  const tagsYaml = tags.length > 0 
    ? `tags:\n${tags.slice(0, 5).map(t => `  - "${t}"`).join('\n')}`
    : 'tags: []';
  
  return `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
description: "${title.substring(0, 160).replace(/"/g, '\\"')}"
image: ${imagePath}
category: ${category}
${tagsYaml}
originalPostId: "${post.id}"
---

${content}
`;
}

/**
 * Main import function
 */
async function importPosts() {
  console.log('🚀 Starting Instagram to Keystatic import...\n');
  
  // Ensure directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
  
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`📁 Created images directory: ${IMAGES_DIR}`);
  }
  
  // Load source data
  console.log(`📖 Loading data from: ${SOURCE_FILE}`);
  const rawData = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const posts = JSON.parse(rawData);
  console.log(`   Found ${posts.length} total posts\n`);
  
  // Filter relevant posts
  const relevantPosts = posts.filter(isRelevantPost);
  console.log(`✅ Filtered to ${relevantPosts.length} relevant posts\n`);
  
  let successCount = 0;
  let errorCount = 0;
  const results = [];
  
  for (const post of relevantPosts) {
    try {
      const title = extractTitle(post.caption);
      const slug = generateSlug(title, post.id);
      const imageFilename = `${slug}.jpg`;
      const imagePath = `/images/blog/${imageFilename}`;
      const imageFullPath = path.join(IMAGES_DIR, imageFilename);
      const mdxPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
      
      console.log(`📝 Processing: ${title.substring(0, 50)}...`);
      
      // Download image if displayUrl exists
      if (post.displayUrl && !fs.existsSync(imageFullPath)) {
        try {
          await downloadImage(post.displayUrl, imageFullPath);
          console.log(`   ✅ Downloaded image`);
        } catch (imgErr) {
          console.log(`   ⚠️ Image download failed: ${imgErr.message}`);
        }
      }
      
      // Generate and write MDX file
      const mdxContent = generateMdxContent(post, slug, imagePath);
      fs.writeFileSync(mdxPath, mdxContent, 'utf-8');
      console.log(`   ✅ Created: ${slug}.mdx`);
      
      successCount++;
      results.push({ slug, title, category: determineCategory(post.caption) });
      
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${successCount} posts`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🖼️ Images directory: ${IMAGES_DIR}`);
  
  // Category breakdown
  const categoryCount = results.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📂 Category breakdown:');
  for (const [cat, count] of Object.entries(categoryCount)) {
    console.log(`   ${cat}: ${count}`);
  }
  
  console.log('\n✨ Import complete! Open /keystatic to manage your content.');
}

// Run the import
importPosts().catch(console.error);
