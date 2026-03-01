import { getProductUrl } from "../../../utils/urlHelper";

export default function CategorySchema({
    categoryName,
    categorySlug,
    items = [] // [{ slug: "product-slug", category_slug: "category", sub_category_slug: "subcategory" }, ...]
}) {
    const baseUrl = "https://www.gidan.store/";
    const siteUrl = "https://www.gidan.store";

    const getProductImage = (item) => item?.main_image || item?.image || item?.prod_image || (Array.isArray(item?.images) && item.images[0]) || null;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}${categorySlug}/#collectionpage`,
                "url": `${baseUrl}${categorySlug}/`,
                "name": categoryName || categorySlug || "Category",
                "description": `Explore a curated collection of ${categoryName || categorySlug || "Category"} from Gidan Store.`,
                ...(getProductImage(items[0]) ? { "image": getProductImage(items[0]) } : {})
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
                            ...(getProductImage(item) ? { "image": getProductImage(item) } : {}),
                            "url": productUrl,
                            "offers": {
                                "@type": "Offer",
                                "price": String(item.selling_price || 0),
                                "priceCurrency": "INR",
                                "availability": item.stock_word?.toLowerCase() === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
                            },
                            ...((item.average_rating > 0) && {
                                "aggregateRating": {
                                    "@type": "AggregateRating",
                                    "ratingValue": String(item.average_rating),
                                    "reviewCount": String(item.total_reviews || 1)
                                }
                            })
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
