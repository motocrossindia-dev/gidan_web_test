export default function HomepageSchema({
    siteUrl = "https://www.gidan.store/",
}) {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": "Gidan Store",
                "description": "Bangalore's trusted destination for plants, planters, and urban gardening essentials.",
                "publisher": {
                    "@id": `${siteUrl}/#organization`
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/#webpage`,
                "url": siteUrl,
                "name": "Home - Gidan Store",
                "isPartOf": {
                    "@id": `${siteUrl}/#website`
                },
                "about": {
                    "@id": `${siteUrl}/#organization`
                },
                "description": "Explore Gidan Store's collection of plants, planters, and gardening essentials for your urban garden."
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
