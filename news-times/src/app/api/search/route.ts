import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ articles: [] });
  }

  const supabase = getServerSupabaseClient();
  
  // Search across headline, main header, and paragraph content
  const { data, error } = await supabase
    .from("Published")
    .select(`
      id,
      "Main Header",
      Headline,
      "Paragraph 1",
      Author,
      Category,
      Section,
      created_at,
      "Hero Image URL",
      image2,
      image3
    `)
    .or(`"Main Header".ilike.%${query}%,Headline.ilike.%${query}%,"Paragraph 1".ilike.%${query}%,"Paragraph 2".ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  // Transform data to match our article format
  const articles = (data || []).map((item) => ({
    id: item.id,
    title: item["Main Header"] || item.Headline || "Untitled",
    subtitle: item["Paragraph 1"] || "",
    author: item.Author,
    category: item.Category,
    section: item.Section,
    createdAtISO: item.created_at,
    imageUrl: item["Hero Image URL"],
    image2: item.image2,
    image3: item.image3,
  }));

  return NextResponse.json({ articles });
}
