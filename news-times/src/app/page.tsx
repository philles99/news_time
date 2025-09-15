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
    const { getServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = getServerSupabaseClient();
    
    // Get the most viewed article from the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const { data, error } = await supabase
      .from("Published")
      .select(`
        id,
        "Main Header",
        Headline,
        "Paragraph 1",
        Author,
        Category,
        Section,
        created_at,
        "Hero Image URL",
        image2,
        image3,
        view_count
      `)
      .gte('created_at', yesterday.toISOString())
      .not('view_count', 'is', null)
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Top story query error:', error);
      return null;
    }

    if (!data || data.length === 0) {
      // Fallback: get the most recent article if no views today
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("Published")
        .select(`
          id,
          "Main Header",
          Headline,
          "Paragraph 1",
          Author,
          Category,
          Section,
          created_at,
          "Hero Image URL",
          image2,
          image3,
          view_count
        `)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fallbackError || !fallbackData || fallbackData.length === 0) {
        return null;
      }

      const fallbackArticle = fallbackData[0];
      return {
        id: fallbackArticle.id,
        title: fallbackArticle["Main Header"] || fallbackArticle.Headline || "Untitled",
        subtitle: fallbackArticle["Paragraph 1"] || "",
        author: fallbackArticle.Author,
        category: fallbackArticle.Category,
        section: fallbackArticle.Section,
        createdAtISO: fallbackArticle.created_at,
        imageUrl: fallbackArticle["Hero Image URL"],
        image2: fallbackArticle.image2,
        image3: fallbackArticle.image3,
        viewCount: fallbackArticle.view_count || 0,
      };
    }

    const topArticle = data[0];
    return {
      id: topArticle.id,
      title: topArticle["Main Header"] || topArticle.Headline || "Untitled",
      subtitle: topArticle["Paragraph 1"] || "",
      author: topArticle.Author,
      category: topArticle.Category,
      section: topArticle.Section,
      createdAtISO: topArticle.created_at,
      imageUrl: topArticle["Hero Image URL"],
      image2: topArticle.image2,
      image3: topArticle.image3,
      viewCount: topArticle.view_count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch top story:', error);
    return null;
  }
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
