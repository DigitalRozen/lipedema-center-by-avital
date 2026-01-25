#!/usr/bin/env node
/**
 * CLI Script: Instagram to SEO Articles Converter
 * 
 * Converts Instagram posts from a JSON file to SEO-optimized articles in Markdown format.
 * 
 * Usage:
 *   node scripts/convert-instagram-to-seo.js <input.json> [output.md]
 * 
 * Arguments:
 *   input.json  - Path to JSON file containing Instagram posts
 *   output.md   - (Optional) Path for output Markdown file (default: seo_articles.md)
 * 
 * Example:
 *   node scripts/convert-instagram-to-seo.js ../relevant_posts.json ./seo_articles.md
 * 
 * Validates: Requirements 7.1, 7.5
 */

const fs = require('fs');
const path = require('path');

// Import converter modules (we'll need to compile these first or use dynamic import)
// For now, we'll implement the conversion logic inline since the modules are TypeScript

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Prints a colored message to console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Prints usage information
 */
function printUsage() {
  log('\n📝 Instagram to SEO Articles Converter', colors.bright);
  log('=====================================\n');
  log('Usage:', colors.cyan);
  log('  node scripts/convert-instagram-to-seo.js <input.json> [output.md]\n');
  log('Arguments:', colors.cyan);
  log('  input.json  - Path to JSON file containing Instagram posts');
  log('  output.md   - (Optional) Output Markdown file (default: seo_articles.md)\n');
  log('Example:', colors.cyan);
  log('  node scripts/convert-instagram-to-seo.js ../relevant_posts.json ./seo_articles.md\n');
}

// ============================================
// Converter Logic (inline implementation)
// ============================================

const TOPIC_TO_CATEGORY = {
  'Treatment': 'physical',
  'Anti-Inflammatory': 'nutrition',
  'Nutrition': 'nutrition',
  'Lymphedema': 'diagnosis',
  'Diagnosis': 'diagnosis',
  'General Lipedema': 'mindset',
};

const CATEGORY_DISPLAY = {
  'diagnosis': 'אבחון וזיהוי',
  'nutrition': 'תזונה ונוטריציה',
  'physical': 'טיפול פיזי ושיקום',
  'mindset': 'מיינדסט ורגש',
};

const VALID_TAGS = [
  'תזונה',
  'טיפול שמרני',
  'ניתוחים',
  'סיפורי הצלחה',
  'אבחון',
  'תוספי תזונה',
];

const SEO_KEYWORDS = [
  'טיפול בליפאדמה',
  'תזונה לליפאדמה',
  'הצרת היקפים',
  'ניקוז לימפתי',
];

const MEDICAL_VOCABULARY = [
  'לימפה',
  'בצקת',
  'רקמה פיברוטית',
  'דלקתיות',
  'נוגדי חמצון',
  'מערכת הלימפה',
];

const CTA_PHRASES = [
  'לפרטים נוספים',
  'צרי קשר',
  'להתייעצות',
  'לקביעת תור',
  'למידע נוסף',
];

const CONSULTATION_PHRASES = [
  'מומלץ להתייעץ עם איש מקצוע',
  'כדאי לפנות לרופא',
  'התייעצי עם מומחה',
];

/**
 * Check if caption contains only hashtags
 */
function isHashtagOnly(caption) {
  const withoutHashtags = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
  return withoutHashtags.length === 0;
}

/**
 * Validate a single post
 */
function validatePost(post) {
  if (!post.raw_caption || post.raw_caption.trim() === '') {
    return { valid: false, reason: 'כיתוב ריק' };
  }
  
  if (isHashtagOnly(post.raw_caption)) {
    return { valid: false, reason: 'פוסט מכיל רק האשטגים' };
  }
  
  return { valid: true };
}

/**
 * Map topic to category
 */
function mapTopicToCategory(topic) {
  const slug = TOPIC_TO_CATEGORY[topic] || 'mindset';
  return {
    slug,
    display: CATEGORY_DISPLAY[slug],
  };
}

/**
 * Generate slug from topic and content
 */
function generateSlug(topic, content, postId) {
  const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
  return `${topicSlug}-${postId}`;
}

/**
 * Generate meta description
 */
function generateMetaDescription(content) {
  // Clean content and extract first meaningful sentence
  const cleaned = content
    .replace(/#[\w\u0590-\u05FF]+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  const maxLength = 155 - ' | טיפול בליפאדמה'.length;
  let base = cleaned.substring(0, maxLength);
  
  // Try to end at a word boundary
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
  // Extract first line or create from topic
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 10 && firstLine.length < 100) {
      return firstLine;
    }
  }
  
  // Generate from topic
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
  
  // Map topic to primary tag
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
  
  // Check content for additional tags
  if (contentLower.includes('תזונה') || contentLower.includes('אוכל') || contentLower.includes('מזון')) {
    if (!tags.includes('תזונה')) tags.push('תזונה');
  }
  
  if (contentLower.includes('תוסף') || contentLower.includes('ויטמין')) {
    tags.push('תוספי תזונה');
  }
  
  if (contentLower.includes('ניתוח') || contentLower.includes('כירורג')) {
    tags.push('ניתוחים');
  }
  
  // Limit to 3 tags
  return tags.slice(0, 3);
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
 * Expand content with structure
 */
function expandContent(rawCaption, topic) {
  const cleaned = cleanCaption(rawCaption);
  const isShort = cleaned.length < 200;
  
  // Create introduction
  const introduction = isShort
    ? `${cleaned}\n\nבמאמר זה נרחיב על הנושא ונספק מידע מקיף.`
    : cleaned.split('\n\n')[0] || cleaned.substring(0, 200);
  
  // Create sections
  const sections = [];
  
  if (isShort) {
    // Expand short content with domain knowledge
    sections.push({
      heading: 'מה חשוב לדעת',
      content: `${cleaned}\n\nטיפול בליפאדמה דורש גישה הוליסטית המשלבת תזונה נכונה, פעילות גופנית מותאמת וטיפולים ממוקדים.`,
    });
    
    sections.push({
      heading: 'המלצות מעשיות',
      content: 'מומלץ להתייעץ עם איש מקצוע המתמחה בליפאדמה כדי לבנות תוכנית טיפול אישית. ניקוז לימפתי, תזונה אנטי-דלקתית ופעילות גופנית עדינה יכולים לסייע משמעותית.',
    });
  } else {
    // Restructure detailed content
    const paragraphs = cleaned.split('\n\n').filter(p => p.trim());
    
    paragraphs.forEach((para, index) => {
      if (index === 0) return; // Skip first paragraph (used as intro)
      
      sections.push({
        heading: `חלק ${index}`,
        content: para,
      });
    });
    
    // Ensure at least one section
    if (sections.length === 0) {
      sections.push({
        heading: 'מידע נוסף',
        content: cleaned,
      });
    }
  }
  
  // Create conclusion with CTA
  const conclusion = `לסיכום, חשוב לזכור שליפאדמה היא מצב שניתן לנהל בהצלחה עם הגישה הנכונה. ${CTA_PHRASES[0]} על טיפולים והתאמות אישיות, צרי קשר.`;
  
  return { introduction, sections, conclusion };
}

/**
 * Generate Q&A section
 */
function generateQASection(userQuestions) {
  if (!userQuestions || userQuestions.length === 0) {
    return null;
  }
  
  const questions = userQuestions.map(q => ({
    question: q,
    answer: generateAnswer(q),
  }));
  
  return { questions };
}

/**
 * Generate answer for a question
 */
function generateAnswer(question) {
  const questionLower = question.toLowerCase();
  
  // Check for doctor recommendation questions
  if (questionLower.includes('רופא') || questionLower.includes('מומחה') || questionLower.includes('המלצה')) {
    return `שאלה מצוינת! ${CONSULTATION_PHRASES[0]} המתמחה בליפאדמה. ניתן לפנות לקופת החולים לקבלת הפניה למומחה בתחום. חשוב לבחור מטפל עם ניסיון ספציפי בליפאדמה.`;
  }
  
  // Check for diagnosis questions
  if (questionLower.includes('אבחון') || questionLower.includes('לאבחן') || questionLower.includes('לזהות')) {
    return `אבחון ליפאדמה נעשה על ידי רופא מומחה, בדרך כלל רופא עור או כירורג כלי דם. האבחון מבוסס על בדיקה פיזית, היסטוריה רפואית ולעיתים בדיקות הדמיה. ${CONSULTATION_PHRASES[1]} לאבחון מדויק.`;
  }
  
  // Check for treatment questions
  if (questionLower.includes('טיפול') || questionLower.includes('לטפל') || questionLower.includes('עוזר')) {
    return `הטיפול בליפאדמה משלב מספר גישות: ניקוז לימפתי ידני, לבישת בגדי לחץ, תזונה אנטי-דלקתית ופעילות גופנית מותאמת. ${CONSULTATION_PHRASES[2]} לבניית תוכנית טיפול אישית.`;
  }
  
  // Default answer
  return `תודה על השאלה! זו נקודה חשובה. ${CONSULTATION_PHRASES[0]} לקבלת מענה מותאם אישית למצבך. אשמח לעזור עם מידע נוסף.`;
}

/**
 * Format frontmatter as YAML
 */
function formatFrontmatter(frontmatter) {
  const lines = [];
  
  lines.push(`title: "${frontmatter.title.replace(/"/g, '\\"')}"`);
  lines.push(`slug: "${frontmatter.slug}"`);
  lines.push(`meta_description: "${frontmatter.meta_description.replace(/"/g, '\\"')}"`);
  lines.push(`tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`);
  lines.push(`category: "${frontmatter.category}"`);
  lines.push(`original_post_id: "${frontmatter.original_post_id}"`);
  lines.push(`image_url: "${frontmatter.image_url}"`);
  
  return lines.join('\n');
}

/**
 * Build markdown content from expanded content and Q&A
 */
function buildMarkdownContent(expandedContent, qaSection) {
  const lines = [];
  
  // Introduction
  lines.push(expandedContent.introduction);
  lines.push('');
  
  // Sections
  expandedContent.sections.forEach(section => {
    lines.push(`## ${section.heading}`);
    lines.push('');
    lines.push(section.content);
    lines.push('');
  });
  
  // Q&A Section
  if (qaSection && qaSection.questions.length > 0) {
    lines.push('## שאלות ותשובות');
    lines.push('');
    
    qaSection.questions.forEach(qa => {
      lines.push(`**שאלה:** ${qa.question}`);
      lines.push('');
      lines.push(`**תשובה:** ${qa.answer}`);
      lines.push('');
    });
  }
  
  // Conclusion
  lines.push('## סיכום');
  lines.push('');
  lines.push(expandedContent.conclusion);
  
  return lines.join('\n');
}

/**
 * Format a single article
 */
function formatArticle(post, seo, category, expandedContent, qaSection) {
  const frontmatter = {
    title: seo.title,
    slug: seo.slug,
    meta_description: seo.metaDescription,
    tags: seo.tags,
    category: category.slug,
    original_post_id: post.id,
    image_url: post.image_url,
  };
  
  const content = buildMarkdownContent(expandedContent, qaSection);
  
  return { frontmatter, content };
}

/**
 * Format single article as markdown string
 */
function formatSingleArticle(article) {
  const frontmatterYaml = formatFrontmatter(article.frontmatter);
  return `---\n${frontmatterYaml}\n---\n\n${article.content}`;
}

/**
 * Format all articles with separator
 */
function formatOutput(articles) {
  return articles
    .map(article => formatSingleArticle(article))
    .join('\n\n---\n\n');
}

/**
 * Generate statistics
 */
function generateStatistics(totalProcessed, articlesGenerated, postsSkipped) {
  return {
    totalProcessed,
    articlesGenerated,
    postsSkipped,
  };
}

/**
 * Format statistics report
 */
function formatStatisticsReport(statistics) {
  const lines = [
    '=== סטטיסטיקות המרה ===',
    `סה"כ פוסטים שעובדו: ${statistics.totalProcessed}`,
    `מאמרים שנוצרו: ${statistics.articlesGenerated}`,
    `פוסטים שדולגו: ${statistics.postsSkipped}`,
    `אחוז הצלחה: ${statistics.totalProcessed > 0 
      ? Math.round((statistics.articlesGenerated / statistics.totalProcessed) * 100) 
      : 0}%`,
  ];
  
  return lines.join('\n');
}

/**
 * Convert a single post to article
 */
function convertSinglePost(post) {
  try {
    // Validate
    const validation = validatePost(post);
    if (!validation.valid) {
      return null;
    }
    
    // Map category
    const category = mapTopicToCategory(post.topic);
    
    // Generate SEO metadata
    const seo = {
      title: generateTitle(post.raw_caption, post.topic),
      slug: generateSlug(post.topic, post.raw_caption, post.id),
      metaDescription: generateMetaDescription(post.raw_caption),
      tags: selectTags(post.raw_caption, post.topic),
    };
    
    // Expand content
    const expandedContent = expandContent(post.raw_caption, post.topic);
    
    // Generate Q&A
    const qaSection = generateQASection(post.user_questions);
    
    // Format article
    return formatArticle(post, seo, category, expandedContent, qaSection);
  } catch (error) {
    console.error(`Error converting post ${post.id}:`, error);
    return null;
  }
}

/**
 * Convert all posts
 */
function convertPosts(posts) {
  const errors = [];
  const articles = [];
  
  // Validate and convert
  posts.forEach(post => {
    const validation = validatePost(post);
    
    if (!validation.valid) {
      errors.push(`פוסט ${post.id}: ${validation.reason}`);
      return;
    }
    
    const article = convertSinglePost(post);
    if (article) {
      articles.push(article);
    } else {
      errors.push(`פוסט ${post.id}: נכשל בהמרה`);
    }
  });
  
  // Generate output
  const output = formatOutput(articles);
  
  // Generate statistics
  const statistics = generateStatistics(
    posts.length,
    articles.length,
    posts.length - articles.length
  );
  
  return {
    success: articles.length > 0,
    articles,
    output,
    statistics,
    errors,
  };
}

/**
 * Convert from JSON string
 */
function convertFromJSON(jsonContent) {
  try {
    const data = JSON.parse(jsonContent);
    
    // Handle both array and object with posts property
    const posts = Array.isArray(data) ? data : (data.posts || []);
    
    if (!Array.isArray(posts)) {
      return {
        success: false,
        articles: [],
        output: '',
        statistics: generateStatistics(0, 0, 0),
        errors: ['קובץ JSON לא תקין - צפוי מערך של פוסטים'],
      };
    }
    
    return convertPosts(posts);
  } catch (error) {
    return {
      success: false,
      articles: [],
      output: '',
      statistics: generateStatistics(0, 0, 0),
      errors: [`שגיאת פענוח JSON: ${error.message}`],
    };
  }
}

// ============================================
// Main CLI Logic
// ============================================

/**
 * Validates that the input file exists and is readable
 */
function validateInputFile(inputPath) {
  if (!fs.existsSync(inputPath)) {
    log(`\n❌ שגיאה: קובץ הקלט לא נמצא: ${inputPath}`, colors.red);
    return false;
  }
  
  try {
    fs.accessSync(inputPath, fs.constants.R_OK);
    return true;
  } catch {
    log(`\n❌ שגיאה: אין הרשאת קריאה לקובץ: ${inputPath}`, colors.red);
    return false;
  }
}

/**
 * Reads JSON content from file
 */
function readInputFile(inputPath) {
  try {
    return fs.readFileSync(inputPath, 'utf-8');
  } catch (error) {
    log(`\n❌ שגיאה בקריאת הקובץ: ${error}`, colors.red);
    return null;
  }
}

/**
 * Writes output to file
 */
function writeOutputFile(outputPath, content) {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (outputDir && outputDir !== '.' && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, content, 'utf-8');
    return true;
  } catch (error) {
    log(`\n❌ שגיאה בכתיבת הקובץ: ${error}`, colors.red);
    return false;
  }
}

/**
 * Prints conversion results summary
 */
function printResults(result, outputPath) {
  log('\n' + '='.repeat(50), colors.cyan);
  log(formatStatisticsReport(result.statistics), colors.bright);
  log('='.repeat(50), colors.cyan);
  
  if (result.success) {
    log(`\n✅ ההמרה הושלמה בהצלחה!`, colors.green);
    log(`📄 קובץ הפלט: ${outputPath}`, colors.green);
  } else {
    log(`\n⚠️ ההמרה הסתיימה עם שגיאות`, colors.yellow);
  }
  
  // Print errors if any
  if (result.errors.length > 0) {
    log(`\n⚠️ שגיאות (${result.errors.length}):`, colors.yellow);
    result.errors.slice(0, 10).forEach(error => {
      log(`  • ${error}`, colors.yellow);
    });
    if (result.errors.length > 10) {
      log(`  ... ועוד ${result.errors.length - 10} שגיאות נוספות`, colors.yellow);
    }
  }
}

/**
 * Main function - entry point for CLI
 */
function main() {
  const args = process.argv.slice(2);
  
  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }
  
  // Validate arguments
  if (args.length < 1) {
    log('\n❌ שגיאה: חסר קובץ קלט', colors.red);
    printUsage();
    process.exit(1);
  }
  
  const inputPath = args[0];
  const outputPath = args[1] || 'seo_articles.md';
  
  log('\n🚀 מתחיל המרת פוסטים מאינסטגרם למאמרי SEO...', colors.cyan);
  log(`📥 קובץ קלט: ${inputPath}`);
  log(`📤 קובץ פלט: ${outputPath}`);
  
  // Validate input file
  if (!validateInputFile(inputPath)) {
    process.exit(1);
  }
  
  // Read input file
  const jsonContent = readInputFile(inputPath);
  if (!jsonContent) {
    process.exit(1);
  }
  
  log('\n⏳ מעבד פוסטים...', colors.cyan);
  
  // Convert posts
  const result = convertFromJSON(jsonContent);
  
  // Write output
  if (result.output) {
    if (!writeOutputFile(outputPath, result.output)) {
      process.exit(1);
    }
  }
  
  // Print results
  printResults(result, outputPath);
  
  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

// Run main function
main();
