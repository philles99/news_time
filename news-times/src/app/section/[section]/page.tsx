import React, { Suspense } from 'react';
import { getServerSupabaseClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import EmptyState from "@/components/EmptyState";
import CategoryFilter from "@/components/CategoryFilter";

type Params = { 
  params: Promise<{ section: string }>;
  searchParams: Promise<{ category?: string }>;
};

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

export default async function SectionPage({ params, searchParams }: Params) {
  const supabase = getServerSupabaseClient();
  const { section: raw } = await params;
  const section = decodeURIComponent(raw);
  const { category } = await searchParams;
  
  let query = supabase
    .from("Published")
    .select("*")
    .eq("Section", section)
    .order("created_at", { ascending: false })
    .limit(50);

  if (category) {
    query = query.eq("Category", category);
  }

  const [data, categories] = await Promise.all([
    query.then(({ data, error }) => {
      if (error) throw error;
      return data;
    }),
    fetchCategories()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="headline text-3xl font-bold text-slate-900 mb-4">{section}</h1>
        
        <Suspense fallback={<div>Loading filters...</div>}>
          <CategoryFilter 
            availableCategories={categories} 
            currentPath={`/section/${encodeURIComponent(section)}`} 
          />
        </Suspense>
      </div>

      {(!data || data.length === 0) && (
        <EmptyState message="No articles found for the selected filters in this section." />
      )}
      
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((a, i) => {
            const items = [];
            
            // Add the article card
            items.push(
              <ArticleCard
                key={a.id}
                id={a.id}
                title={a["Main Header"] || a.Headline || "Untitled"}
                subtitle={a["Paragraph 1"] ?? undefined}
                author={a.Author ?? undefined}
                category={a.Category ?? undefined}
                section={a.Section ?? undefined}
                createdAtISO={a.created_at}
                imageUrl={a["Hero Image URL"] ?? undefined}
                image2={a.image2}
                image3={a.image3}
              />
            );
            
            // Add ad after every 6 articles (full width)
            if ((i + 1) % 6 === 0 && i < data.length - 1) {
              items.push(
                <div key={`ad-${Math.floor(i / 6)}`} className="col-span-full my-8">
                  <AdSlot index={Math.floor(i / 6)} />
                </div>
              );
            }
            
            return items;
          })}
        </div>
      )}
    </div>
  );
}


