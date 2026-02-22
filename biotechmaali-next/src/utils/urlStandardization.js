'use client';

/**
 * URL Standardization Utilities for Gidan Store
 * 
 * Ensures consistent URL formatting across the application:
 * - Lowercase URLs
 * - Hyphen-separated words
 * - Consistent trailing slash handling
 * - Clean, SEO-friendly paths
 */

/**
 * Standardizes a URL path by ensuring consistent formatting
 * 
 * @param {string} path - The URL path to standardize
 * @param {boolean} addTrailingSlash - Whether to add trailing slash (default: true)
 * @returns {string} - Standardized URL path
 */
export const standardizeUrl = (path, addTrailingSlash = true) => {
    if (!path) return '/';

    let cleanPath = path;

    // Remove leading slash if present (we'll add it back)
    cleanPath = cleanPath.replace(/^\/+/, '');

    // Remove trailing slashes
    cleanPath = cleanPath.replace(/\/+$/, '');

    // Convert to lowercase
    cleanPath = cleanPath.toLowerCase();

    // Replace multiple slashes with single slash
    cleanPath = cleanPath.replace(/\/+/g, '/');

    // Add leading slash
    cleanPath = '/' + cleanPath;

    // Add trailing slash if requested and path is not root
    if (addTrailingSlash && cleanPath !== '/') {
        cleanPath += '/';
    }

    return cleanPath;
};

/**
 * Builds a product URL with consistent formatting
 * 
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug (optional)
 * @param {string} productSlug - Product slug
 * @returns {string} - Standardized product URL
 */
export const buildProductUrl = (categorySlug, subcategorySlug, productSlug) => {
    if (!categorySlug || !productSlug) {
        console.warn('buildProductUrl: Missing required slugs', { categorySlug, subcategorySlug, productSlug });
        return '/';
    }

    const parts = [categorySlug];

    if (subcategorySlug) {
        parts.push(subcategorySlug);
    }

    parts.push(productSlug);

    // Join with slashes and standardize
    const path = parts.join('/');
    return standardizeUrl(path, true);
};

/**
 * Builds a category URL with consistent formatting
 * 
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug (optional)
 * @returns {string} - Standardized category URL
 */
export const buildCategoryUrl = (categorySlug, subcategorySlug = null) => {
    if (!categorySlug) {
        console.warn('buildCategoryUrl: Missing category slug');
        return '/';
    }

    const parts = [categorySlug];

    if (subcategorySlug) {
        parts.push(subcategorySlug);
    }

    const path = parts.join('/');
    return standardizeUrl(path, true);
};

/**
 * Normalizes a slug to be URL-friendly
 * 
 * @param {string} slug - The slug to normalize
 * @returns {string} - Normalized slug
 */
export const normalizeSlug = (slug) => {
    if (!slug) return '';

    return slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric except hyphens
        .replace(/-+/g, '-')            // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens
};

/**
 * Validates if a URL follows our standardization rules
 * 
 * @param {string} url - The URL to validate
 * @returns {object} - Validation result with isValid and issues array
 */
export const validateUrl = (url) => {
    const issues = [];

    if (!url) {
        return { isValid: false, issues: ['URL is empty'] };
    }

    // Check for uppercase letters
    if (url !== url.toLowerCase()) {
        issues.push('URL contains uppercase letters');
    }

    // Check for spaces
    if (url.includes(' ')) {
        issues.push('URL contains spaces');
    }

    // Check for multiple consecutive slashes
    if (/\/\/+/.test(url)) {
        issues.push('URL contains multiple consecutive slashes');
    }

    // Check for special characters (except hyphens and slashes)
    if (/[^a-z0-9\-\/]/.test(url)) {
        issues.push('URL contains special characters');
    }

    return {
        isValid: issues.length === 0,
        issues
    };
};

/**
 * Redirects to a standardized version of the current URL if needed
 * Used in components to ensure URL consistency
 * 
 * @param {string} currentPath - Current URL path
 * @param {function} navigate - React Router navigate function
 * @param {object} state - Optional state to pass with navigation
 * @returns {boolean} - True if redirect was performed
 */
export const redirectToStandardUrl = (currentPath, navigate, state = null) => {
    const standardPath = standardizeUrl(currentPath, true);

    if (currentPath !== standardPath) {
        console.log('Redirecting to standard URL:', { from: currentPath, to: standardPath });
        navigate(standardPath, { replace: true, state });
        return true;
    }

    return false;
};

/**
 * Gets the canonical URL for a page
 * 
 * @param {string} path - The page path
 * @param {string} baseUrl - Base URL (default: https://www.gidan.store/)
 * @returns {string} - Full canonical URL
 */
export const getCanonicalUrl = (path, baseUrl = 'https://www.gidan.store/') => {
    const standardPath = standardizeUrl(path, false); // No trailing slash for canonical
    return `${baseUrl}${standardPath}`;
};

/**
 * Common route patterns for the application
 */
export const ROUTE_PATTERNS = {
    HOME: '/',
    CATEGORY: '/:categorySlug/',
    SUBCATEGORY: '/:categorySlug/:subcategorySlug/',
    PRODUCT: '/:categorySlug/:subcategorySlug/:productSlug/',
    CART: '/cart/',
    CHECKOUT: '/checkout/',
    PROFILE: '/profile/',
    ORDERS: '/orders/',
    WISHLIST: '/wishlist/',
    STORES: '/stores/',
    CONTACT: '/contact-us/',
    ABOUT: '/about-us/',
};

/**
 * Helper to check if a path matches a pattern
 * 
 * @param {string} path - The path to check
 * @param {string} pattern - The pattern to match against
 * @returns {boolean} - True if path matches pattern
 */
export const matchesPattern = (path, pattern) => {
    const patternRegex = pattern
        .replace(/:[^/]+/g, '[^/]+')  // Replace :param with regex
        .replace(/\//g, '\\/');        // Escape slashes

    return new RegExp(`^${patternRegex}$`).test(path);
};

export default {
    standardizeUrl,
    buildProductUrl,
    buildCategoryUrl,
    normalizeSlug,
    validateUrl,
    redirectToStandardUrl,
    getCanonicalUrl,
    ROUTE_PATTERNS,
    matchesPattern
};
