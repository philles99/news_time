'use client';

import Link from "next/link";
import { SECTIONS, SITE_NAME } from "@/lib/constants";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="accent-bar"></div>
      <header className="text-white sticky top-0 z-50 shadow-lg" style={{backgroundColor: '#101435'}}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="hover:scale-105 transition-transform">
              <img 
                src="/logo.png" 
                alt="The World Times" 
                className="h-24 w-auto"
              />
            </Link>
            
            {/* Search Box - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBox />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 text-sm">
              {SECTIONS.map((s) => (
                <Link key={s} href={`/section/${encodeURIComponent(s)}`} className="text-gray-300 hover:text-white transition-colors font-medium relative group">
                  {s.replace("World Events", "World")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-1 p-2"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-6 pt-6 border-t border-gray-700 space-y-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBox />
              </div>
              
              {/* Mobile Menu Links */}
              <div className="grid grid-cols-2 gap-4">
                {SECTIONS.map((s) => (
                  <Link 
                    key={s} 
                    href={`/section/${encodeURIComponent(s)}`} 
                    className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-3 rounded hover:bg-blue-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {s.replace("World Events", "World")}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}