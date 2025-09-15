-- SQL commands to run in your Supabase SQL editor

-- 1. Add view_count column to existing Published table
ALTER TABLE public."Published" 
ADD COLUMN view_count INTEGER DEFAULT 0;

-- 2. Create article_views table for detailed tracking
CREATE TABLE public.article_views (
  id BIGSERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for better performance
CREATE INDEX idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX idx_article_views_viewed_at ON public.article_views(viewed_at);

-- 4. Create function to increment view count (alternative approach)
CREATE OR REPLACE FUNCTION increment_view_count(article_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public."Published" 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = article_id
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql;

-- 5. Set up Row Level Security (RLS) policies
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert views (for tracking)
CREATE POLICY "Allow anonymous view tracking" ON public.article_views
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read view stats
CREATE POLICY "Allow reading view stats" ON public.article_views
  FOR SELECT TO authenticated
  USING (true);

-- Allow public read access to view counts on Published table
CREATE POLICY "Allow reading view counts" ON public."Published"
  FOR SELECT TO anon, authenticated
  USING (true);
