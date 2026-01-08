import keywordImageMap from '@/lib/article_keyword_map.json'
import { Post } from '@/types/database'

/**
 * מקבל את התמונה המתאימה למאמר
 * מחפש קודם תמונה מותאמת אישית, ואז תמונת ברירת מחדל לפי קטגוריה
 */
export function getArticleImage(post: Post): string {
  const titleLower = post.title.toLowerCase();
  const contentLower = post.content.toLowerCase();
  
  // חיפוש התאמה בכותרת או בתוכן
  const matchedEntry = keywordImageMap.find(entry =>
    entry.keywords.some(kw => 
      titleLower.includes(kw.toLowerCase()) || 
      contentLower.includes(kw.toLowerCase())
    )
  );
  
  if (matchedEntry) {
    // תמונה מותאמת אישית
    return `/articles/${matchedEntry.image}.png`;
  }
  
  // תמונת ברירת מחדל לפי קטגוריה
  const categoryFallbacks: Record<string, string> = {
    'diagnosis': '/assets/generated/diagnosis_fallback.png',
    'nutrition': '/assets/generated/nutrition_fallback.png', 
    'physical': '/assets/generated/physical_fallback.png',
    'mindset': '/assets/generated/mindset_fallback.png',
    // Legacy categories
    'Nutrition': '/assets/generated/nutrition_fallback.png',
    'Treatment': '/assets/generated/physical_fallback.png',
    'Success': '/assets/generated/mindset_fallback.png'
  };
  
  return categoryFallbacks[post.category] || post.image_url || '/assets/generated/nutrition_fallback.png';
}

/**
 * מקבל את התמונה המתאימה לקטגוריה (לשימוש כללי)
 */
export function getCategoryImage(category: string): string {
  const categoryImages: Record<string, string> = {
    'diagnosis': '/assets/generated/diagnosis_fallback.png',
    'nutrition': '/assets/generated/nutrition_fallback.png',
    'physical': '/assets/generated/physical_fallback.png',
    'mindset': '/assets/generated/mindset_fallback.png',
    // Legacy categories
    'Nutrition': '/assets/generated/nutrition_fallback.png',
    'Treatment': '/assets/generated/physical_fallback.png',
    'Success': '/assets/generated/mindset_fallback.png'
  };
  
  return categoryImages[category] || '/assets/generated/nutrition_fallback.png';
}