import { Suspense } from 'react';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

type SearchPageProps = {
  searchParams: { q?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: query ? `Search results for "${query}" - ${SITE_NAME}` : `Search - ${SITE_NAME}`,
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Start typing to search</h2>
        <p className="text-gray-500">Enter at least 2 characters to search for articles</p>
      </div>
    );
  }

  const supabase = getServerSupabaseClient();
  
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
      "Hero Image URL"
    `)
    .or(`"Main Header".ilike.%${query}%,Headline.ilike.%${query}%,"Paragraph 1".ilike.%${query}%,"Paragraph 2".ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Search Error</h2>
        <p className="text-gray-500">Unable to perform search. Please try again.</p>
      </div>
    );
  }

  const articles = (data || []).map((item) => ({
    id: item.id,
    title: item["Main Header"] || item.Headline || "Untitled",
    subtitle: item["Paragraph 1"] || "",
    author: item.Author,
    category: item.Category,
    section: item.Section,
    createdAtISO: item.created_at,
    imageUrl: item["Hero Image URL"],
  }));

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No results found</h2>
        <p className="text-gray-500">No articles found for &quot;{query}&quot;. Try different keywords.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {articles.length} result{articles.length !== 1 ? 's' : ''} for &quot;{query}&quot;
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Articles</h1>
        <p className="text-gray-600">Find articles by title, content, or keywords</p>
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
