import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getServerSupabaseClient();
  
  // Get all articles
  const { data: articles } = await supabase
    .from("Published")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // Get all sections
  const { data: sections } = await supabase
    .from("Published")
    .select("Section")
    .not("Section", "is", null);

  const uniqueSections = [...new Set(sections?.map(s => s.Section) || [])];

  const sitemap: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    // Section pages
    ...uniqueSections.map(section => ({
      url: `${SITE_URL}/section/${encodeURIComponent(section)}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })),
    // Article pages
    ...(articles || []).map(article => ({
      url: `${SITE_URL}/article/${article.id}`,
      lastModified: new Date(article.created_at),
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];

  return sitemap;
}


