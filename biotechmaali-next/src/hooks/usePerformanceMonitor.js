'use client';

import { useEffect } from 'react';

/**
 * Performance Monitoring Hook
 * Tracks Web Vitals and sends to analytics
 */
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Report Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry);
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }, []);
};

/**
 * Component Performance Tracker
 * Measures component render time
 */
export const useComponentPerformance = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};
