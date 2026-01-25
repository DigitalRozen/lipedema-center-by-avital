/**
 * JSON Parser for Instagram Posts
 * 
 * Parses and validates JSON input containing Instagram posts.
 * Validates: Requirements 1.1, 7.4
 */

import type { 
  InstagramPost, 
  TopicType, 
  ParseResult, 
  ParseError 
} from './types';

/**
 * Valid topic values
 */
const VALID_TOPICS: TopicType[] = [
  'Treatment',
  'Anti-Inflammatory',
  'Lymphedema',
  'Nutrition',
  'Diagnosis',
  'General Lipedema',
];

/**
 * Error messages in Hebrew
 */
export const PARSE_ERRORS = {
  INVALID_JSON: 'קובץ JSON לא תקין',
  MISSING_FIELD: (field: string) => `שדה חסר: ${field}`,
  INVALID_TOPIC: (topic: string) => `נושא לא מוכר: ${topic}`,
  EMPTY_POSTS: 'אין פוסטים בקובץ',
  INVALID_ARRAY: 'הקובץ חייב להכיל מערך של פוסטים',
};

/**
 * Check if a value is a valid TopicType
 */
function isValidTopic(topic: unknown): topic is TopicType {
  return typeof topic === 'string' && VALID_TOPICS.includes(topic as TopicType);
}

/**
 * Validate a single post object and return errors if any
 */
function validatePostFields(post: unknown, index: number): ParseError[] {
  const errors: ParseError[] = [];
  
  if (typeof post !== 'object' || post === null) {
    errors.push({
      index,
      field: 'post',
      message: 'פוסט חייב להיות אובייקט',
    });
    return errors;
  }
  
  const p = post as Record<string, unknown>;
  
  // Check required fields
  if (typeof p.id !== 'string' || p.id.trim() === '') {
    errors.push({
      index,
      field: 'id',
      message: PARSE_ERRORS.MISSING_FIELD('id'),
    });
  }
  
  if (!isValidTopic(p.topic)) {
    errors.push({
      index,
      field: 'topic',
      message: p.topic ? PARSE_ERRORS.INVALID_TOPIC(String(p.topic)) : PARSE_ERRORS.MISSING_FIELD('topic'),
    });
  }
  
  if (typeof p.raw_caption !== 'string') {
    errors.push({
      index,
      field: 'raw_caption',
      message: PARSE_ERRORS.MISSING_FIELD('raw_caption'),
    });
  }
  
  if (typeof p.image_url !== 'string') {
    errors.push({
      index,
      field: 'image_url',
      message: PARSE_ERRORS.MISSING_FIELD('image_url'),
    });
  }
  
  if (!Array.isArray(p.user_questions)) {
    errors.push({
      index,
      field: 'user_questions',
      message: PARSE_ERRORS.MISSING_FIELD('user_questions'),
    });
  }
  
  return errors;
}

/**
 * Parse JSON content and extract Instagram posts
 * 
 * @param jsonContent - Raw JSON string to parse
 * @returns ParseResult with posts and any errors
 */
export function parseInstagramPosts(jsonContent: string): ParseResult {
  let parsed: unknown;
  
  // Try to parse JSON
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    return {
      success: false,
      posts: [],
      errors: [{
        index: -1,
        field: 'json',
        message: PARSE_ERRORS.INVALID_JSON,
      }],
    };
  }
  
  // Check if it's an array
  if (!Array.isArray(parsed)) {
    return {
      success: false,
      posts: [],
      errors: [{
        index: -1,
        field: 'root',
        message: PARSE_ERRORS.INVALID_ARRAY,
      }],
    };
  }
  
  // Check for empty array
  if (parsed.length === 0) {
    return {
      success: false,
      posts: [],
      errors: [{
        index: -1,
        field: 'root',
        message: PARSE_ERRORS.EMPTY_POSTS,
      }],
    };
  }
  
  // Validate each post
  const posts: InstagramPost[] = [];
  const errors: ParseError[] = [];
  
  for (let i = 0; i < parsed.length; i++) {
    const postErrors = validatePostFields(parsed[i], i);
    
    if (postErrors.length === 0) {
      const p = parsed[i] as Record<string, unknown>;
      posts.push({
        id: p.id as string,
        topic: p.topic as TopicType,
        raw_caption: p.raw_caption as string,
        image_url: p.image_url as string,
        user_questions: p.user_questions as string[],
      });
    } else {
      errors.push(...postErrors);
    }
  }
  
  return {
    success: errors.length === 0,
    posts,
    errors,
  };
}

/**
 * Serialize an Instagram post back to JSON
 * Used for round-trip testing
 * 
 * @param post - Instagram post to serialize
 * @returns JSON string
 */
export function serializePost(post: InstagramPost): string {
  return JSON.stringify(post);
}

/**
 * Serialize multiple posts to JSON array
 * 
 * @param posts - Array of Instagram posts
 * @returns JSON string
 */
export function serializePosts(posts: InstagramPost[]): string {
  return JSON.stringify(posts);
}
