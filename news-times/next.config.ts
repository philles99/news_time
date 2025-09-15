import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.dailystar.co.uk" },
      { protocol: "https", hostname: "i2-prod.dailystar.co.uk" },
      { protocol: "https", hostname: "d.newsweek.com" },
      { protocol: "https", hostname: "media2.foxnews.com" },
      { protocol: "http", hostname: "media2.foxnews.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
      // Add more domains as needed
    ],
  },
};

export default nextConfig;
