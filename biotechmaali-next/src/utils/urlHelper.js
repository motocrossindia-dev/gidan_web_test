import convertToSlug from "./slugConverter";

/**
 * Helper to extract a plain string from a slug value that could be a string or an object.

 */
export const toSlugString = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val?.slug || val?.name || "";
};

/**
 * Generates a standardized 3-segment product URL.
 * Pattern: /:categorySlug/:subcategorySlug/:productSlug/
 */
export const getProductUrl = (product) => {
    if (!product) return "/";

    const category_slug = toSlugString(product.category_slug);
    const sub_category_slug = toSlugString(product.sub_category_slug) || "all";

    // Use main_product_name to derive a stable base slug (e.g., eva-planter)
    // Fallback to the specific product's slug if main product name is missing
    const product_slug = product.main_product_name
        ? convertToSlug(product.main_product_name)
        : toSlugString(product.slug);

    if (!category_slug || !product_slug) {
        return "/";
    }

    return `/${category_slug}/${sub_category_slug}/${product_slug}`;

};
