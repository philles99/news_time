export default function ArticlePageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 animate-pulse">
      <div>
        <div className="h-8 w-5/6 rounded bg-black/10 dark:bg-white/10" />
        <div className="mt-4 space-y-3">
          <div className="h-3 w-2/3 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-4/6 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-28 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-28 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-28 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}


