"use client";

import { useState, useEffect } from "react";

interface HydrationDebugProps {
  name: string;
  children: React.ReactNode;
}

export default function HydrationDebug({ name, children }: HydrationDebugProps) {
  const [isClient, setIsClient] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    console.log(`🔍 ${name}: Client-side effect ran`);
  }, [name]);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`🔍 ${name}: Render #${renderCount + 1}, isClient: ${isClient}`);
  });

  return (
    <div data-debug={name} data-is-client={isClient} data-render-count={renderCount}>
      {children}
    </div>
  );
}
