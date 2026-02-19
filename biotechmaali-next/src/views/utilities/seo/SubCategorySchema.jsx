export default function SubCategorySchema({
                                              category,
                                              subCategory,
                                              siteUrl = "https://gidan.store",
                                              items = [] // [{ slug: "product-slug", category_slug: "category", sub_category_slug: "subcategory" }, ...]
                                          }) {
    if (!subCategory || !category) return null;

    // Build proper 2-segment subcategory URL
    const subcategoryUrl = `${siteUrl}/${category.slug}/${subCategory.slug}/`;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${subcategoryUrl}#collectionpage`,
                "url": subcategoryUrl,
                "name": subCategory.name,
                "description": subCategory.description || `${subCategory.name} under ${category.name}`
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
                        "name": category.name,
                        "item": `${siteUrl}/${category.slug}/`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": subCategory.name,
                        "item": subcategoryUrl
                    }
                ]
            },
            {
                "@type": "ItemList",
                "name": `${subCategory.name} Collection`,
                "numberOfItems": items.length,
                "itemListElement": items.map((item, index) => {
                    // Build proper 3-segment product URL
                    const productUrl = `${siteUrl}/${item.category_slug}/${item.sub_category_slug}/${item.slug}/`;
                    
                    return {
                        "@type": "ListItem",
                        "position": index + 1,
                        "url": productUrl
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
