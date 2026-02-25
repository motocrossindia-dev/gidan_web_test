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
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteUrl}search?&q={query}`,
                    "query": "required"
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
