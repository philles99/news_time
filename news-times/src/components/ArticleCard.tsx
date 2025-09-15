import Link from "next/link";
import { formatDateToDisplay, formatRelativeTimeFromNow, truncateWords } from "@/lib/format";
import type { ArticleCardData } from "@/lib/types";
import ImageCarousel from "@/components/ImageCarousel";

export default function ArticleCard({
  id,
  title,
  subtitle,
  author,
  category,
  section,
  createdAtISO,
  imageUrl,
  image2,
  image3,
  maxWords = 28,
  imageRatioPct = 56,
}: ArticleCardData & { image2?: string; image3?: string; maxWords?: number; imageRatioPct?: number }) {
  return (
    <article className="card-premium overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden">
        <ImageCarousel 
          images={[imageUrl, image2, image3]} 
          alt={title} 
          aspectRatio="video"
          showDots={true}
          showArrows={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              {category}
            </span>
          )}
          {section && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
              {section}
            </span>
          )}
        </div>
        <Link href={`/article/${id}`} className="block flex-1">
          <h3 className="headline text-lg font-bold leading-tight mb-3 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {truncateWords(subtitle, maxWords)}
            </p>
          )}
        </Link>
        <div className="text-meta flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {author && (
              <span className="text-premium text-gray-700">By {author}</span>
            )}
          </div>
          <span className="text-gray-500">
            {formatRelativeTimeFromNow(createdAtISO)}
          </span>
        </div>
      </div>
    </article>
  );
}