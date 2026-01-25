/**
 * Instagram to SEO Articles Converter - Type Definitions
 * 
 * Core TypeScript interfaces for the converter pipeline.
 * Validates: Requirements 1.1
 */

// ============================================
// Input Types - Instagram Posts
// ============================================

/**
 * Valid topic types from Instagram posts
 */
export type TopicType = 
  | 'Treatment' 
  | 'Anti-Inflammatory' 
  | 'Lymphedema' 
  | 'Nutrition' 
  | 'Diagnosis' 
  | 'General Lipedema';

/**
 * Instagram post structure as received from JSON input
 */
export interface InstagramPost {
  id: string;
  topic: TopicType;
  raw_caption: string;
  image_url: string;
  user_questions: string[];
}

// ============================================
// Category Types
// ============================================

/**
 * Category slugs for article classification
 */
export type CategorySlug = 'diagnosis' | 'nutrition' | 'physical' | 'mindset';

/**
 * Category mapping with display name
 */
export interface CategoryMapping {
  slug: CategorySlug;
  display: string;
}

// ============================================
// SEO Types
// ============================================

/**
 * Valid article tags (predefined list)
 */
export type ArticleTag = 
  | 'תזונה' 
  | 'טיפול שמרני' 
  | 'ניתוחים' 
  | 'סיפורי הצלחה' 
  | 'אבחון' 
  | 'תוספי תזונה';

/**
 * SEO metadata for an article
 */
export interface SEOMetadata {
  title: string;
  slug: string;
  metaDescription: string;
  tags: ArticleTag[];
}

// ============================================
// Content Types
// ============================================

/**
 * A section within the article content
 */
export interface ContentSection {
  heading: string;
  content: string;
}

/**
 * Expanded content structure
 */
export interface ExpandedContent {
  introduction: string;
  sections: ContentSection[];
  conclusion: string;
}

// ============================================
// Q&A Types
// ============================================

/**
 * Question and answer pair
 */
export interface QAPair {
  question: string;
  answer: string;
}

/**
 * Q&A section for an article
 */
export interface QASection {
  questions: QAPair[];
}

// ============================================
// Output Types - SEO Articles
// ============================================

/**
 * Article frontmatter for Markdown output
 */
export interface ArticleFrontmatter {
  title: string;
  slug: string;
  meta_description: string;
  tags: string[];
  category: string;
  original_post_id: string;
  image_url: string;
}

/**
 * Formatted article ready for output
 */
export interface FormattedArticle {
  frontmatter: ArticleFrontmatter;
  content: string;
}

/**
 * Complete SEO article structure
 */
export interface SEOArticle {
  // Frontmatter fields
  title: string;
  slug: string;
  meta_description: string;
  tags: ArticleTag[];
  category: CategorySlug;
  original_post_id: string;
  image_url: string;
  
  // Content fields
  introduction: string;
  sections: ContentSection[];
  qa_section?: QASection;
  conclusion: string;
}

// ============================================
// Processing Types
// ============================================

/**
 * Parse error details
 */
export interface ParseError {
  index: number;
  field: string;
  message: string;
}

/**
 * Result of parsing Instagram posts JSON
 */
export interface ParseResult {
  success: boolean;
  posts: InstagramPost[];
  errors: ParseError[];
}

/**
 * Validation result for a single post
 */
export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validated post with status
 */
export interface ValidatedPost extends InstagramPost {
  isValid: boolean;
  skipReason?: string;
}

/**
 * Conversion statistics
 */
export interface ConversionStatistics {
  totalProcessed: number;
  articlesGenerated: number;
  postsSkipped: number;
}
