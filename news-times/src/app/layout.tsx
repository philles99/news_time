import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerAd from "@/components/ads/BannerAd";

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
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
