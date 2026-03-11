const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gidanbackendtest.mymotokart.in";

// Apply GST to a product's mrp and selling_price.
// API returns base (pre-GST) prices; actual price = base * (1 + total_gst / 100)
// In Indian GST: total rate = CGST + SGST (e.g. 9+9=18%), fall back to gst field.
// Handles both number and string values (detail API returns strings like "9.00", "18%").
export function applyGstToProduct(product) {
    const cgst = parseFloat(product.cgst) || 0;
    const sgst = parseFloat(product.sgst) || 0;
    const gst = parseFloat(String(product.gst).replace('%', '')) || 0;
    const rate = (cgst + sgst) > 0 ? (cgst + sgst) : gst;
    const multiplier = 1 + rate / 100;
    return {
        ...product,
        mrp: parseFloat((product.mrp * multiplier).toFixed(2)),
        selling_price: parseFloat((product.selling_price * multiplier).toFixed(2)),
    };
}

// Apply GST to a full product_detail_view response object.
export function applyGstToDetailResponse(responseData) {
    if (!responseData?.data?.product) return responseData;
    return {
        ...responseData,
        data: {
            ...responseData.data,
            product: applyGstToProduct(responseData.data.product),
        },
    };
}

// Apply GST to a placeOrder / order-fetch response ({ order, order_items, ... }).
// Transforms each order_item's mrp, selling_price, total and recalculates
// order.total_price and order.grand_total accordingly.
export function applyGstToOrderData(data) {
    if (!data) return data;

    const orderItems = (data.order_items || []).map(item => {
        const cgst = parseFloat(item.cgst) || 0;
        const sgst = parseFloat(item.sgst) || 0;
        const gst  = parseFloat(String(item.gst).replace('%', '')) || 0;
        const rate = (cgst + sgst) > 0 ? (cgst + sgst) : gst;
        const mul  = 1 + rate / 100;
        return {
            ...item,
            mrp:           parseFloat((parseFloat(item.mrp)           * mul).toFixed(2)),
            selling_price: parseFloat((parseFloat(item.selling_price) * mul).toFixed(2)),
            total:         parseFloat((parseFloat(item.total)         * mul).toFixed(2)),
        };
    });

    const order = data.order ? { ...data.order } : null;
    if (order) {
        const newTotalPrice   = orderItems.reduce((sum, i) => sum + i.total, 0);
        const shippingCharge  = parseFloat(order.shipping_charge) || parseFloat(data.shipping_info?.shipping_charge) || 0;
        const couponDiscount  = parseFloat(order.coupon_discount)  || 0;
        order.total_price  = parseFloat(newTotalPrice.toFixed(2));
        order.grand_total  = parseFloat((newTotalPrice + shippingCharge - couponDiscount).toFixed(2));
        // Keep shipping_charge on order so downstream calcs stay consistent
        if (!order.shipping_charge && shippingCharge > 0) {
            order.shipping_charge = shippingCharge;
        }
    }

    return { ...data, order, order_items: orderItems };
}

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
        const rawResults = (data?.results || data?.products || []).map(applyGstToProduct);
        return {
            results: rawResults,
            count: data?.count || rawResults.length,
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
        const url = `${API_URL}/product/product_detail_view/${encodeURIComponent(productSlug)}/${query ? '?' + query : ''}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return applyGstToDetailResponse(data);
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

export async function fetchOfferProducts() {
    try {
        const res = await fetch(`${API_URL}/product/offerProducts/`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        const data = await res.json();
        return (data?.products || []).map(applyGstToProduct);
    } catch (err) {
        console.error("Error fetching offer products", err);
        return [];
    }
}
