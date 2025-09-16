import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import { formatDateToDisplay, formatRelativeTimeFromNow } from "@/lib/format";

export default function FeatureCard({ item }: { item: any }) {
  const title = item["Main Header"] || item.Headline || "Untitled";
  const snippet = [item["Paragraph 1"], item["Paragraph 2"]]
    .filter(Boolean)
    .join(" ");
  return (
    <article className="card-premium overflow-hidden group shadow-premium">
      <div className="relative overflow-hidden">
        <ImageCarousel 
          images={[item["Hero Image URL"], item.image2, item.image3]} 
          alt={title} 
          aspectRatio="wide"
          showDots={true}
          showArrows={true}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4">
          {item.Category && (
            <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {item.Category}
            </span>
          )}
        </div>
        {item.Section && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {item.Section}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="text-meta text-gray-600 mb-3">
          {formatRelativeTimeFromNow(item.created_at)} • {item.Author && `By ${item.Author}`}
        </div>
        <Link href={`/article/${item.id}`} className="block group-hover:text-blue-700 transition-colors">
          <h1 className="headline-hero text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4">
            {title}
          </h1>
          {snippet && (
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed line-clamp-4 lg:line-clamp-5">
              {snippet}
            </p>
          )}
        </Link>
      </div>
    </article>
  );
}