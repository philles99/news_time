-- SQL commands to run in your Supabase SQL editor
-- Run these commands one by one

-- 1. Add view_count column to existing Published table (if not already added)
ALTER TABLE public."Published" 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. Create article_views table for detailed tracking (if not already created)
CREATE TABLE IF NOT EXISTS public.article_views (
  id BIGSERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON public.article_views(viewed_at);

-- 4. Set up Row Level Security (RLS) policies for article_views
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous view tracking" ON public.article_views;
DROP POLICY IF EXISTS "Allow reading view stats" ON public.article_views;

-- Allow anonymous users to insert views (for tracking)
CREATE POLICY "Allow anonymous view tracking" ON public.article_views
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow everyone to read view stats
CREATE POLICY "Allow reading view stats" ON public.article_views
  FOR SELECT TO anon, authenticated
  USING (true);

-- 5. Set up RLS policies for Published table to allow view count updates
-- Check if RLS is enabled on Published table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'Published';

-- If RLS is enabled on Published table, we need to allow updates
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow reading view counts" ON public."Published";
DROP POLICY IF EXISTS "Allow updating view counts" ON public."Published";

-- Allow everyone to read from Published table
CREATE POLICY "Allow reading published articles" ON public."Published"
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow anonymous users to update ONLY the view_count column
CREATE POLICY "Allow updating view counts" ON public."Published"
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Create a secure function that can be called by anyone to increment view count
CREATE OR REPLACE FUNCTION public.increment_article_view_count(target_article_id BIGINT)
RETURNS INTEGER 
SECURITY DEFINER -- This allows the function to run with elevated privileges
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Update the view count
  UPDATE public."Published" 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = target_article_id
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql;

-- 7. Grant execute permission on the function to anonymous users
GRANT EXECUTE ON FUNCTION public.increment_article_view_count(BIGINT) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_article_view_count(BIGINT) TO authenticated;
