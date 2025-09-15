import { getServerSupabaseClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import EmptyState from "@/components/EmptyState";

type Params = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Params) {
  const supabase = getServerSupabaseClient();
  const { category: raw } = await params;
  const category = decodeURIComponent(raw);
  const { data, error } = await supabase
    .from("Published")
    .select("*")
    .eq("Category", category)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{category}</h1>
      {(!data || data.length === 0) && <EmptyState message="No articles in this category yet." />}
      {data?.map((a, i) => (
        <div key={a.id} className="flex flex-col gap-6">
          <ArticleCard
            id={a.id}
            title={a["Main Header"] || a.Headline || "Untitled"}
            subtitle={a["Paragraph 1"] ?? undefined}
            author={a.Author ?? undefined}
            category={a.Category ?? undefined}
            section={a.Section ?? undefined}
            createdAtISO={a.created_at}
            imageUrl={a["Hero Image URL"] as any}
            image2={a.image2}
            image3={a.image3}
          />
          {i % 3 === 2 ? <AdSlot index={i} /> : null}
        </div>
      ))}
    </div>
  );
}


