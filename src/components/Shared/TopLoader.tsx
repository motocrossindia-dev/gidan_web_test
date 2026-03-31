'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading when pathname or searchParams change
    setIsLoading(true);
    
    // Simulate navigation end (since Next.js App Router doesn't have route change events)
    // In a real scenario, the loading state is managed by the loading.tsx file
    // But for a top bar, we can hide it after a short delay or when the component re-renders
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ width: '0%', opacity: 1 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-1 bg-[#375421] z-[9999] shadow-[0_0_10px_rgba(55,84,33,0.5)]"
        />
      )}
    </AnimatePresence>
  );
}
