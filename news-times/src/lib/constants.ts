export const SITE_NAME = "The World Times";
export const SITE_DESCRIPTION =
  "Independent reporting on politics, economics, culture and world events.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SECTIONS = [
  "Politics",
  "Economics",
  "Elections",
  "Trade",
  "Finance",
  "Sport",
  "Culture",
  "World Events",
] as const;

export const CATEGORIES = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
  "Middle East",
] as const;

export type Section = (typeof SECTIONS)[number];
export type Category = (typeof CATEGORIES)[number];


