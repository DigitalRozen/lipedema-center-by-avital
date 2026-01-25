import { CategorySlug, MonetizationStrategy } from '@/types/database';

export interface InstagramPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  likes: number;
  category_slug: CategorySlug;
  category_display: string;
  monetization_strategy: MonetizationStrategy;
  original_url: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  postId: string;
  reason: string;
}

/**
 * Parse Instagram export JSON and validate structure
 * @param jsonData - Raw JSON string from Instagram export
 * @returns Array of InstagramPost objects or null if parsing fails
 */
export function parseInstagramExport(jsonData: string): InstagramPost[] | null {
  try {
    const parsed = JSON.parse(jsonData);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      return null;
    }
    
    // Validate each post has required fields
    const validPosts: InstagramPost[] = [];
    
    for (const item of parsed) {
      if (isValidInstagramPost(item)) {
        validPosts.push(item);
      }
    }
    
    return validPosts.length > 0 ? validPosts : null;
  } catch (error) {
    console.error('Failed to parse Instagram export JSON:', error);
    return null;
  }
}

/**
 * Validate that an object has all required InstagramPost fields
 */
function isValidInstagramPost(item: any): item is InstagramPost {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.content === 'string' &&
    typeof item.image_url === 'string' &&
    typeof item.date === 'string' &&
    typeof item.likes === 'number' &&
    typeof item.category_slug === 'string' &&
    typeof item.category_display === 'string' &&
    typeof item.monetization_strategy === 'string' &&
    typeof item.original_url === 'string' &&
    isValidCategorySlug(item.category_slug) &&
    isValidMonetizationStrategy(item.monetization_strategy)
  );
}

/**
 * Validate category slug
 */
function isValidCategorySlug(slug: string): slug is CategorySlug {
  const validSlugs: CategorySlug[] = ['diagnosis', 'nutrition', 'physical', 'mindset', 'all'];
  return validSlugs.includes(slug as CategorySlug);
}

/**
 * Validate monetization strategy
 */
function isValidMonetizationStrategy(strategy: string): strategy is MonetizationStrategy {
  const validStrategies: MonetizationStrategy[] = [
    'Affiliate (Products)',
    'Low Ticket (Digital Guide)',
    'High Ticket (Clinic Lead)'
  ];
  return validStrategies.includes(strategy as MonetizationStrategy);
}

/**
 * Generate URL-safe slug from Hebrew title
 * @param title - Hebrew title string
 * @returns URL-safe slug
 */
export function generateSlug(title: string): string {
  // Remove HTML tags if any
  const cleanTitle = title.replace(/<[^>]*>/g, '');
  
  // Take first 80 characters for better content representation
  const truncated = cleanTitle.substring(0, 80).trim();
  
  // Enhanced Hebrew to Latin transliteration
  let slug = truncated
    // Common Hebrew words
    .replace(/מה/g, 'mah')
    .replace(/איך/g, 'eich')  
    .replace(/למה/g, 'lamah')
    .replace(/כיצד/g, 'keitzad')
    .replace(/מתי/g, 'matai')
    .replace(/איפה/g, 'eifoh')
    .replace(/תזונה/g, 'tezuna')
    .replace(/בריאות/g, 'briut')
    .replace(/ליפאדמה/g, 'lipedema')
    .replace(/טיפול/g, 'tipul')
    .replace(/מתכון/g, 'matakon')
    .replace(/דלקת/g, 'daleket')
    .replace(/עיסוי/g, 'isui')
    .replace(/מיינדסט/g, 'mindset')
    .replace(/אבחון/g, 'avhun')
    // Remove quotes and special punctuation first
    .replace(/["""'']/g, '')
    .replace(/[:.!?]/g, '')
    // Remove remaining Hebrew characters
    .replace(/[\u0590-\u05FF]/g, ' ')
    // Clean up spaces and special characters
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  
  // If slug is empty or too short, generate a meaningful fallback
  if (!slug || slug.length < 3) {
    // Try to extract meaningful English words or numbers
    const englishWords = cleanTitle.match(/[a-zA-Z0-9]+/g);
    if (englishWords && englishWords.length > 0) {
      slug = englishWords.slice(0, 3).join('-').toLowerCase();
    } else {
      slug = `hebrew-post-${Date.now()}`;
    }
  }
  
  return slug;
}

/**
 * Import posts to Supabase with draft status
 * @param posts - Array of InstagramPost objects to import
 * @returns ImportResult with success/failure details
 */
export async function importPosts(posts: InstagramPost[]): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: []
  };
  
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    
    for (const post of posts) {
      try {
        // Generate slug from title
        const slug = generateSlug(post.title);
        
        // Check if post already exists by original_url
        const { data: existingPost } = await supabase
          .from('posts')
          .select('id')
          .eq('original_url', post.original_url)
          .single();
        
        if (existingPost) {
          result.skipped++;
          continue;
        }
        
        // Create draft post
        const { error } = await supabase
          .from('posts')
          .insert({
            title: post.title,
            content: post.content,
            slug: slug,
            category: post.category_slug,
            category_display: post.category_display,
            image_url: post.image_url,
            date: post.date,
            monetization_strategy: post.monetization_strategy,
            original_url: post.original_url,
            published: false, // Import as draft
            excerpt: generateExcerpt(post.content),
            tags: extractTags(post.content)
          });
        
        if (error) {
          result.errors.push({
            postId: post.id,
            reason: `Database error: ${error.message}`
          });
        } else {
          result.imported++;
        }
      } catch (error) {
        result.errors.push({
          postId: post.id,
          reason: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    result.success = result.imported > 0;
    return result;
  } catch (error) {
    result.errors.push({
      postId: 'general',
      reason: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return result;
  }
}

/**
 * Generate excerpt from content (first 150 characters)
 */
function generateExcerpt(content: string): string {
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  return cleanContent.length > 150 
    ? cleanContent.substring(0, 150) + '...'
    : cleanContent;
}

/**
 * Extract tags from content (simple implementation)
 * This is a basic implementation - can be enhanced with NLP
 */
function extractTags(content: string): string[] {
  const commonTags = [
    'ליפאדמה', 'תזונה', 'בריאות', 'טיפול', 'עיסוי', 'מתכון',
    'דלקת', 'מינרלים', 'ויטמינים', 'פיזיותרפיה', 'לימפה',
    'אנטי-דלקתי', 'מיינדסט', 'רגש', 'אבחון'
  ];
  
  const foundTags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  for (const tag of commonTags) {
    if (lowerContent.includes(tag.toLowerCase())) {
      foundTags.push(tag);
    }
  }
  
  return foundTags.slice(0, 5); // Limit to 5 tags
}