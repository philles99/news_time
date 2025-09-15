import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return NextResponse.json({
    hasUrl: Boolean(url && url.length > 0),
    hasKey: Boolean(key && key.length > 0),
  });
}


