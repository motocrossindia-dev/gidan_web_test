import { getProductUrl } from "../../../utils/urlHelper";

export default function CategorySchema({
    categoryName,
    categorySlug,
    items = [] // [{ slug: "product-slug", category_slug: "category", sub_category_slug: "subcategory" }, ...]
}) {
    const baseUrl = "https://www.gidan.store/";
    const siteUrl = "https://www.gidan.store";

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}${categorySlug}/#collectionpage`,
                "url": `${baseUrl}${categorySlug}/`,
                "name": categoryName || categorySlug || "Category",
                "description": `Explore a curated collection of ${categoryName || categorySlug || "Category"} from Gidan Store.`,
                "image": items[0]?.main_image || (items[0]?.images && items[0]?.images[0]) || ""
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}${categorySlug}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": categoryName || categorySlug || "Category",
                        "item": `${baseUrl}${categorySlug}/`
                    }
                ]
            },
            {
                "@type": "ItemList",
                "name": `${categoryName || categorySlug || "Category"} Collection`,
                "numberOfItems": items.length,
                "itemListElement": items.map((item, index) => {
                    const productUrl = `${siteUrl}${getProductUrl(item, false)}`;

                    return {
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Product",
                            "name": item.main_product_name || item.name || "Product",
                            "image": item.main_image || (item.images && item.images[0]) || "",
                            "url": productUrl
                        }
                    };
                })
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
