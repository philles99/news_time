import AdSlot from "@/components/AdSlot";

export default function DemoArticle() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          A New Era of Responsible Discourse
        </h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-2">By Jane Doe</p>
        <p className="mt-6">
          In an age of rapid information, clarity and accountability matter. Our mission is
          to deliver concise, well-sourced reporting that respects your time and your values.
        </p>
        <h2>Balanced Economics</h2>
        <p>
          Markets thrive when policy respects entrepreneurship and prudence. We explore
          fiscal and monetary developments with a focus on long-term prosperity.
        </p>
        <h3>Community and Culture</h3>
        <p>
          Culture shapes nations. From sports to the arts, we highlight stories that
          strengthen civic life and shared traditions.
        </p>
        <p>
          Thank you for reading The Liberty Times. Scroll for more stories and expect ad
          placements along the way to keep access free for everyone.
        </p>
      </article>
      <aside className="space-y-4">
        <AdSlot />
        <AdSlot />
        <AdSlot />
      </aside>
    </div>
  );
}


