export default function ArticleCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-4 p-4 border border-black/10 dark:border-white/15 rounded-lg animate-pulse bg-white/40 dark:bg-black/20">
      <div>
        <div className="h-5 w-3/4 rounded bg-black/10 dark:bg-white/10" />
        <div className="mt-2 h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
        <div className="mt-3 h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      </div>
      <div className="h-40 rounded bg-black/10 dark:bg-white/10" />
    </div>
  );
}


