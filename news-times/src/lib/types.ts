export type PublishedArticle = {
  id: number;
  created_at: string;
  Headline: string | null;
  "Main Header": string | null;
  "Paragraph 1": string | null;
  "Header 2": string | null;
  "Paragraph 2": string | null;
  "Header 3": string | null;
  "Paragraph 4": string | null;
  Author: string | null;
  Category: string | null; // continent
  Section: string | null; // Politics, Economics, Elections, Trade, Finance, Sport, Culture, World Events
};

export type ArticleCardData = {
  id: number;
  title: string;
  subtitle?: string;
  author?: string;
  category?: string;
  section?: string;
  createdAtISO: string;
  imageUrl?: string | null;
};


