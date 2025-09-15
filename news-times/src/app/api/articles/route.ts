import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 50);
  const category = searchParams.get("category");
  const section = searchParams.get("section");

  const supabase = getServerSupabaseClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;
  
  let query = supabase
    .from("Published")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply category filter if provided
  if (category) {
    query = query.eq("Category", category);
  }

  // Apply section filter if provided
  if (section) {
    query = query.eq("Section", section);
  }

  const { data, error } = await query.range(from, to);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}


