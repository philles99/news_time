"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import HomepageLayout from "@/components/HomepageLayout";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";

type Article = any;

const PAGE_SIZE = 10;

interface InfiniteFeedProps {
  initial: Article[];
  section?: string;
}

export default function InfiniteFeed({ initial, section }: InfiniteFeedProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Article[]>(initial);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initial.length === PAGE_SIZE);
  const isFetchingRef = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Reset when filters change
  useEffect(() => {
    setItems(initial);
    setPage(1);
    setHasMore(initial.length === PAGE_SIZE);
  }, [initial, searchParams]);

  useEffect(() => {
    if (!endRef.current || !hasMore) return;
    const target = endRef.current;

    const onIntersect: IntersectionObserverCallback = async (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting || isFetchingRef.current) return;

      isFetchingRef.current = true;
      try {
        const category = searchParams.get('category');
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: PAGE_SIZE.toString(),
        });
        
        if (category) params.set('category', category);
        if (section) params.set('section', section);
        
        const res = await fetch(`/api/articles?${params.toString()}`);
        const json = await res.json();
        const newItems = (json.items as Article[]) || [];
        
        if (newItems.length > 0) {
          setItems((prev) => [...prev, ...newItems]);
          setPage((p) => p + 1);
          if (newItems.length < PAGE_SIZE) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching more articles:', error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [page, hasMore]);

  return (
    <div className="flex flex-col gap-6">
      <HomepageLayout items={items} />
      {hasMore && <div ref={endRef} />}
      {isFetchingRef.current && <FeedSkeleton count={2} />}
      {!hasMore && (
        <div className="text-xs text-center text-black/50 dark:text-white/50">End of feed</div>
      )}
    </div>
  );
}


