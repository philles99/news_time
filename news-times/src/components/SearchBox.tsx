'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatRelativeTimeFromNow } from '@/lib/format';

interface SearchResult {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  section: string;
  createdAtISO: string;
  imageUrl?: string;
  image2?: string;
  image3?: string;
}

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await response.json();
        setResults(data.articles || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <>
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  onClick={handleResultClick}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex gap-3">
                    {article.imageUrl && (
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {article.category && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {article.category}
                          </span>
                        )}
                        {article.section && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {article.section}
                          </span>
                        )}
                        <span className="truncate">{formatRelativeTimeFromNow(article.createdAtISO)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-3 text-center border-t border-gray-100">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all results for &quot;{query}&quot;
                </Link>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No articles found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
