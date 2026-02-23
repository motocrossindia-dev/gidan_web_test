import { MetadataRoute } from "next";
import slugify from "slugify";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
const SITE_URL = "https://www.gidan.store";

function convertToSlug(text: string): string {
    if (!text) return "";
    return slugify(text, {
        replacement: "-",
        remove: /[*+~.()'\"!:@]/g,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
    });
}

function toSlugString(val: any): string {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val?.slug || val?.name || "";
}

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

        // Fetch ALL products and generate clean URLs
        const productTypes = ["plant", "pot", "seed", "plant_care"];
        for (const type of productTypes) {
            try {
                const prodRes = await fetch(
                    `${API_URL}/filters/main_productsFilter/?type=${type}`,
                    { next: { revalidate: 3600 } }
                );
                if (!prodRes.ok) continue;
                const prodData = await prodRes.json();
                const products = prodData?.results || [];

                for (const product of products) {
                    const catSlug = toSlugString(product.category_slug);
                    const subCatSlug =
                        toSlugString(product.sub_category_slug) || "all";

                    // Use main_product_name for the clean slug
                    const productSlug = product.main_product_name
                        ? convertToSlug(product.main_product_name)
                        : toSlugString(product.slug);

                    if (!catSlug || !productSlug) continue;

                    entries.push({
                        url: `${SITE_URL}/${catSlug}/${subCatSlug}/${productSlug}`,
                        lastModified: new Date(),
                        changeFrequency: "weekly",
                        priority: 0.6,
                    });
                }
            } catch { }
        }
    } catch (err) {
        console.error("Sitemap generation error:", err);
    }

    // Deduplicate URLs
    const seen = new Set<string>();
    return entries.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
}
