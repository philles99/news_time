import { getServerSupabaseClient } from "@/lib/supabase/server";
import InfiniteFeed from "@/components/InfiniteFeed";
import EmptyState from "@/components/EmptyState";
import TopStoryOfTheDay from "@/components/TopStoryOfTheDay";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from 'react';

async function fetchArticles(page: number, pageSize: number, category?: string) {
  const supabase = getServerSupabaseClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;
  
  let query = supabase
    .from("Published")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("Category", category);
  }

  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data ?? [];
}

async function fetchCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      return data.categories || [];
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
}

async function fetchTopStory() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/top-story`, {
      cache: 'no-store' // Always get fresh data
    });
    if (response.ok) {
      const data = await response.json();
      return data.topStory;
    }
  } catch (error) {
    console.error('Failed to fetch top story:', error);
  }
  return null;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  
  const [initial, topStory, categories] = await Promise.all([
    fetchArticles(0, 10, category),
    fetchTopStory(),
    fetchCategories()
  ]);

  if (!initial.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <CategoryFilter availableCategories={categories} currentPath="/" />
        </Suspense>
        <EmptyState message="No articles found for the selected filters." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {!category && topStory && <TopStoryOfTheDay article={topStory} />}
      
      <Suspense fallback={<div>Loading filters...</div>}>
        <CategoryFilter availableCategories={categories} currentPath="/" />
      </Suspense>
      
      <InfiniteFeed initial={initial} />
    </div>
  );
}
