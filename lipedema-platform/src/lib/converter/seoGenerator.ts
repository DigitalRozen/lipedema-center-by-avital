/**
 * SEO Generator Module
 * 
 * Generates SEO metadata for articles: titles, slugs, meta descriptions, and tags.
 * Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.6
 */

import type { TopicType, ArticleTag, SEOMetadata, CategorySlug } from './types';
import { TOPIC_TO_CATEGORY } from './topicMapper';

/**
 * Valid article tags (predefined list)
 * Validates: Requirements 2.5
 */
export const VALID_TAGS: ArticleTag[] = [
  'תזונה',
  'טיפול שמרני',
  'ניתוחים',
  'סיפורי הצלחה',
  'אבחון',
  'תוספי תזונה',
];

/**
 * SEO keywords that should appear in content
 * Validates: Requirements 5.4
 */
export const SEO_KEYWORDS = [
  'טיפול בליפאדמה',
  'תזונה לליפאדמה',
  'הצרת היקפים',
  'ניקוז לימפתי',
];

/**
 * Required keyword for meta descriptions
 */
export const META_DESCRIPTION_KEYWORD = 'טיפול בליפאדמה';

/**
 * Maximum length for meta descriptions
 */
export const META_DESCRIPTION_MAX_LENGTH = 155;

/**
 * Topic to English slug mapping for URL generation
 */
const TOPIC_SLUG_MAP: Record<TopicType, string> = {
  'Treatment': 'treatment',
  'Anti-Inflammatory': 'anti-inflammatory',
  'Lymphedema': 'lymphedema',
  'Nutrition': 'nutrition',
  'Diagnosis': 'diagnosis',
  'General Lipedema': 'lipedema',
};

/**
 * Tag mapping based on topic and category
 */
const TOPIC_TAG_MAP: Record<TopicType, ArticleTag[]> = {
  'Treatment': ['טיפול שמרני'],
  'Anti-Inflammatory': ['תזונה', 'תוספי תזונה'],
  'Lymphedema': ['אבחון', 'טיפול שמרני'],
  'Nutrition': ['תזונה'],
  'Diagnosis': ['אבחון'],
  'General Lipedema': ['טיפול שמרני'],
};


/**
 * Hebrew to English transliteration map for slug generation
 */
const HEBREW_TO_ENGLISH: Record<string, string> = {
  'ליפאדמה': 'lipedema',
  'ליפאדמה': 'lipedema',
  'לימפאדמה': 'lymphedema',
  'לימפדמה': 'lymphedema',
  'תזונה': 'nutrition',
  'טיפול': 'treatment',
  'אבחון': 'diagnosis',
  'דלקת': 'inflammation',
  'לימפה': 'lymph',
  'בצקת': 'edema',
  'ניקוז': 'drainage',
  'מסאז': 'massage',
  'דיאטה': 'diet',
  'ירקות': 'vegetables',
  'פירות': 'fruits',
  'חלבון': 'protein',
  'שומן': 'fat',
  'מים': 'water',
  'ספורט': 'sport',
  'תרגיל': 'exercise',
  'הליכה': 'walking',
  'שחייה': 'swimming',
};

/**
 * Extract keywords from Hebrew content for slug generation
 * 
 * @param content - Hebrew content to extract keywords from
 * @returns Array of English keywords
 */
function extractKeywordsForSlug(content: string): string[] {
  const keywords: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Find Hebrew words that have English translations
  for (const [hebrew, english] of Object.entries(HEBREW_TO_ENGLISH)) {
    if (content.includes(hebrew)) {
      keywords.push(english);
    }
  }
  
  // Also check for English words already in content
  const englishWords = lowerContent.match(/[a-z]{3,}/g) || [];
  keywords.push(...englishWords.slice(0, 2));
  
  return [...new Set(keywords)].slice(0, 3);
}

/**
 * Generate a unique identifier from post ID
 * 
 * @param postId - Original Instagram post ID
 * @returns Short unique identifier
 */
function generateUniqueId(postId: string): string {
  // Take last 6 characters of the post ID
  return postId.slice(-6);
}

/**
 * Generate an English slug in kebab-case format
 * 
 * @param topic - The topic of the post
 * @param content - The raw caption content
 * @param postId - The original post ID for uniqueness
 * @returns Kebab-case English slug
 * 
 * Validates: Requirements 2.3
 */
export function generateSlug(topic: TopicType, content: string, postId: string): string {
  const topicSlug = TOPIC_SLUG_MAP[topic];
  const contentKeywords = extractKeywordsForSlug(content);
  const uniqueId = generateUniqueId(postId);
  
  // Build slug parts
  const parts = [topicSlug];
  
  if (contentKeywords.length > 0) {
    parts.push(...contentKeywords.slice(0, 2));
  }
  
  parts.push(uniqueId);
  
  // Join with hyphens and ensure valid kebab-case
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}


/**
 * Extract a summary from content for meta description
 * 
 * @param content - The content to summarize
 * @param maxLength - Maximum length of the summary
 * @returns Summarized content
 */
function extractSummary(content: string, maxLength: number): string {
  // Remove hashtags
  const withoutHashtags = content.replace(/#[\w\u0590-\u05FF]+/g, '').trim();
  
  // Remove multiple spaces and newlines
  const cleaned = withoutHashtags.replace(/\s+/g, ' ').trim();
  
  // If content is short enough, return as is
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Find a good break point (end of sentence or word)
  let summary = cleaned.substring(0, maxLength);
  
  // Try to break at sentence end
  const lastPeriod = summary.lastIndexOf('.');
  const lastQuestion = summary.lastIndexOf('?');
  const lastExclaim = summary.lastIndexOf('!');
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return summary.substring(0, lastSentenceEnd + 1);
  }
  
  // Otherwise break at last space
  const lastSpace = summary.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    return summary.substring(0, lastSpace) + '...';
  }
  
  return summary + '...';
}

/**
 * Generate a meta description with SEO keyword
 * 
 * @param content - The content to create description from
 * @returns Meta description (max 155 chars) containing "טיפול בליפאדמה"
 * 
 * Validates: Requirements 2.4
 */
export function generateMetaDescription(content: string): string {
  const keywordSuffix = ` | ${META_DESCRIPTION_KEYWORD}`;
  const maxSummaryLength = META_DESCRIPTION_MAX_LENGTH - keywordSuffix.length;
  
  // Check if content already contains the keyword
  if (content.includes(META_DESCRIPTION_KEYWORD)) {
    const summary = extractSummary(content, META_DESCRIPTION_MAX_LENGTH);
    if (summary.length <= META_DESCRIPTION_MAX_LENGTH) {
      return summary;
    }
  }
  
  // Extract summary and append keyword
  const summary = extractSummary(content, maxSummaryLength);
  const description = `${summary}${keywordSuffix}`;
  
  // Ensure we don't exceed max length
  if (description.length > META_DESCRIPTION_MAX_LENGTH) {
    const truncatedSummary = extractSummary(content, maxSummaryLength - 3);
    return `${truncatedSummary}${keywordSuffix}`;
  }
  
  return description;
}


/**
 * Content keywords that map to specific tags
 */
const CONTENT_TAG_KEYWORDS: Record<string, ArticleTag[]> = {
  // Nutrition keywords
  'תזונה': ['תזונה'],
  'אוכל': ['תזונה'],
  'דיאטה': ['תזונה'],
  'מזון': ['תזונה'],
  'ירקות': ['תזונה'],
  'פירות': ['תזונה'],
  'חלבון': ['תזונה'],
  'שומן': ['תזונה'],
  'קלוריות': ['תזונה'],
  
  // Supplements keywords
  'תוסף': ['תוספי תזונה'],
  'ויטמין': ['תוספי תזונה'],
  'מינרל': ['תוספי תזונה'],
  'אומגה': ['תוספי תזונה'],
  'פרוביוטיקה': ['תוספי תזונה'],
  
  // Conservative treatment keywords
  'מסאז': ['טיפול שמרני'],
  'ניקוז': ['טיפול שמרני'],
  'לימפתי': ['טיפול שמרני'],
  'גרביים': ['טיפול שמרני'],
  'לחץ': ['טיפול שמרני'],
  'תרגיל': ['טיפול שמרני'],
  'פעילות': ['טיפול שמרני'],
  
  // Surgery keywords
  'ניתוח': ['ניתוחים'],
  'שאיבה': ['ניתוחים'],
  'ליפוסקשן': ['ניתוחים'],
  'כירורגי': ['ניתוחים'],
  
  // Diagnosis keywords
  'אבחון': ['אבחון'],
  'סימפטום': ['אבחון'],
  'תסמין': ['אבחון'],
  'בדיקה': ['אבחון'],
  'רופא': ['אבחון'],
  
  // Success stories keywords
  'הצלחה': ['סיפורי הצלחה'],
  'שינוי': ['סיפורי הצלחה'],
  'מסע': ['סיפורי הצלחה'],
  'התקדמות': ['סיפורי הצלחה'],
};

/**
 * Select relevant tags based on content analysis
 * 
 * @param content - The content to analyze
 * @param topic - The topic of the post
 * @returns Array of 1-3 relevant tags
 * 
 * Validates: Requirements 2.5, 2.6
 */
export function selectTags(content: string, topic: TopicType): ArticleTag[] {
  const tagScores = new Map<ArticleTag, number>();
  
  // Initialize with topic-based tags
  const topicTags = TOPIC_TAG_MAP[topic] || [];
  for (const tag of topicTags) {
    tagScores.set(tag, (tagScores.get(tag) || 0) + 2);
  }
  
  // Analyze content for additional tags
  const lowerContent = content.toLowerCase();
  for (const [keyword, tags] of Object.entries(CONTENT_TAG_KEYWORDS)) {
    if (lowerContent.includes(keyword)) {
      for (const tag of tags) {
        tagScores.set(tag, (tagScores.get(tag) || 0) + 1);
      }
    }
  }
  
  // Sort by score and select top 1-3 tags
  const sortedTags = [...tagScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
  
  // Ensure we have at least 1 tag
  if (sortedTags.length === 0) {
    // Default to topic-based tag
    return topicTags.length > 0 ? [topicTags[0]] : ['טיפול שמרני'];
  }
  
  // Return 1-3 tags
  return sortedTags.slice(0, Math.min(3, sortedTags.length));
}

/**
 * Check if a tag is valid
 * 
 * @param tag - Tag to validate
 * @returns true if tag is in the valid tags list
 */
export function isValidTag(tag: string): tag is ArticleTag {
  return VALID_TAGS.includes(tag as ArticleTag);
}


/**
 * Title templates based on topic
 */
const TITLE_TEMPLATES: Record<TopicType, string[]> = {
  'Treatment': [
    'המדריך המלא לטיפול בליפאדמה',
    'איך לטפל בליפאדמה בצורה יעילה',
    'טיפולים מומלצים לליפאדמה',
  ],
  'Anti-Inflammatory': [
    'תזונה נוגדת דלקת לליפאדמה',
    'איך להפחית דלקתיות בגוף',
    'מזונות שעוזרים נגד דלקת',
  ],
  'Lymphedema': [
    'כל מה שצריך לדעת על לימפאדמה',
    'הבנת מערכת הלימפה והקשר לליפאדמה',
    'לימפאדמה וליפאדמה - מה ההבדל',
  ],
  'Nutrition': [
    'תזונה נכונה לליפאדמה',
    'מה לאכול כשיש ליפאדמה',
    'המדריך התזונתי לליפאדמה',
  ],
  'Diagnosis': [
    'איך מאבחנים ליפאדמה',
    'סימנים לזיהוי ליפאדמה',
    'האם יש לי ליפאדמה? מדריך לאבחון',
  ],
  'General Lipedema': [
    'מה זה ליפאדמה ואיך מתמודדים',
    'ליפאדמה - המדריך המלא',
    'כל מה שצריך לדעת על ליפאדמה',
  ],
};

/**
 * Generate a catchy Hebrew title that differs from the original caption
 * 
 * @param caption - The original caption (to ensure title is different)
 * @param topic - The topic of the post
 * @param postId - Post ID for deterministic selection
 * @returns A catchy Hebrew title
 * 
 * Validates: Requirements 2.1, 2.2
 */
export function generateTitle(caption: string, topic: TopicType, postId: string): string {
  const templates = TITLE_TEMPLATES[topic];
  
  // Use post ID to deterministically select a template
  const idSum = postId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const templateIndex = idSum % templates.length;
  
  let title = templates[templateIndex];
  
  // Ensure title is different from caption
  const cleanCaption = caption.replace(/#[\w\u0590-\u05FF]+/g, '').trim().toLowerCase();
  if (title.toLowerCase() === cleanCaption) {
    // Use next template
    title = templates[(templateIndex + 1) % templates.length];
  }
  
  return title;
}

/**
 * Generate complete SEO metadata for an article
 * 
 * @param post - The Instagram post data
 * @returns Complete SEO metadata
 * 
 * Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.6
 */
export function generateSEOMetadata(
  caption: string,
  topic: TopicType,
  postId: string
): SEOMetadata {
  return {
    title: generateTitle(caption, topic, postId),
    slug: generateSlug(topic, caption, postId),
    metaDescription: generateMetaDescription(caption),
    tags: selectTags(caption, topic),
  };
}

