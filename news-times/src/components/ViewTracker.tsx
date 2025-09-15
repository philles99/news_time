'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  articleId: number;
}

export default function ViewTracker({ articleId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after component mounts (user has loaded the article)
    const trackView = async () => {
      try {
        await fetch('/api/analytics/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articleId }),
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    // Delay tracking slightly to ensure it's a real view
    const timeoutId = setTimeout(trackView, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [articleId]);

  // This component doesn't render anything
  return null;
}
