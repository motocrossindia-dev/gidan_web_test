'use client';

import { Helmet } from "react-helmet-async";

export default function CategorySchema({
                                           categoryName,
                                           categorySlug,
                                           items = [] // [{ slug: "product-slug", category_slug: "category", sub_category_slug: "subcategory" }, ...]
                                       }) {
    const baseUrl = "https://gidan.store";

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/${categorySlug}/#collectionpage`,
                "url": `${baseUrl}/${categorySlug}/`,
                "name": categoryName,
                "description": `Explore a curated collection of ${categoryName} from Gidan Store.`
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/${categorySlug}/#breadcrumb`,
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
                        "name": categoryName,
                        "item": `${baseUrl}/${categorySlug}/`
                    }
                ]
            },
            {
                "@type": "ItemList",
                "name": `${categoryName} Collection`,
                "numberOfItems": items.length,
                "itemListElement": items.map((item, index) => {
                    // Build proper 3-segment product URL
                    const productUrl = item.sub_category_slug
                        ? `${baseUrl}/${item.category_slug}/${item.sub_category_slug}/${item.slug}/`
                        : `${baseUrl}/${item.category_slug}/${item.slug}/`;
                    
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
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
