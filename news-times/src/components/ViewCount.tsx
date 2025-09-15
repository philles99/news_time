'use client';

import { useEffect, useState } from 'react';

interface ViewCountProps {
  articleId: number;
  className?: string;
}

interface ViewStats {
  totalViews: number;
  recentViews: number;
}

export default function ViewCount({ articleId, className = "" }: ViewCountProps) {
  const [stats, setStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/analytics/stats?articleId=${articleId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch view stats:', error);
        // Set a minimal stats object to prevent showing nothing
        setStats({ totalViews: 0, recentViews: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [articleId]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  if (!stats || stats.totalViews === 0) {
    return null;
  }

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {stats.totalViews.toLocaleString()} view{stats.totalViews !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
