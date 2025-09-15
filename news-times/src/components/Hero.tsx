import Link from "next/link";
import { formatDateToDisplay, formatRelativeTimeFromNow } from "@/lib/format";

export default function Hero({ item }: { item: any }) {
  const title = item["Main Header"] || item.Headline || "Untitled";
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 border border-black/10 dark:border-white/15 rounded-lg bg-white/70 dark:bg-black/30">
      <div className="relative w-full overflow-hidden rounded bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)]">
        <div className="pt-[56%]" />
        <div className="absolute inset-0 flex items-center justify-center text-[12px] text-black/60 dark:text-white/60">Hero image</div>
      </div>
      <div className="flex flex-col justify-center">
        <Link href={`/article/${item.id}`} className="text-2xl sm:text-3xl font-extrabold leading-tight hover:underline">
          {title}
        </Link>
        <p className="text-sm text-black/60 dark:text-white/60 mt-2">
          {formatDateToDisplay(item.created_at)} ({formatRelativeTimeFromNow(item.created_at)})
        </p>
        {item["Paragraph 1"] && (
          <p className="mt-4 text-black/80 dark:text-white/80 line-clamp-3">{item["Paragraph 1"]}</p>
        )}
      </div>
    </section>
  );
}



