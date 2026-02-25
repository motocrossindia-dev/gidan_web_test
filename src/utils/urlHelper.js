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
    if (typeof val === 'string') return convertToSlug(val);

    // Handle nested objects from backend (e.g., category: { name: "..." } or category: "name")
    const rawVal = val?.slug || val?.name || (typeof val === 'string' ? val : "");
    return convertToSlug(rawVal);
};

/**
 * Generates a standardized, crawlable 3-segment product URL.
 * Pattern: /:category/:subcategory/:productSlug/?variant=ID
 * 
 * @param {Object} product - Product data object
 * @param {boolean} [includeVariant=false] - Whether to include the ?variant= query parameter
 * @returns {string} - Formatted URL
 */
export const getProductUrl = (product, includeVariant = false) => {
    if (!product) return "/";

    // 1. Extract Category Slug
    const category_slug = toSlugString(product.category_slug || product.category);

    // 2. Extract Subcategory Slug (default to 'all' if missing)
    let sub_category_slug = toSlugString(product.sub_category_slug || product.subcategory || product.sub_category);
    if (!sub_category_slug) sub_category_slug = "all";

    // 3. Extract Product Slug
    // Priority: main_product.slug -> main_product_slug -> main_product_name -> name -> product.slug (absolute fallback)
    const product_slug =
        toSlugString(product.main_product?.slug || product.main_product_slug) ||
        toSlugString(product.main_product_name) ||
        toSlugString(product.name) ||
        toSlugString(product.slug);



    if (!category_slug || !product_slug) {
        // Fallback for incomplete data to prevent broken links
        return "/";
    }

    // Conditionally include variant ID for consistency and state preservation
    const variantId = product.id || product.variant_id;
    const variantSuffix = (includeVariant && variantId) ? `?variant=${variantId}` : "";

    return `/${category_slug}/${sub_category_slug}/${product_slug}/${variantSuffix}`;

};
