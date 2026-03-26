'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Optimized Image Component
 * Features:
 * - Lazy loading with Intersection Observer
 * - WebP format with fallback
 * - Blur placeholder
 * - Responsive images
 * - Error handling
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  placeholder = 'blur',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate WebP URL (assumes your API can serve WebP)
  const getWebPUrl = (url) => {
    if (!url) return '';
    // If URL already has extension, replace it with .webp
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const imageSrc = `${process.env.NEXT_PUBLIC_API_URL}${src}`;
  const webpSrc = getWebPUrl(imageSrc);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ filter: 'blur(10px)' }}
        />
      )}

      {/* Actual image */}
      {isInView && !error && (
        <picture>
          {/* WebP format for modern browsers */}
          <source srcSet={webpSrc} type="image/webp" />
          
          {/* Fallback to original format */}
          <img
            src={imageSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectFit: objectFit,
            }}
          />
        </picture>
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-site-bg">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
