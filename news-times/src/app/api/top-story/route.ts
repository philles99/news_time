import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabaseClient();
  
  try {
    // Get the most viewed article from the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

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
        image3,
        view_count
      `)
      .gte('created_at', yesterday.toISOString())
      .not('view_count', 'is', null)
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Top story query error:', error);
      return NextResponse.json({ error: "Failed to get top story" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      // Fallback: get the most recent article if no views today
      const { data: fallbackData, error: fallbackError } = await supabase
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
          image3,
          view_count
        `)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fallbackError || !fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ topStory: null });
      }

      const fallbackArticle = fallbackData[0];
      return NextResponse.json({
        topStory: {
          id: fallbackArticle.id,
          title: fallbackArticle["Main Header"] || fallbackArticle.Headline || "Untitled",
          subtitle: fallbackArticle["Paragraph 1"] || "",
          author: fallbackArticle.Author,
          category: fallbackArticle.Category,
          section: fallbackArticle.Section,
          createdAtISO: fallbackArticle.created_at,
          imageUrl: fallbackArticle["Hero Image URL"],
          image2: fallbackArticle.image2,
          image3: fallbackArticle.image3,
          viewCount: fallbackArticle.view_count || 0,
        }
      });
    }

    const topArticle = data[0];
    return NextResponse.json({
      topStory: {
        id: topArticle.id,
        title: topArticle["Main Header"] || topArticle.Headline || "Untitled",
        subtitle: topArticle["Paragraph 1"] || "",
        author: topArticle.Author,
        category: topArticle.Category,
        section: topArticle.Section,
        createdAtISO: topArticle.created_at,
        imageUrl: topArticle["Hero Image URL"],
        image2: topArticle.image2,
        image3: topArticle.image3,
        viewCount: topArticle.view_count || 0,
      }
    });
  } catch (error) {
    console.error('Top story error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
