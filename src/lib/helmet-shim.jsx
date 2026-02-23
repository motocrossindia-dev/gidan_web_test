'use client';

/**
 * Helmet Shim for Next.js
 * 
 * Replaces react-helmet and react-helmet-async with a Next.js-compatible
 * implementation using the built-in <head> support (next/head was removed
 * in App Router, but we can use DOM manipulation for client components).
 * 
 * For proper SSR SEO, use `export const metadata` or `generateMetadata()` 
 * in your page.tsx files instead.
 */

import React, { useEffect } from 'react';

function Helmet({ children }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Parse children to extract title and meta tags
    const elements = React.Children.toArray(children);
    const cleanups = [];

    elements.forEach((child) => {
      if (!React.isValidElement(child)) return;

      if (child.type === 'title') {
        const prevTitle = document.title;
        document.title = child.props.children || '';
        cleanups.push(() => { document.title = prevTitle; });
      } else if (child.type === 'meta') {
        const meta = document.createElement('meta');
        Object.entries(child.props).forEach(([key, value]) => {
          if (key !== 'children') {
            meta.setAttribute(key === 'className' ? 'class' : key, value);
          }
        });
        meta.setAttribute('data-helmet', 'true');
        document.head.appendChild(meta);
        cleanups.push(() => { 
          if (meta.parentNode) meta.parentNode.removeChild(meta); 
        });
      } else if (child.type === 'link') {
        const link = document.createElement('link');
        Object.entries(child.props).forEach(([key, value]) => {
          if (key !== 'children') {
            link.setAttribute(key === 'className' ? 'class' : key, value);
          }
        });
        link.setAttribute('data-helmet', 'true');
        document.head.appendChild(link);
        cleanups.push(() => { 
          if (link.parentNode) link.parentNode.removeChild(link); 
        });
      } else if (child.type === 'script') {
        const script = document.createElement('script');
        Object.entries(child.props).forEach(([key, value]) => {
          if (key === 'children' || key === 'dangerouslySetInnerHTML') return;
          script.setAttribute(key === 'className' ? 'class' : key, value);
        });
        if (child.props.dangerouslySetInnerHTML) {
          script.innerHTML = child.props.dangerouslySetInnerHTML.__html || '';
        } else if (typeof child.props.children === 'string') {
          script.innerHTML = child.props.children;
        }
        script.setAttribute('data-helmet', 'true');
        document.head.appendChild(script);
        cleanups.push(() => { 
          if (script.parentNode) script.parentNode.removeChild(script); 
        });
      }
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [children]);

  return null;
}

// HelmetProvider is a no-op — Next.js handles head management natively
function HelmetProvider({ children }) {
  return <>{children}</>;
}

export { Helmet, HelmetProvider };
export default Helmet;
