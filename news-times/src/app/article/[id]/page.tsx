import { getServerSupabaseClient } from "@/lib/supabase/server";
import AdSlot from "@/components/AdSlot";
import ViewTracker from "@/components/ViewTracker";
import ImageCarousel from "@/components/ImageCarousel";
import RelatedArticles from "@/components/RelatedArticles";
import { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatDateToDisplay, formatRelativeTimeFromNow } from "@/lib/format";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("Published")
    .select("id, \"Main Header\", Headline, Author, created_at, \"Paragraph 1\", Category, Section")
    .eq("id", Number(resolvedParams.id))
    .maybeSingle();
  
  const title = data?.["Main Header"] || data?.Headline || "Article";
  const description = data?.["Paragraph 1"]?.slice(0, 160) || "Read the latest news and analysis from The World Times.";
  const url = `${SITE_URL}/article/${resolvedParams.id}`;
  
  return {
    title,
    description,
    authors: data?.Author ? [{ name: data.Author }] : undefined,
    keywords: data?.Category && data?.Section ? [data.Category, data.Section, "news", "politics", "world events"] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: data?.created_at,
      url,
      siteName: "The World Times",
      authors: data?.Author ? [data.Author] : undefined,
      tags: data?.Category && data?.Section ? [data.Category, data.Section] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ArticlePage({ params }: Params) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("Published")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return <div>Not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <ViewTracker articleId={id} />
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1 className="headline-hero text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 text-gradient">
          {data["Main Header"] || data.Headline || "Untitled"}
        </h1>
        <div className="text-sm text-black/60 dark:text-white/60 mt-2 flex flex-wrap items-center gap-2">
          {data.Author && <span>By {data.Author}</span>}
          <span>• {formatDateToDisplay(data.created_at)} ({formatRelativeTimeFromNow(data.created_at)})</span>
        </div>
        {/* Share bar */}
        <div className="mt-4 flex gap-4 text-xs text-black/60 dark:text-white/60">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${SITE_URL}/article/${data.id}`)}&text=${encodeURIComponent((data["Main Header"] || data.Headline || "").slice(0, 200))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Share on X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/article/${data.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Share on Facebook
          </a>
        </div>
        
        {data["Paragraph 1"] && <p className="mt-6 text-lg leading-relaxed">{data["Paragraph 1"]}</p>}
        
        {/* First Image - After Paragraph 1 */}
        {data["Hero Image URL"] && (
          <div className="my-8">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <ImageCarousel 
                images={[data["Hero Image URL"]]} 
                alt={data["Main Header"] || data.Headline || "Article image"} 
                aspectRatio="wide"
                showDots={false}
                showArrows={false}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}
        
        {data["Header 2"] && <h2 className="headline text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b-2 border-red-600">{data["Header 2"]}</h2>}
        {data["Paragraph 2"] && <p className="text-lg leading-relaxed">{data["Paragraph 2"]}</p>}
        
        {/* Inline Ad - After Paragraph 2 */}
        <div className="not-prose my-8">
          <AdSlot />
        </div>
        
        {/* Second Image - After Paragraph 2 */}
        {data.image2 && (
          <div className="my-8">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <ImageCarousel 
                images={[data.image2]} 
                alt={data["Main Header"] || data.Headline || "Article image 2"} 
                aspectRatio="wide"
                showDots={false}
                showArrows={false}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}
        
        {data["Header 3"] && <h3 className="headline text-xl font-bold text-slate-900 mt-8 mb-3">{data["Header 3"]}</h3>}
        {data["Paragraph 3"] && <p className="text-lg leading-relaxed">{data["Paragraph 3"]}</p>}
        
        {data["Header 4"] && <h4 className="headline text-xl font-bold text-slate-900 mt-8 mb-3">{data["Header 4"]}</h4>}
        {data["Paragraph 4"] && <p className="text-lg leading-relaxed">{data["Paragraph 4"]}</p>}
        
        {/* Inline Ad - After Paragraph 4 */}
        <div className="not-prose my-8">
          <AdSlot />
        </div>
        
        {/* Third Image - After Paragraph 4 */}
        {data.image3 && (
          <div className="my-8">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <ImageCarousel 
                images={[data.image3]} 
                alt={data["Main Header"] || data.Headline || "Article image 3"} 
                aspectRatio="wide"
                showDots={false}
                showArrows={false}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}
        
        {data["Header 5"] && <h5 className="headline text-xl font-bold text-slate-900 mt-8 mb-3">{data["Header 5"]}</h5>}
        {data["Paragraph 5"] && <p className="text-lg leading-relaxed">{data["Paragraph 5"]}</p>}
        
        {/* Related Articles - Mobile Only (at bottom) */}
        <div className="lg:hidden mt-12 not-prose">
          <RelatedArticles 
            currentArticleId={id} 
            section={data.Section} 
            category={data.Category}
            limit={4}
          />
        </div>
      </article>
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": data["Main Header"] || data.Headline,
            "description": data["Paragraph 1"]?.slice(0, 160),
            "image": data["Hero Image URL"] ? [data["Hero Image URL"]] : undefined,
            "author": {
              "@type": "Person",
              "name": data.Author
            },
            "publisher": {
              "@type": "Organization",
              "name": "The World Times",
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/logo.png`
              }
            },
            "datePublished": data.created_at,
            "dateModified": data.created_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${SITE_URL}/article/${id}`
            },
            "articleSection": data.Section,
            "keywords": data.Category && data.Section ? [data.Category, data.Section] : undefined
          })
        }}
      />
      <aside className="hidden lg:block space-y-6 sticky top-8 self-start">
        <RelatedArticles 
          currentArticleId={id} 
          section={data.Section} 
          category={data.Category}
          limit={5}
        />
      </aside>
    </div>
  );
}


