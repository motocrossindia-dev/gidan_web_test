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

export async function fetchSubcategories(categorySlug) {
    try {
        const res = await fetch(`${API_URL}/category/categoryWiseSubCategory/${categorySlug}/`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data?.subCategorys || [];
    } catch (err) {
        console.error("Error fetching subcategories", err);
        return [];
    }
}

export async function fetchSubcategoryBySlug(categorySlug, subcategorySlug) {
    try {
        const subcategories = await fetchSubcategories(categorySlug);
        return subcategories.find(s => s.slug === subcategorySlug) || null;
    } catch (err) {
        console.error("Error fetching subcategory", err);
        return null;
    }
}

export async function fetchProductsByFilters(filters = {}) {
    try {
        const queryParams = new URLSearchParams();

        // Default filters - Include ALL parameters matching FilterSidebar.jsx to ensure consistent backend behavior
        const defaults = {
            type: filters.type || "plant",
            category_id: filters.category_id || "",
            subcategory_id: filters.subcategory_id || "",
            search: filters.search || "",
            min_price: filters.min_price || "",
            max_price: filters.max_price || "",
            color_id: filters.color_id || "",
            size_id: filters.size_id || "",
            planter_size_id: filters.planter_size_id || "",
            planter_id: filters.planter_id || "",
            weight_id: filters.weight_id || "",
            pot_type_id: filters.pot_type_id || "",
            litre_id: filters.litre_id || "",
            is_featured: filters.is_featured ? "true" : "unknown",
            is_best_seller: filters.is_best_seller ? "true" : "unknown",
            is_seasonal_collection: filters.is_seasonal_collection ? "true" : "unknown",
            is_trending: filters.is_trending ? "true" : "unknown",
            ordering: filters.ordering || ""
        };

        Object.entries(defaults).forEach(([key, value]) => {
            queryParams.append(key, value);
        });

        const url = `${API_URL}/filters/main_productsFilter/?${queryParams.toString()}&page_size=100&limit=100&page=1`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return { results: [], count: 0, next: null, previous: null };
        const data = await res.json();

        // Normalize the response to ensure consistency with PlantFilter/ProductGrid expectations
        // Backend sometimes returns results, sometimes products. We ensure it's always an object.
        return {
            results: data?.results || data?.products || [],
            count: data?.count || (data?.results || data?.products || []).length,
            next: data?.next || null,
            previous: data?.previous || null,
            category_info: data?.category_info // Preserve extra metadata if present
        };
    } catch (err) {
        console.error("Error fetching products", err);
        return { results: [], count: 0, next: null, previous: null };
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
export async function fetchFilters(type, categoryId = null) {
    try {
        let url = `${API_URL}/filters/filters_n/?type=${type}`;
        if (categoryId) {
            url += `&category_id=${categoryId}`;
        }
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.filters || null;
    } catch (err) {
        console.error("Error fetching filters", err);
        return null;
    }
}
