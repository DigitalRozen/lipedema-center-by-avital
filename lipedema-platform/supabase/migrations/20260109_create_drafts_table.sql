-- Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create drafts table
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    seo_title TEXT,
    slug TEXT,
    content TEXT,
    image_url TEXT,
    image_prompt TEXT,
    status TEXT DEFAULT 'draft',
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.drafts;
DROP POLICY IF EXISTS "Allow all for anon users" ON public.drafts;

CREATE POLICY "Allow all for authenticated users" ON public.drafts
    FOR ALL USING (auth.role() = 'authenticated');

-- TEMPORARY: Allow all for anon users (for easier local testing without login)
CREATE POLICY "Allow all for anon users" ON public.drafts
    FOR ALL USING (auth.role() = 'anon');

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger to avoid conflicts on re-run
DROP TRIGGER IF EXISTS update_drafts_updated_at ON public.drafts;

CREATE TRIGGER update_drafts_updated_at
    BEFORE UPDATE ON public.drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
