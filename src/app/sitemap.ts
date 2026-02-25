import { MetadataRoute } from "next";
import { getProductUrl, toSlugString } from "../utils/urlHelper";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
const SITE_URL = "https://www.gidan.store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    // Static pages
    const staticPages = [
        "",
        "/about-us",
        "/contact-us",
        "/franchise-enquiry",
        "/featured",
        "/offer",
        "/stores",
        "/careers",
        "/faq",
        "/privacy-policy",
        "/terms",
        "/return",
        "/shipping",
        "/blogcomponent",
        "/gifts",
        "/seasonal",
        "/combo",
        "/shop-the-look",
    ];

    for (const page of staticPages) {
        entries.push({
            url: `${SITE_URL}${page}`,
            lastModified: new Date(),
            changeFrequency: page === "" ? "daily" : "monthly",
            priority: page === "" ? 1.0 : 0.5,
        });
    }

    try {
        // Fetch all categories
        const catRes = await fetch(`${API_URL}/category/`, {
            next: { revalidate: 3600 },
        });
        if (catRes.ok) {
            const catData = await catRes.json();
            const categories = catData?.data?.categories || [];

            for (const category of categories) {
                const catSlug = toSlugString(category.slug);
                if (!catSlug) continue;

                // Add category page
                entries.push({
                    url: `${SITE_URL}/${catSlug}`,
                    lastModified: new Date(),
                    changeFrequency: "weekly",
                    priority: 0.8,
                });

                // Fetch subcategories for this category
                try {
                    const subRes = await fetch(
                        `${API_URL}/category/categoryWiseSubCategory/${catSlug}/`,
                        { next: { revalidate: 3600 } }
                    );
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        const subcategories = subData?.data?.subCategorys || [];

                        for (const sub of subcategories) {
                            const subSlug = toSlugString(sub.slug);
                            if (!subSlug) continue;

                            // Add subcategory page
                            entries.push({
                                url: `${SITE_URL}/${catSlug}/${subSlug}`,
                                lastModified: new Date(),
                                changeFrequency: "weekly",
                                priority: 0.7,
                            });
                        }
                    }
                } catch { }
            }
        }

        // Helper to fetch all products across pages (No type filter to ensure we get 100% of products)
        async function fetchAllProducts() {
            let allProds: any[] = [];
            // Start with the base URL. Note: Backend ignores page_size=100 and defaults to 10.
            let currentUrl = `${API_URL}/filters/main_productsFilter/`;

            while (currentUrl) {
                try {
                    const res = await fetch(currentUrl, { next: { revalidate: 3600 } });
                    if (!res.ok) break;
                    const data = await res.json();
                    const results = data?.results || data?.products || [];
                    allProds = [...allProds, ...results];

                    // The 'next' field is an absolute URL from the backend
                    currentUrl = data?.next || null;

                    // Safety break
                    if (allProds.length > 5000) break;
                } catch (err) {
                    console.error("Error fetching products for sitemap:", err);
                    break;
                }
            }
            return allProds;
        }

        const products = await fetchAllProducts();
        for (const product of products) {
            const productRelativeUrl = getProductUrl(product, false);
            if (productRelativeUrl === "/" || !productRelativeUrl) continue;

            entries.push({
                url: `${SITE_URL}${productRelativeUrl}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.6,
            });
        }
    } catch (err) {
        console.error("Sitemap generation error:", err);
    }

    // Deduplicate URLs
    const seen = new Set<string>();
    const finalEntries = entries.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
    return finalEntries;
}
