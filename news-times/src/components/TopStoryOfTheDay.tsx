import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import { formatRelativeTimeFromNow } from "@/lib/format";

interface TopStoryProps {
  article: {
    id: number;
    title: string;
    subtitle: string;
    author: string;
    category: string;
    section: string;
    createdAtISO: string;
    imageUrl?: string;
    image2?: string;
    image3?: string;
    viewCount: number;
  };
}

export default function TopStoryOfTheDay({ article }: TopStoryProps) {
  return (
    <div className="mb-12">
      {/* Top Story Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="headline text-2xl font-bold text-slate-900">Top Story of the Day</h2>
        </div>
      </div>

      {/* Top Story Card */}
      <article className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-red-600 rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 lg:items-stretch">
          {/* Content Section */}
          <div className="p-6 sm:p-8 order-2 lg:order-1 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              {article.category && (
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide whitespace-nowrap">
                  {article.category}
                </span>
              )}
              {article.section && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide whitespace-nowrap">
                  {article.section}
                </span>
              )}
            </div>

            <Link href={`/article/${article.id}`} className="block group-hover:text-blue-700 transition-colors">
              <h1 className="headline-hero text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4 text-slate-900">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 line-clamp-3">
                  {article.subtitle}
                </p>
              )}
            </Link>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {article.author && (
                  <span className="font-semibold">By {article.author}</span>
                )}
                <span className="mx-2">•</span>
                <span>{formatRelativeTimeFromNow(article.createdAtISO)}</span>
              </div>
              
              <Link 
                href={`/article/${article.id}`}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 transition-colors"
              >
                <span className="hidden sm:inline">Read Full Story</span>
                <span className="sm:hidden">Read More</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          {(article.imageUrl || article.image2 || article.image3) && (
            <div className="relative order-1 lg:order-2 h-[300px] sm:h-[350px] lg:h-auto lg:min-h-full">
              <ImageCarousel 
                images={[article.imageUrl, article.image2, article.image3]} 
                alt={article.title} 
                aspectRatio="square"
                showDots={true}
                showArrows={true}
                autoHeight={false}
                className="h-full w-full [&>div:last-child]:lg:mt-3 [&>div:last-child]:mt-0 [&>div:last-child]:lg:relative [&>div:last-child]:absolute [&>div:last-child]:bottom-2 [&>div:last-child]:left-1/2 [&>div:last-child]:-translate-x-1/2 [&>div:last-child]:lg:transform-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
