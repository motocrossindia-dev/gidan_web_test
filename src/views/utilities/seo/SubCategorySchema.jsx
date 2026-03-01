import { getProductUrl } from "../../../utils/urlHelper";

export default function SubCategorySchema({
    category,
    subCategory,
    siteUrl = "https://www.gidan.store/",
    items = [] // [{ slug: "product-slug", category_slug: "category", sub_category_slug: "subcategory" }, ...]
}) {
    if (!subCategory || !category) return null;

    // Build proper 2-segment subcategory URL
    const subcategoryUrl = `${siteUrl}${category.slug}/${subCategory.slug}/`;

    const getProductImage = (item) => item?.main_image || item?.image || item?.prod_image || (Array.isArray(item?.images) && item.images[0]) || null;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${subcategoryUrl}#collectionpage`,
                "url": subcategoryUrl,
                "name": subCategory.name || subCategory.slug || "Subcategory",
                "description": subCategory.description || `${subCategory.name || subCategory.slug || "Subcategory"} under ${category.name || category.slug || "Category"}`,
                ...(getProductImage(items[0]) ? { "image": getProductImage(items[0]) } : {})
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${subcategoryUrl}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": category.name || category.slug || "Category",
                        "item": `${siteUrl}${category.slug}/`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": subCategory.name || subCategory.slug || "Subcategory",
                        "item": subcategoryUrl
                    }
                ]
            },
            {
                "@type": "ItemList",
                "name": `${subCategory.name || subCategory.slug || "Subcategory"} Collection`,
                "numberOfItems": items.length,
                "itemListElement": items.map((item, index) => {
                    const productUrl = `${siteUrl.replace(/\/$/, '')}${getProductUrl(item, false)}`;

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
