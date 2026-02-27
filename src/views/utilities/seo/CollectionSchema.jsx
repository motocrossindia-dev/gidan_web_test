/**
 * @param {{
 *   category: { name: string, slug: string },
 *   subcategory?: { name: string, slug: string } | null,
 *   products?: any[],
 *   siteUrl?: string
 * }} props
 */
export default function CollectionSchema({ category, subcategory, products = [], siteUrl = "https://www.gidan.store" }) {
    const catName = category?.name || category?.slug || "";
    const subName = subcategory?.name || subcategory?.slug || "";

    // BreadcrumbList logic
    const breadcrumbList = {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            }
        ]
    };

    if (category?.slug) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": catName,
            "item": `${siteUrl}/${category.slug}/`
        });
    }

    if (subcategory?.slug && category?.slug) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": subName,
            "item": `${siteUrl}/${category.slug}/${subcategory.slug}/`
        });
    }

    // CollectionPage logic
    const collectionUrl = subcategory?.slug && category?.slug
        ? `${siteUrl}/${category.slug}/${subcategory.slug}/`
        : category?.slug
            ? `${siteUrl}/${category.slug}/`
            : `${siteUrl}/`;

    const collectionName = subName ? `Buy ${subName} ${catName} Online India | Gidan` : `Buy ${catName} Online India | Best Collection | Gidan`;

    const collectionPage = {
        "@type": "CollectionPage",
        "@id": `${collectionUrl}#webpage`,
        "url": collectionUrl,
        "name": collectionName,
        "isPartOf": { "@id": `${siteUrl}/#website` },
        "breadcrumb": { "@id": `${siteUrl}/#breadcrumb` }
    };

    // ItemList logic for Products
    const validProducts = Array.isArray(products) ? products : [];

    const itemList = {
        "@type": "ItemList",
        "@id": `${collectionUrl}#itemlist`,
        "url": collectionUrl,
        "name": subName || catName || "Products",
        "numberOfItems": validProducts.length,
        "itemListElement": validProducts.map((prod, index) => {
            const prodCategorySlug = prod?.category_slug || category?.slug || "category";
            const prodSubCategorySlug = prod?.sub_category_slug || subcategory?.slug || "subcategory";

            return {
                "@type": "ListItem",
                "position": index + 1,
                "url": `${siteUrl}/${prodCategorySlug}/${prodSubCategorySlug}/${prod.slug}/`,
                "name": prod.name || prod.title || "Product"
            };
        })
    };

    // Output all 3 connected schemas
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [collectionPage, breadcrumbList, itemList]
                })
            }}
        />
    );
}
