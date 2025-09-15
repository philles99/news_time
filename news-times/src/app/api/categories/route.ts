import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from("Published")
      .select("Category")
      .not("Category", "is", null)
      .not("Category", "eq", "");

    if (error) {
      console.error('Categories query error:', error);
      return NextResponse.json({ error: "Failed to get categories" }, { status: 500 });
    }

    // Get unique categories and sort them
    const categories = [...new Set(data?.map(item => item.Category).filter(Boolean))]
      .sort();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
