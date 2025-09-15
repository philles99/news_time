The World Times — Next.js + Supabase news site

Setup

1. Create a Supabase project and a table named `Published` with your schema.
2. Copy `env.example` to `.env.local` and fill values:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optional server fallbacks
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Install and run:

```
npm install
npm run dev
```

Key routes

- `/` — Homepage feed with infinite scroll and interleaved ad slots
- `/article/[id]` — Article page with sidebar ad slots and SEO
- `/category/[Category]` — Filter by continent
- `/section/[Section]` — Filter by section (Politics, Economics, Elections, Trade, Finance, Sport, Culture, World Events)
- `/demo-article` — Static demo article
 - `/rss.xml` — RSS feed

Ads

- Replace `AdSlot` components with your ad network tags.
2