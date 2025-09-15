import React from "react";
import FeatureCard from "@/components/FeatureCard";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";

export default function HomepageLayout({ items }: { items: any[] }) {
  // Prioritize Europe and North America for large slots
  const isPreferred = (a: any) => a && (a.Category === "Europe" || a.Category === "North America");
  const remaining = [...items];
  const takePreferred = () => {
    const idx = remaining.findIndex(isPreferred);
    if (idx >= 0) {
      const [picked] = remaining.splice(idx, 1);
      return picked;
    }
    return undefined as any;
  };
  const takeAny = () => (remaining.length ? remaining.shift() : undefined) as any;

  // Hero → preferred first, then any
  const hero = takePreferred() || takeAny();
  // Right-rail big cards → prefer preferred
  const second = takePreferred() || takeAny();
  const third = takePreferred() || takeAny();
  // Left filler under hero to balance height
  const filler = takeAny();
  // Grid below - show all remaining articles for infinite scroll
  const grid = remaining;

  return (
    <div className="flex flex-col gap-8">
      {hero && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="flex flex-col gap-6">
            <FeatureCard item={hero} />
            {filler && (
              <ArticleCard
                id={filler.id}
                title={filler["Main Header"] || filler.Headline || "Untitled"}
                subtitle={(filler["Paragraph 1"] || filler["Paragraph 2"] || filler["Paragraph 4"]) ?? undefined}
                author={filler.Author ?? undefined}
                category={filler.Category ?? undefined}
                section={filler.Section ?? undefined}
                createdAtISO={filler.created_at}
                imageUrl={filler["Hero Image URL"] as any}
                image2={filler.image2}
                image3={filler.image3}
                maxWords={48}
                imageRatioPct={36}
              />
            )}
          </div>
          <div className="flex flex-col gap-6">
            {second && (
              <ArticleCard
                id={second.id}
                title={second["Main Header"] || second.Headline || "Untitled"}
                subtitle={(second["Paragraph 1"] || second["Paragraph 2"] || second["Paragraph 4"]) ?? undefined}
                author={second.Author ?? undefined}
                category={second.Category ?? undefined}
                section={second.Section ?? undefined}
                createdAtISO={second.created_at}
                imageUrl={second["Hero Image URL"] as any}
                image2={second.image2}
                image3={second.image3}
                maxWords={60}
                imageRatioPct={36}
              />
            )}
            {third && (
              <ArticleCard
                id={third.id}
                title={third["Main Header"] || third.Headline || "Untitled"}
                subtitle={(third["Paragraph 1"] || third["Paragraph 2"] || third["Paragraph 4"]) ?? undefined}
                author={third.Author ?? undefined}
                category={third.Category ?? undefined}
                section={third.Section ?? undefined}
                createdAtISO={third.created_at}
                imageUrl={third["Hero Image URL"] as any}
                image2={third.image2}
                image3={third.image3}
                maxWords={60}
                imageRatioPct={36}
              />
            )}
            <AdSlot />
          </div>
        </div>
      )}

      {grid.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {grid.map((a, i) => {
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
                imageUrl={a["Hero Image URL"] as any}
                image2={a.image2}
                image3={a.image3}
                variant={i % 2 === 0 ? "compact" : "list"}
              />
            );
            
            // Add ad after every 6 articles (full width)
            if ((i + 1) % 6 === 0 && i < grid.length - 1) {
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


