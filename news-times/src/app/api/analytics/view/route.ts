import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    
    if (!articleId || typeof articleId !== 'number') {
      return NextResponse.json({ error: "Valid article ID required" }, { status: 400 });
    }

    const supabase = getServerSupabaseClient();
    
    // Get client IP for basic deduplication (optional)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Record the view
    const { error } = await supabase
      .from('article_views')
      .insert({
        article_id: articleId,
        viewed_at: new Date().toISOString(),
        ip_hash: clientIP // Simple IP tracking (you could hash this for privacy)
      });

    if (error) {
      console.error('View tracking error:', error);
      return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
    }

    // Increment the view count using the secure function
    const { data: newCount, error: updateError } = await supabase
      .rpc('increment_article_view_count', { target_article_id: articleId });

    if (updateError) {
      console.error('View count update error:', updateError);
      console.error('Error details:', updateError.message, updateError.details);
    } else {
      console.log(`View count updated to: ${newCount} for article ${articleId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
