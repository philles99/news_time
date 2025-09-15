import { NextResponse } from "next/server";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("Published")
    .select("id, \"Main Header\", Headline, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  const items = (data || []).map((a) => {
    const title = a["Main Header"] || a.Headline || "Untitled";
    const link = `${SITE_URL}/article/${a.id}`;
    const pubDate = new Date(a.created_at).toUTCString();
    return `<item><title><![CDATA[${title}]]></title><link>${link}</link><guid>${link}</guid><pubDate>${pubDate}</pubDate></item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Latest articles</description>
    ${items.join("\n")} 
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}


