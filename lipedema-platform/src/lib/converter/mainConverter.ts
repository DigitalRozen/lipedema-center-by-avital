/**
 * Main Converter Module
 * 
 * Integrates all converter modules into a single pipeline.
 * Converts Instagram posts to SEO articles.
 * Validates: Requirements 1.4, 7.5
 */

import type {
  InstagramPost,
  FormattedArticle,
  ConversionStatistics,
  ParseResult,
} from './types';
import { parseInstagramPosts } from './jsonParser';
import { validatePost, validatePosts } from './postValidator';
import { mapTopicToCategory } from './topicMapper';
import { generateSEOMetadata } from './seoGenerator';
import { expandContent } from './contentExpander';
import { generateQASection } from './qaGenerator';
import { formatArticle, formatOutput, generateStatistics } from './markdownFormatter';

/**
 * Conversion result containing articles and statistics
 */
export interface ConversionResult {
  success: boolean;
  articles: FormattedArticle[];
  output: string;
  statistics: ConversionStatistics;
  errors: string[];
}

/**
 * Converts a single Instagram post to a formatted article
 * 
 * @param post - The Instagram post to convert
 * @returns FormattedArticle or null if conversion fails
 */
export function convertSinglePost(post: InstagramPost): FormattedArticle | null {
  try {
    // Validate the post
    const validation = validatePost(post);
    if (!validation.valid) {
      return null;
    }
    
    // Map topic to category
    const category = mapTopicToCategory(post.topic);
    
    // Generate SEO metadata
    const seo = generateSEOMetadata(post.raw_caption, post.topic, post.id);
    
    // Expand content
    const expandedContent = expandContent(post.raw_caption, post.topic);
    
    // Generate Q&A section (may be null)
    const qaSection = generateQASection(post.user_questions);
    
    // Format the article
    const article = formatArticle(post, seo, category, expandedContent, qaSection);
    
    return article;
  } catch {
    return null;
  }
}

/**
 * Main conversion function - converts Instagram posts to SEO articles
 * 
 * @param posts - Array of Instagram posts to convert
 * @returns ConversionResult with articles, output, and statistics
 * 
 * Validates: Requirements 1.4, 7.5
 */
export function convertPosts(posts: InstagramPost[]): ConversionResult {
  const errors: string[] = [];
  const articles: FormattedArticle[] = [];
  
  // Validate all posts first
  const { validPosts, skippedPosts } = validatePosts(posts);
  
  // Log skipped posts
  for (const skipped of skippedPosts) {
    errors.push(`פוסט ${skipped.id}: ${skipped.skipReason}`);
  }
  
  // Convert valid posts
  for (const post of validPosts) {
    const article = convertSinglePost(post);
    if (article) {
      articles.push(article);
    } else {
      errors.push(`פוסט ${post.id}: נכשל בהמרה`);
    }
  }
  
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
 * Converts JSON content directly to SEO articles
 * 
 * @param jsonContent - Raw JSON string containing Instagram posts
 * @returns ConversionResult with articles, output, and statistics
 */
export function convertFromJSON(jsonContent: string): ConversionResult {
  // Parse JSON
  const parseResult: ParseResult = parseInstagramPosts(jsonContent);
  
  if (!parseResult.success) {
    const errors = parseResult.errors.map(e => 
      `שגיאת פענוח בפוסט ${e.index}: ${e.message}`
    );
    
    return {
      success: false,
      articles: [],
      output: '',
      statistics: generateStatistics(0, 0, 0),
      errors,
    };
  }
  
  // Convert posts
  return convertPosts(parseResult.posts);
}

/**
 * Generates a human-readable statistics report
 * 
 * @param statistics - Conversion statistics
 * @returns Formatted statistics string in Hebrew
 */
export function formatStatisticsReport(statistics: ConversionStatistics): string {
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
