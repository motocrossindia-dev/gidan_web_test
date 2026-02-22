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
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once loaded
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} style={{ minHeight: isInView ? 'auto' : height }}>
      {isInView ? (
        children
      ) : (
        placeholder || (
          <div
            className="w-full bg-gray-100 animate-pulse"
            style={{ height }}
          />
        )
      )}
    </div>
  );
};

export default LazyLoadWrapper;
