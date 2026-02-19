'use client';

/**
 * Chrome Compatibility Fixes for OnePlus and Android Devices
 * This utility provides comprehensive fixes for Chrome-specific issues
 */

export const applyChromeCompatibilityFixes = () => {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isOnePlus = /ONEPLUS|OnePlus/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (!isChrome || !isAndroid) return;

  console.log('Applying Chrome compatibility fixes for Android device');

  // Fix 1: Hardware Acceleration
  const enableHardwareAcceleration = () => {
    document.body.style.transform = 'translateZ(0)';
    document.body.style.webkitTransform = 'translateZ(0)';
    document.body.style.backfaceVisibility = 'hidden';
    document.body.style.perspective = '1000px';
  };

  // Fix 2: Touch Event Optimization
  const optimizeTouchEvents = () => {
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add passive listeners for better performance
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    document.addEventListener('touchend', () => {}, { passive: true });
  };

  // Fix 3: Viewport and Scaling Issues
  const fixViewportIssues = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no'
      );
    }

    // Fix for Chrome's 100vh issue
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  };

  // Fix 4: CSS Injections for Better Rendering
  const injectChromeCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Chrome Android/OnePlus Specific Fixes */
      
      /* Font rendering */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Body fixes */
      body {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      
      /* Touch target improvements */
      button, a, input, select, textarea, [role="button"] {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* Scrolling containers */
      .scroll-container, [data-scroll], .overflow-auto, .overflow-scroll {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      
      /* Image rendering */
      img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        max-width: 100%;
        height: auto;
      }
      
      /* Fix for Chrome's flexbox issues */
      .flex, [class*="flex-"] {
        min-height: 0;
        min-width: 0;
      }
      
      /* Fix for Chrome's position: sticky issues */
      .sticky {
        position: -webkit-sticky;
        position: sticky;
      }
      
      /* Fix for Chrome's transform issues */
      .transform-gpu {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      /* Fix for Chrome's animation performance */
      .animate, [class*="animate-"] {
        will-change: transform;
        backface-visibility: hidden;
      }
      
      /* Fix for Chrome's input zoom on focus */
      input, select, textarea {
        font-size: 16px;
      }
      
      /* Fix for Chrome's 100vh issue */
      .h-screen, .min-h-screen {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
      }
      
      /* Fix for Chrome's overflow hidden issues */
      .overflow-hidden {
        overflow: hidden !important;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Fix for Chrome's z-index stacking context */
      .z-index-fix {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
  };

  // Fix 5: Performance Optimizations
  const optimizePerformance = () => {
    // Use requestIdleCallback for non-critical operations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Clean up potential memory leaks
        if (window.gc) {
          window.gc();
        }
      });
    }

    // Optimize scroll performance
    let ticking = false;
    const updateScroll = () => {
      // Handle scroll updates efficiently
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  };

  // Fix 6: OnePlus Specific Fixes
  const applyOnePlusFixes = () => {
    if (!isOnePlus) return;

    console.log('Applying OnePlus-specific Chrome fixes');

    // Fix for OnePlus OxygenOS specific issues
    const onePlusStyle = document.createElement('style');
    onePlusStyle.textContent = `
      /* OnePlus OxygenOS specific fixes */
      
      /* Fix for OnePlus gesture navigation conflicts */
      body {
        overscroll-behavior: none;
        -webkit-overscroll-behavior: none;
      }
      
      /* Fix for OnePlus status bar issues */
      .status-bar-fix {
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      /* Fix for OnePlus screen refresh rate issues */
      * {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      /* Fix for OnePlus touch sensitivity */
      button, a {
        min-height: 44px;
        min-width: 44px;
      }
    `;
    document.head.appendChild(onePlusStyle);
  };

  // Apply all fixes
  enableHardwareAcceleration();
  optimizeTouchEvents();
  fixViewportIssues();
  injectChromeCSS();
  optimizePerformance();
  applyOnePlusFixes();

  // Return cleanup function
  return () => {
    // Cleanup if needed
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent.includes('Chrome Android/OnePlus Specific Fixes')) {
        style.remove();
      }
    });
  };
};

// Export for use in components
export default applyChromeCompatibilityFixes; 