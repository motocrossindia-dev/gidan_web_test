import { Helmet } from "react-helmet-async";

export default function CategorySchema({
                                           categoryName,
                                           categorySlug,
                                           items = [] // [{ slug: "snake-plant" }, ...]
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
                "itemListElement": items.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `${baseUrl}/${item.slug}/`
                }))
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
