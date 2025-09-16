import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerAd from "@/components/ads/BannerAd";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const headlineSerif = Merriweather({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: {
    default: "The World Times",
    template: "%s | The World Times",
  },
  description: "Independent reporting on politics, economics, culture and world events.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logo.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "The World Times",
    description: "Independent reporting on politics, economics, culture and world events.",
    url: "https://theworld-times.com",
    siteName: "The World Times",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The World Times Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The World Times",
    description: "Independent reporting on politics, economics, culture and world events.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9566106160234103" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${headlineSerif.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}>
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-4">
          <BannerAd />
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <BannerAd />
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
