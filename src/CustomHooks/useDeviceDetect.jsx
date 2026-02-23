'use client';

import { useMediaQuery } from 'react-responsive';

const useDeviceDetect = () => {
  // Mobile first breakpoints following common device sizes
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px) and (max-width: 1439px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1440px)' });

  // Orientation detection
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isLandscape = useMediaQuery({ query: '(orientation: landscape)' });

  // Combined queries for more general use cases
  const isMobileOrTablet = useMediaQuery({ query: '(max-width: 1023px)' });
  const isTabletOrLaptop = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1439px)' });
  const isLaptopOrDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  // High-resolution displays
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  // Hover capability detection
  const hasHoverSupport = useMediaQuery({ query: '(hover: hover)' });

  // Preferred color scheme
  const prefersDarkMode = useMediaQuery({ query: '(prefers-color-scheme: dark)' });
  const prefersLightMode = useMediaQuery({ query: '(prefers-color-scheme: light)' });

  // Device brand detection (OnePlus, Nothing)
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  // const isOnePlus = /ONEPLUS|OnePlus/i.test(userAgent);
  // const isNothingPhone = /Nothing|NOTHING/i.test(userAgent);

  // Helper function to get current device type
  const getDeviceType = () => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isLaptop) return 'laptop';
    return 'desktop';
  };

  return {
    // Basic device types
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    
    // Orientation
    isPortrait,
    isLandscape,
    
    // Combined queries
    isMobileOrTablet,
    isTabletOrLaptop,
    isLaptopOrDesktop,
    
    // Display features
    isRetina,
    hasHoverSupport,
    
    // Color scheme preferences
    prefersDarkMode,
    prefersLightMode,
    
    // Brand-specific
    // isOnePlus,
    // isNothingPhone,
    
    // Helper method
    getDeviceType,
  };
};

export default useDeviceDetect;