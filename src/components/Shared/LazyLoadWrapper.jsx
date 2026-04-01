'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Advanced Lazy Load Wrapper
 * Only renders children when component enters viewport
 * Reduces initial bundle size and improves performance
 */
const LazyLoadWrapper = ({
  children,
  height = '200px',
  rootMargin = '100px',
  threshold = 0.01,
  placeholder = null,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setHasMounted(true);

    // If it was already rendered by SSR, we might want to keep it
    // But to truly lazy load on client, we need to observe.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  // Logic: 
  // 1. On Server (!hasMounted): Render children for SEO.
  // 2. On Client Initial Render (!hasMounted): Render children to match server.
  // 3. On Client Post-Mount: 
  //    - If shouldRender is true (is in view), render children.
  //    - If shouldRender is false (not yet in view), render children IF they were already there from SSR?
  //      To avoid the flash, we can't hide them once they've been hydrated.
  //      However, the current goal is to only lazy load strictly if NOT SSR'd.
  //      Since we WANT SSR integrity, we will render children if !hasMounted.
  //      To avoid the flash on hydration:

  // Heuristic: once it's rendered (via SSR/Hydration), we keep it visible.
  // This avoids the "flicker/disappear" bug where hydration matches SSR, 
  // then useEffect runs and flips it back to hidden until the observer triggers.
  const [everRendered, setEverRendered] = useState(false);
  
  // Update everRendered if we are in the initial mount phase (SSR/Hydration)
  if (!hasMounted && !everRendered) {
    setEverRendered(true);
  }

  const effectivelyInView = shouldRender || !hasMounted || everRendered;

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ease-in-out ${effectivelyInView ? 'opacity-100' : 'opacity-0'}`}
      style={effectivelyInView ? undefined : { minHeight: height }}
    >
      {effectivelyInView ? (
        children
      ) : (
        placeholder || (
          <div
            className="w-full bg-site-bg animate-pulse"
            style={{ height }}
          />
        )
      )}
    </div>
  );
};

export default LazyLoadWrapper;
