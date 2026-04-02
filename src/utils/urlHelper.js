import slugify from 'slugify';

export const convertToSlug = (text) => {
    if (!text) return "";
    return slugify(text, {
        replacement: '-',    // replace spaces with '-'
        remove: /[*+~.()'"!:@]/g, // regex to remove specific unwanted characters
        lower: true,         // result in lower case
        strict: false,       // strip special characters except replacement, set to true for stricter removal
        locale: 'vi',       // language code of your locale (optional, helps with accents)
        trim: true           // trim leading and trailing replacement chars
    });
};


/**
 * Helper to extract a plain string from a slug value that could be a string or an object.
 */
export const toSlugString = (val) => {
    if (!val) return "";

    // Defensive check: If the input is a string that looks like it has a query param or hash, strip it
    // Example: "okra-seeds?variant=370" -> "okra-seeds"
    let rawVal = "";
    if (typeof val === 'string') {
        rawVal = val.split(/[?#]/)[0];
    } else {
        // Handle nested objects from backend (e.g., category: { name: "..." } or category: "name")
        const extracted = val?.slug || val?.name || "";
        rawVal = typeof extracted === 'string' ? extracted.split(/[?#]/)[0] : "";
    }

    return convertToSlug(rawVal);
};


/**
 * Convert a relative URL to an absolute URL using the base URL.
 * 
 * @param {string} path - Relative path (e.g., "/logo.webp")
 * @returns {string} - Absolute URL
 */
export const toAbsoluteUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) return path;

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gidan.store";

    // Remove trailing slash from baseUrl if present
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBaseUrl}${normalizedPath}`;
};

export const getProductUrl = (product, includeVariant = false) => {
    if (!product) return "/";

    // 1. Extract Category Slug
    // Priority: category_slug > category_name > category (as object or name) > default 'all'
    let catVal = product.category_slug || product.category_name || product.category;
    let category_slug = toSlugString(catVal);
    if (!category_slug) category_slug = "all";

    // 2. Extract Subcategory Slug
    // Priority: sub_category_slug > sub_category_name > subcategory > sub_category > default 'all'
    let subCatVal = product.sub_category_slug || product.sub_category_name || product.subcategory || product.sub_category;
    let sub_category_slug = toSlugString(subCatVal);
    if (!sub_category_slug) sub_category_slug = "all";

    // 3. Extract Product Slug
    // Priority: slug > product_slug > product_name (slugified name as ultimate fallback)
    let pSlug = product.slug || product.product_slug;
    let product_slug = toSlugString(pSlug);
    
    // Ultimate fallback for order items that only have a name
    if (!product_slug) {
        product_slug = toSlugString(product.product_name || product.name);
    }

    // 4. Return formatted URL or extreme fallback
    if (!category_slug || !product_slug) {
        const productId = product.product_id || product.id || product.variant_id;
        if (productId) return `/productdata/${productId}/`;
        return "/";
    }

    // Conditionally include variant ID for consistency and state preservation
    const variantId = product.id || product.variant_id;
    const variantSuffix = (includeVariant && variantId) ? `?variant=${variantId}` : "";

    // No trailing slash before query parameter
    return `/${category_slug}/${sub_category_slug}/${product_slug}${variantSuffix ? variantSuffix : '/'}`;
};
