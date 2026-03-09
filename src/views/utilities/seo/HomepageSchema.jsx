export default function HomepageSchema({ siteUrl = "https://gidanbackendtest.mymotokart.in" }) {
    const cleanSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${cleanSiteUrl}/#webpage`,
        "url": cleanSiteUrl,
        "name": "Gidan - Plants, Seeds & Gardening Store Online India",
        "isPartOf": { "@id": `${cleanSiteUrl}/#website` },
        "about": { "@id": `${cleanSiteUrl}/#organization` },
        "description": "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
