const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";

export async function fetchCategoryBySlug(slug) {
    try {
        const res = await fetch(`${API_URL}/category/`, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const data = await res.json();
        const categories = data?.data?.categories || [];
        return categories.find(c => c.slug === slug) || null;
    } catch (err) {
        console.error("Error fetching category", err);
        return null;
    }
}

export async function fetchSubcategoryBySlug(categorySlug, subcategorySlug) {
    try {
        const res = await fetch(`${API_URL}/category/categoryWiseSubCategory/${categorySlug}/`, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const data = await res.json();
        const subcategories = data?.data?.subCategorys || [];
        return subcategories.find(s => s.slug === subcategorySlug) || null;
    } catch (err) {
        console.error("Error fetching subcategory", err);
        return null;
    }
}

export async function fetchProductsByFilters(filters = {}) {
    try {
        const queryParams = new URLSearchParams();

        // Default filters
        const defaults = {
            type: filters.type || "plant",
            subcategory_id: filters.subcategory_id || "",
            search: filters.search || "",
            min_price: filters.min_price || "",
            max_price: filters.max_price || "",
            is_featured: filters.is_featured ? "true" : "unknown",
            is_best_seller: filters.is_best_seller ? "true" : "unknown",
            is_seasonal_collection: filters.is_seasonal_collection ? "true" : "unknown",
            is_trending: filters.is_trending ? "true" : "unknown"
        };

        Object.entries(defaults).forEach(([key, value]) => {
            queryParams.append(key, value);
        });

        const url = `${API_URL}/filters/main_productsFilter/?${queryParams.toString()}`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data?.products || [];
    } catch (err) {
        console.error("Error fetching products", err);
        return [];
    }
}

export async function fetchProductDetail(productSlug, searchParams = {}) {
    try {
        const query = new URLSearchParams(searchParams).toString();
        const url = `${API_URL}/product/defaultProduct/${encodeURIComponent(productSlug)}/${query ? '?' + query : ''}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching product detail", err);
        return null;
    }
}
