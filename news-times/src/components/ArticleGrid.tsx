import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";

export default function ArticleGrid({ items }: { items: any[] }) {
  // Masonry-like simple variant using CSS grid with auto-fill
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((a, i) => {
        const variant = i % 3 === 0 ? "compact" : "list";
        return (
          <div key={a.id} className="flex flex-col gap-4">
            <ArticleCard
              id={a.id}
              title={a["Main Header"] || a.Headline || "Untitled"}
              subtitle={a["Paragraph 1"] ?? undefined}
              author={a.Author ?? undefined}
              category={a.Category ?? undefined}
              section={a.Section ?? undefined}
              createdAtISO={a.created_at}
              variant={variant as any}
            />
            {(i + 1) % 6 === 0 ? <AdSlot index={i} /> : null}
          </div>
        );
      })}
    </div>
  );
}


