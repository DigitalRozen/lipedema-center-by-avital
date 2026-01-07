-- Create analytics_events table for tracking user interactions
-- Migration: 20250105_create_analytics_events_table

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'affiliate_click', 'lead_submit')),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_post_id ON analytics_events(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics_events(product_id) WHERE product_id IS NOT NULL;

-- Add RLS (Row Level Security) policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access for analytics (anonymous users can create events)
CREATE POLICY "Allow public insert on analytics_events" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read analytics (for admin dashboard)
CREATE POLICY "Allow authenticated read on analytics_events" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);

-- Add comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks user interactions for analytics and optimization';
COMMENT ON COLUMN analytics_events.event_type IS 'Type of event: page_view, affiliate_click, lead_submit';
COMMENT ON COLUMN analytics_events.post_id IS 'Associated post ID (if applicable)';
COMMENT ON COLUMN analytics_events.product_id IS 'Associated product ID (if applicable)';
COMMENT ON COLUMN analytics_events.metadata IS 'Additional event data (user agent, referrer, etc.)';