import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";

interface Article {
  id: number;
  "Main Header": string | null;
  Headline: string | null;
  "Paragraph 1": string | null;
  Author: string | null;
  Section: string | null;
  Category: string | null;
  created_at: string;
  "Hero Image URL": string | null;
  image2?: string | null;
  image3?: string | null;
}

export default function ArticleGrid({ items }: { items: Article[] }) {
  // Masonry-like simple variant using CSS grid with auto-fill
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((a, i) => (
        <div key={a.id} className="flex flex-col gap-4">
          <ArticleCard
            id={a.id}
            title={a["Main Header"] || a.Headline || "Untitled"}
            subtitle={a["Paragraph 1"] ?? undefined}
            author={a.Author ?? undefined}
            category={a.Category ?? undefined}
            section={a.Section ?? undefined}
            createdAtISO={a.created_at}
            imageUrl={a["Hero Image URL"] ?? undefined}
            image2={a.image2 ?? undefined}
            image3={a.image3 ?? undefined}
          />
          {(i + 1) % 6 === 0 ? <AdSlot index={i} /> : null}
        </div>
      ))}
    </div>
  );
}


