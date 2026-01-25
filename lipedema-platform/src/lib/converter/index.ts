/**
 * Instagram to SEO Articles Converter
 * 
 * Main entry point for the converter module.
 * Exports all types and functions for the conversion pipeline.
 */

// Export all types
export * from './types';

// Export JSON parser
export { 
  parseInstagramPosts, 
  serializePost, 
  serializePosts,
  PARSE_ERRORS 
} from './jsonParser';

// Export post validator
export {
  validatePost,
  validateAndMark,
  validatePosts,
  isHashtagOnly,
  VALIDATION_WARNINGS,
} from './postValidator';

// Export topic mapper
export {
  mapTopicToCategory,
  isValidTopic,
  isValidCategory,
  TOPIC_TO_CATEGORY,
  CATEGORY_DISPLAY,
  VALID_CATEGORIES,
  VALID_TOPICS,
} from './topicMapper';

// Export SEO generator
export {
  generateSlug,
  generateMetaDescription,
  generateTitle,
  selectTags,
  generateSEOMetadata,
  isValidTag,
  VALID_TAGS,
  SEO_KEYWORDS,
  META_DESCRIPTION_KEYWORD,
  META_DESCRIPTION_MAX_LENGTH,
} from './seoGenerator';

// Export content expander
export {
  expandContent,
  expandShortCaption,
  restructureDetailedCaption,
  isShortCaption,
  cleanCaption,
  containsMedicalVocabulary,
  getExpandedContentLength,
  expandedContentToText,
  MEDICAL_VOCABULARY,
  SHORT_CAPTION_THRESHOLD,
  CTA_PHRASES,
} from './contentExpander';

// Export Q&A generator
export {
  generateQASection,
  generateAnswer,
  isDoctorRecommendationQuestion,
  isMedicalQuestion,
  removeDoctorNames,
  containsDoctorNames,
  hasConsultationRecommendation,
  DOCTOR_NAME_PATTERN,
  CONSULTATION_PHRASES,
} from './qaGenerator';

// Export Markdown formatter
export {
  formatFrontmatter,
  buildMarkdownContent,
  formatArticle,
  formatSingleArticle,
  formatOutput,
  validateFrontmatter,
  hasCompleteStructure,
  containsSEOKeywords,
  parseFrontmatter,
  countArticles,
  generateStatistics,
  validateStatistics,
  ARTICLE_SEPARATOR,
  REQUIRED_FRONTMATTER_FIELDS,
} from './markdownFormatter';

// Export main converter
export {
  convertPosts,
  convertFromJSON,
  convertSinglePost,
  formatStatisticsReport,
  type ConversionResult,
} from './mainConverter';
