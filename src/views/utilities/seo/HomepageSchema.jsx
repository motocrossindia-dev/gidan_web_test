export default function HomepageSchema({
    siteUrl = "https://www.gidan.store/",
}) {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl.replace(/\/$/, '')}/#website`,
        "url": siteUrl,
        "name": "Gidan Store",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}search?&q={query}`,
            "query": "required"
        }
    };

    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${siteUrl.replace(/\/$/, '')}/#webpage`,
        "url": siteUrl,
        "name": "Home - Gidan Store",
        "isPartOf": {
            "@id": `${siteUrl.replace(/\/$/, '')}/#website`
        },
        "about": {
            "@id": `${siteUrl.replace(/\/$/, '')}/#organization`
        },
        "description": "Explore Gidan Store's collection of plants, planters, and gardening essentials for your urban garden."
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
            />
        </>
    );
}
