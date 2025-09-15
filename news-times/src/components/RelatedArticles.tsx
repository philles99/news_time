import { getServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatRelativeTimeFromNow } from "@/lib/format";

interface RelatedArticlesProps {
  currentArticleId: number;
  section: string | null;
  category: string | null;
  limit?: number;
}

export default async function RelatedArticles({ 
  currentArticleId, 
  section, 
  category, 
  limit = 5 
}: RelatedArticlesProps) {
  const supabase = getServerSupabaseClient();
  
  // Build query to find related articles
  let query = supabase
    .from('Published')
    .select('id, "Main Header", Headline, Author, Section, Category, created_at, "Hero Image URL"')
    .neq('id', currentArticleId)
    .order('created_at', { ascending: false })
    .limit(limit);

  // Prefer articles from same section and category, but fall back gracefully
  if (section && category) {
    // First try: same section AND category
    const { data: exactMatch } = await query
      .eq('Section', section)
      .eq('Category', category);
    
    if (exactMatch && exactMatch.length >= 3) {
      return <RelatedArticlesList articles={exactMatch} title="Related Articles" />;
    }
    
    // Second try: same section OR category
    const { data: partialMatch } = await query
      .or(`Section.eq.${section},Category.eq.${category}`);
    
    if (partialMatch && partialMatch.length > 0) {
      return <RelatedArticlesList articles={partialMatch} title="Related Articles" />;
    }
  }
  
  // Fallback: latest articles
  const { data: fallback } = await query;
  
  if (!fallback || fallback.length === 0) {
    return null;
  }
  
  return <RelatedArticlesList articles={fallback} title="Latest Articles" />;
}

function RelatedArticlesList({ articles, title }: { articles: any[], title: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="block group hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
          >
            <div className="flex gap-3">
              {article["Hero Image URL"] && (
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={article["Hero Image URL"]}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                  {article["Main Header"] || article.Headline}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {article.Author && <span className="truncate max-w-[120px]">{article.Author}</span>}
                    {article.Author && <span className="hidden sm:inline">•</span>}
                  </div>
                  <span className="whitespace-nowrap">{formatRelativeTimeFromNow(article.created_at)}</span>
                </div>
                {(article.Section || article.Category) && (
                  <div className="flex gap-1 mt-1">
                    {article.Section && (
                      <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-0.5 rounded">
                        {article.Section}
                      </span>
                    )}
                    {article.Category && (
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
                        {article.Category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
