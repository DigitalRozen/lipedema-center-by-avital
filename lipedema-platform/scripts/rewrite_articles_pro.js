#!/usr/bin/env node
/**
 * Article Rewrite Planner - Mass SEO Content Strategy Generator
 * 
 * This script scans all MDX articles and generates a comprehensive JSON plan
 * for rewriting them into high-quality, 600+ word SEO-optimized content.
 * 
 * Output: content_plan.json - A detailed plan for each article including:
 * - Viral Hebrew titles
 * - SEO keywords
 * - AI image prompts
 * - Content structure outlines
 * - Internal linking map
 * 
 * Usage: node scripts/rewrite_articles_pro.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  contentDirs: [
    path.join(__dirname, '../content/posts'),
    path.join(__dirname, '../src/content/articles')
  ],
  outputFile: path.join(__dirname, '../content_plan.json'),
  minContentLength: 600, // Target word count
};

// Hebrew clickbait title templates by category
const TITLE_TEMPLATES = {
  diagnosis: [
    'הסוד שרופאים לא מספרים לך על {topic}',
    '{topic}: 5 סימנים שאת חייבת להכיר',
    'למה {topic} משנה את כל מה שידעת על הגוף שלך',
    'האמת המפתיעה על {topic} שתשנה את חייך',
    '{topic} - המדריך המלא שכל אישה חייבת לקרוא',
    'גילוי חדש: מה באמת גורם ל{topic}',
    '7 דברים שלא ידעת על {topic}',
  ],
  nutrition: [
    'המזון הזה ישנה את {topic} שלך לנצח',
    '{topic}: המתכון הסודי שעובד',
    'למה {topic} הוא המפתח לבריאות שלך',
    'הטעות הגדולה שכולן עושות עם {topic}',
    '{topic} - איך לאכול נכון בלי לוותר על טעם',
    '5 מזונות על שישנו את {topic} שלך',
    'המדריך המלא ל{topic} בריא',
  ],
  physical: [
    'הטיפול הטבעי ב{topic} שרופאים לא מכירים',
    '{topic}: השיטה שעובדת תוך שבועיים',
    'איך להקל על {topic} בלי תרופות',
    'הסוד לטיפול ב{topic} שעובד באמת',
    '{topic} - 3 תרגילים שישנו הכל',
    'המדריך המלא לטיפול טבעי ב{topic}',
  ],
  mindset: [
    'איך {topic} שינה את החיים שלי',
    'הסוד הנפשי מאחורי {topic}',
    '{topic}: המסע שלי לריפוי',
    'למה {topic} מתחיל בראש',
    'השינוי התודעתי שיעזור לך עם {topic}',
    '5 טיפים מנטליים להתמודדות עם {topic}',
  ],
};

// SEO keyword mapping by topic
const KEYWORD_MAP = {
  'ליפאדמה': ['ליפאדמה', 'lipedema', 'שומן ברגליים', 'נפיחות ברגליים', 'מחלת שומן'],
  'לימפדמה': ['לימפאדמה', 'lymphedema', 'בצקת לימפטית', 'נפיחות לימפטית'],
  'תזונה': ['דיאטה', 'אוכל בריא', 'תפריט', 'מזון', 'ארוחות'],
  'דלקת': ['דלקתיות', 'אנטי דלקתי', 'inflammation', 'הפחתת דלקת'],
  'לימפה': ['מערכת לימפטית', 'ניקוז לימפטי', 'lymphatic'],
  'PCOS': ['שחלות פוליציסטיות', 'תסמונת השחלות', 'הורמונים'],
  'אוקסלטים': ['חומצה אוקסלית', 'oxalates', 'אבני כליות'],
  'מגנזיום': ['מינרלים', 'תוספי תזונה', 'חסר מגנזיום'],
  'עיכול': ['מערכת עיכול', 'בריאות המעי', 'פרוביוטיקה'],
  'הורמונים': ['איזון הורמונלי', 'בריאות הורמונלית', 'מחזור'],
};

// Image prompt templates by category
const IMAGE_PROMPTS = {
  diagnosis: 'Professional medical photography, soft natural lighting, woman in comfortable spa setting receiving lymphatic assessment, warm earth tones, clean modern clinic aesthetic, empathetic healthcare environment, high-end wellness photography style',
  nutrition: 'Elegant food photography, Mediterranean diet ingredients, fresh vegetables and healthy fats, soft diffused lighting, rustic wooden table, Hebrew text overlay space, warm inviting colors, professional culinary photography',
  physical: 'Wellness spa photography, woman receiving gentle lymphatic massage, soft ambient lighting, calming blue and green tones, professional treatment room, therapeutic environment, high-end spa aesthetic',
  mindset: 'Serene portrait photography, woman in peaceful meditation pose, soft golden hour lighting, natural outdoor setting, empowering feminine energy, warm earth tones, inspirational wellness imagery',
};

// H2 structure templates by category
const STRUCTURE_TEMPLATES = {
  diagnosis: [
    'מה זה {topic} ולמה זה קורה?',
    'הסימנים והתסמינים שחשוב להכיר',
    'איך מאבחנים {topic}?',
    'אפשרויות הטיפול הטבעיות',
    'מה את יכולה לעשות היום',
  ],
  nutrition: [
    'למה {topic} חשוב לבריאות שלך?',
    'הערכים התזונתיים שחשוב להכיר',
    'איך לשלב {topic} בתפריט היומי',
    'מתכונים פשוטים להתחלה',
    'טיפים מעשיים ליישום',
  ],
  physical: [
    'מה גורם ל{topic}?',
    'הטיפולים הטבעיים שעובדים',
    'תרגילים ביתיים להקלה',
    'מתי לפנות לטיפול מקצועי',
    'שגרת טיפול יומית מומלצת',
  ],
  mindset: [
    'ההשפעה הנפשית של {topic}',
    'איך לשנות את הגישה',
    'טכניקות להתמודדות יומיומית',
    'בניית קהילה תומכת',
    'הצעדים הבאים במסע שלך',
  ],
};

/**
 * Parse MDX frontmatter and content
 */
function parseMdxFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = {};
    const frontmatterLines = frontmatterMatch[1].split('\n');
    
    for (const line of frontmatterLines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        frontmatter[key] = value;
      }
    }

    // Extract tags array
    const tagsMatch = frontmatterMatch[1].match(/tags:\s*\n((?:\s+-\s+"[^"]+"\n?)+)/);
    if (tagsMatch) {
      frontmatter.tags = tagsMatch[1]
        .split('\n')
        .filter(line => line.includes('-'))
        .map(line => line.replace(/\s*-\s*"([^"]+)"/, '$1').trim())
        .filter(Boolean);
    }

    return {
      frontmatter,
      body: frontmatterMatch[2].trim(),
      filePath,
      slug: path.basename(filePath, '.mdx'),
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract main topic from title and content
 */
function extractMainTopic(article) {
  const title = article.frontmatter.title || '';
  const body = article.body || '';
  const combined = `${title} ${body}`.toLowerCase();

  // Priority topics
  const topics = [
    { keyword: 'ליפאדמה', topic: 'ליפאדמה' },
    { keyword: 'ליפאדמה', topic: 'ליפאדמה' },
    { keyword: 'לימפדמה', topic: 'לימפדמה' },
    { keyword: 'לימפאדמה', topic: 'לימפדמה' },
    { keyword: 'pcos', topic: 'PCOS' },
    { keyword: 'שחלות', topic: 'PCOS' },
    { keyword: 'אוקסלט', topic: 'אוקסלטים' },
    { keyword: 'דלקת', topic: 'דלקת' },
    { keyword: 'לימפה', topic: 'לימפה' },
    { keyword: 'מגנזיום', topic: 'מגנזיום' },
    { keyword: 'עיכול', topic: 'עיכול' },
    { keyword: 'הורמון', topic: 'הורמונים' },
    { keyword: 'תזונה', topic: 'תזונה' },
    { keyword: 'מתכון', topic: 'תזונה' },
    { keyword: 'אוכל', topic: 'תזונה' },
  ];

  for (const { keyword, topic } of topics) {
    if (combined.includes(keyword)) {
      return topic;
    }
  }

  // Default based on category
  const category = article.frontmatter.category || 'nutrition';
  const categoryDefaults = {
    diagnosis: 'ליפאדמה',
    nutrition: 'תזונה בריאה',
    physical: 'טיפול טבעי',
    mindset: 'בריאות נפשית',
  };

  return categoryDefaults[category] || 'בריאות';
}

/**
 * Generate viral clickbait title
 */
function generateViralTitle(article, topic) {
  const category = article.frontmatter.category || 'nutrition';
  const templates = TITLE_TEMPLATES[category] || TITLE_TEMPLATES.nutrition;
  
  // Select template based on content hash for consistency
  const hash = article.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const template = templates[hash % templates.length];
  
  return template.replace(/{topic}/g, topic);
}

/**
 * Generate SEO keyword
 */
function generateSeoKeyword(topic) {
  const keywords = KEYWORD_MAP[topic];
  if (keywords && keywords.length > 0) {
    return keywords[0];
  }
  return topic;
}

/**
 * Generate AI image prompt
 */
function generateImagePrompt(article, topic) {
  const category = article.frontmatter.category || 'nutrition';
  const basePrompt = IMAGE_PROMPTS[category] || IMAGE_PROMPTS.nutrition;
  
  return `${basePrompt}, topic: ${topic}, Hebrew wellness content, professional stock photography quality, 16:9 aspect ratio`;
}

/**
 * Generate content structure outline
 */
function generateStructureOutline(article, topic) {
  const category = article.frontmatter.category || 'nutrition';
  const templates = STRUCTURE_TEMPLATES[category] || STRUCTURE_TEMPLATES.nutrition;
  
  return templates.map(template => template.replace(/{topic}/g, topic));
}

/**
 * Build internal linking map
 */
function buildInternalLinkingMap(articles) {
  const linkingMap = {};
  
  // Extract keywords from each article
  const articleKeywords = articles.map(article => {
    const topic = extractMainTopic(article);
    const title = article.frontmatter.title || '';
    const tags = article.frontmatter.tags || [];
    
    return {
      slug: article.slug,
      topic,
      title,
      keywords: [topic, ...tags].filter(Boolean),
    };
  });

  // Build linking suggestions
  for (const article of articleKeywords) {
    const relatedArticles = articleKeywords
      .filter(other => other.slug !== article.slug)
      .map(other => {
        // Calculate relevance score
        const sharedKeywords = article.keywords.filter(kw => 
          other.keywords.some(otherKw => 
            kw.toLowerCase().includes(otherKw.toLowerCase()) ||
            otherKw.toLowerCase().includes(kw.toLowerCase())
          )
        );
        
        return {
          slug: other.slug,
          title: other.title,
          relevanceScore: sharedKeywords.length,
          sharedKeywords,
        };
      })
      .filter(related => related.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5); // Top 5 related articles

    linkingMap[article.slug] = relatedArticles;
  }

  return linkingMap;
}

/**
 * Calculate content quality score
 */
function calculateQualityScore(article) {
  const body = article.body || '';
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const hasHashtags = body.includes('#');
  const hasStructure = body.includes('##') || body.includes('1.');
  
  let score = 0;
  
  // Word count scoring
  if (wordCount < 50) score += 10;
  else if (wordCount < 100) score += 30;
  else if (wordCount < 200) score += 50;
  else if (wordCount < 400) score += 70;
  else score += 90;
  
  // Penalize hashtag-heavy content
  if (hasHashtags) score -= 10;
  
  // Bonus for existing structure
  if (hasStructure) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning MDX files...\n');
  
  const allArticles = [];
  
  // Scan all content directories
  for (const dir of CONFIG.contentDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    console.log(`📁 Found ${files.length} files in ${path.basename(dir)}`);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const article = parseMdxFile(filePath);
      
      if (article) {
        allArticles.push(article);
      }
    }
  }
  
  console.log(`\n📊 Total articles found: ${allArticles.length}\n`);
  
  // Generate content plan for each article
  const contentPlan = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalArticles: allArticles.length,
      targetWordCount: CONFIG.minContentLength,
    },
    articles: [],
    internalLinkingMap: {},
    statistics: {
      byCategory: {},
      byQualityScore: {
        needsFullRewrite: 0,
        needsExpansion: 0,
        minorUpdates: 0,
      },
    },
  };
  
  // Process each article
  for (const article of allArticles) {
    const topic = extractMainTopic(article);
    const category = article.frontmatter.category || 'nutrition';
    const qualityScore = calculateQualityScore(article);
    
    const articlePlan = {
      original_slug: article.slug,
      original_title: article.frontmatter.title || 'ללא כותרת',
      original_category: category,
      original_word_count: article.body.split(/\s+/).filter(Boolean).length,
      quality_score: qualityScore,
      rewrite_priority: qualityScore < 30 ? 'HIGH' : qualityScore < 60 ? 'MEDIUM' : 'LOW',
      
      // New content plan
      new_title: generateViralTitle(article, topic),
      seo_keyword: generateSeoKeyword(topic),
      secondary_keywords: KEYWORD_MAP[topic] || [topic],
      main_topic: topic,
      
      // Image generation
      image_prompt: generateImagePrompt(article, topic),
      
      // Content structure
      structure_outline: generateStructureOutline(article, topic),
      
      // Meta
      meta_description_template: `${topic} - המדריך המלא מאת אביטל רוזן, מומחית לליפאדמה. טיפים מעשיים, מידע מקצועי ותמיכה אישית.`,
      
      // Original content for reference
      original_content_preview: article.body.substring(0, 200) + '...',
      original_tags: article.frontmatter.tags || [],
      original_image: article.frontmatter.image || '',
    };
    
    contentPlan.articles.push(articlePlan);
    
    // Update statistics
    contentPlan.statistics.byCategory[category] = 
      (contentPlan.statistics.byCategory[category] || 0) + 1;
    
    if (qualityScore < 30) {
      contentPlan.statistics.byQualityScore.needsFullRewrite++;
    } else if (qualityScore < 60) {
      contentPlan.statistics.byQualityScore.needsExpansion++;
    } else {
      contentPlan.statistics.byQualityScore.minorUpdates++;
    }
  }
  
  // Build internal linking map
  contentPlan.internalLinkingMap = buildInternalLinkingMap(allArticles);
  
  // Sort articles by rewrite priority
  contentPlan.articles.sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return priorityOrder[a.rewrite_priority] - priorityOrder[b.rewrite_priority];
  });
  
  // Write output
  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(contentPlan, null, 2),
    'utf-8'
  );
  
  console.log('✅ Content plan generated successfully!\n');
  console.log('📊 Statistics:');
  console.log(`   Total articles: ${contentPlan.metadata.totalArticles}`);
  console.log(`   Need full rewrite: ${contentPlan.statistics.byQualityScore.needsFullRewrite}`);
  console.log(`   Need expansion: ${contentPlan.statistics.byQualityScore.needsExpansion}`);
  console.log(`   Minor updates: ${contentPlan.statistics.byQualityScore.minorUpdates}`);
  console.log('\n📁 Categories:');
  for (const [cat, count] of Object.entries(contentPlan.statistics.byCategory)) {
    console.log(`   ${cat}: ${count}`);
  }
  console.log(`\n📄 Output saved to: ${CONFIG.outputFile}`);
  console.log('\n🚀 Next steps:');
  console.log('   1. Review the content_plan.json file');
  console.log('   2. Feed articles to Kiro for 600+ word content generation');
  console.log('   3. Use image_prompt for AI image generation');
  console.log('   4. Apply internal linking from the linking map');
}

main().catch(console.error);

