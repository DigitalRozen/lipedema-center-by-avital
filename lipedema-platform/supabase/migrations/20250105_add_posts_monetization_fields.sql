-- Add monetization and metadata fields to posts table
-- Migration: 20250105_add_posts_monetization_fields

-- Add monetization_strategy field with default value
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS monetization_strategy TEXT 
DEFAULT 'Low Ticket (Digital Guide)' 
CHECK (monetization_strategy IN (
  'Affiliate (Products)', 
  'Low Ticket (Digital Guide)', 
  'High Ticket (Clinic Lead)'
));

-- Add original_url field for Instagram source links
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS original_url TEXT;

-- Add category_display field for Hebrew category names
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category_display TEXT;

-- Update existing posts with category_display based on category
UPDATE posts 
SET category_display = CASE 
  WHEN category = 'diagnosis' THEN 'אבחון וזיהוי'
  WHEN category = 'nutrition' THEN 'תזונה ונוטריציה'
  WHEN category = 'physical' THEN 'טיפול פיזי ושיקום'
  WHEN category = 'Treatment' THEN 'טיפול פיזי ושיקום'  -- Legacy mapping
  WHEN category = 'Nutrition' THEN 'תזונה ונוטריציה'   -- Legacy mapping
  WHEN category = 'Success' THEN 'סיפורי הצלחה'        -- Legacy mapping
  ELSE category
END
WHERE category_display IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN posts.monetization_strategy IS 'Strategy for monetizing this post content';
COMMENT ON COLUMN posts.original_url IS 'Original Instagram post URL';
COMMENT ON COLUMN posts.category_display IS 'Hebrew display name for category';