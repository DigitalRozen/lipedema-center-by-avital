/**
 * Topic Mapper Module
 * 
 * Maps Instagram post topics to article categories.
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

import type { TopicType, CategorySlug, CategoryMapping } from './types';

/**
 * Mapping from Instagram topic to category slug
 * 
 * - Treatment → physical (טיפול פיזי ושיקום)
 * - Anti-Inflammatory, Nutrition → nutrition (תזונה ונוטריציה)
 * - Lymphedema, Diagnosis → diagnosis (אבחון וזיהוי)
 * - General Lipedema → mindset (מיינדסט ורגש)
 */
export const TOPIC_TO_CATEGORY: Record<TopicType, CategorySlug> = {
  'Treatment': 'physical',
  'Anti-Inflammatory': 'nutrition',
  'Nutrition': 'nutrition',
  'Lymphedema': 'diagnosis',
  'Diagnosis': 'diagnosis',
  'General Lipedema': 'mindset',
};

/**
 * Display names for each category in Hebrew
 */
export const CATEGORY_DISPLAY: Record<CategorySlug, string> = {
  'diagnosis': 'אבחון וזיהוי',
  'nutrition': 'תזונה ונוטריציה',
  'physical': 'טיפול פיזי ושיקום',
  'mindset': 'מיינדסט ורגש',
};

/**
 * All valid category slugs
 */
export const VALID_CATEGORIES: CategorySlug[] = ['diagnosis', 'nutrition', 'physical', 'mindset'];

/**
 * All valid topic types
 */
export const VALID_TOPICS: TopicType[] = [
  'Treatment',
  'Anti-Inflammatory',
  'Lymphedema',
  'Nutrition',
  'Diagnosis',
  'General Lipedema',
];

/**
 * Maps an Instagram post topic to its corresponding category
 * 
 * @param topic - The topic from the Instagram post
 * @returns CategoryMapping with slug and Hebrew display name
 * 
 * @example
 * mapTopicToCategory('Treatment')
 * // Returns: { slug: 'physical', display: 'טיפול פיזי ושיקום' }
 */
export function mapTopicToCategory(topic: TopicType): CategoryMapping {
  const slug = TOPIC_TO_CATEGORY[topic];
  return {
    slug,
    display: CATEGORY_DISPLAY[slug],
  };
}

/**
 * Checks if a string is a valid TopicType
 * 
 * @param topic - String to check
 * @returns true if the string is a valid TopicType
 */
export function isValidTopic(topic: string): topic is TopicType {
  return VALID_TOPICS.includes(topic as TopicType);
}

/**
 * Checks if a string is a valid CategorySlug
 * 
 * @param category - String to check
 * @returns true if the string is a valid CategorySlug
 */
export function isValidCategory(category: string): category is CategorySlug {
  return VALID_CATEGORIES.includes(category as CategorySlug);
}
