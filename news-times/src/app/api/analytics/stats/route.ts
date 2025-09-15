import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json({ error: "Article ID required" }, { status: 400 });
  }

  const supabase = getServerSupabaseClient();

  try {
    // Get the view count from the Published table (most reliable)
    const { data: publishedData, error: publishedError } = await supabase
      .from('Published')
      .select('view_count')
      .eq('id', parseInt(articleId))
      .single();

    // Get detailed views for recent stats
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const { data: recentViews, error: recentError } = await supabase
      .from('article_views')
      .select('id')
      .eq('article_id', parseInt(articleId))
      .gte('viewed_at', yesterday.toISOString());

    if (publishedError) {
      console.error('Published table query error:', publishedError);
      return NextResponse.json({ error: "Failed to get view count" }, { status: 500 });
    }

    if (recentError) {
      console.error('Recent views query error:', recentError);
    }

    return NextResponse.json({
      totalViews: publishedData?.view_count || 0,
      recentViews: recentViews?.length || 0,
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
