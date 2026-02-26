export default function HomepageSchema({
    siteUrl = "https://www.gidan.store/",
}) {
    const cleanSiteUrl = siteUrl.replace(/\/$/, "");

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${cleanSiteUrl}/#website`,
        "url": cleanSiteUrl,
        "name": "Gidan Store",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${cleanSiteUrl}/search?&q={query}`,
            "query": "required"
        }
    };

    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${cleanSiteUrl}/#webpage`,
        "url": cleanSiteUrl,
        "name": "Home - Gidan Store",
        "isPartOf": {
            "@id": `${cleanSiteUrl}/#website`
        },
        "about": {
            "@id": `${cleanSiteUrl}/#organization`
        },
        "description": "Explore Gidan Store's collection of plants, planters, and gardening essentials for your urban garden."
    };

    const organizationSchema = {
        "@context": {
            "@vocab": "https://schema.org/",
            "gs1": "https://ref.gs1.org/voc/",
            "unece": "https://vocabulary.uncefact.org/"
        },
        "@type": [
            "Organization",
            "gs1:Organization",
            "unece:TradeParty"
        ],
        "@id": `${cleanSiteUrl}/#organization`,
        "name": "Gidan Store",
        "url": cleanSiteUrl,
        "logo": `${cleanSiteUrl}/logo192.ico`,
        "description": "Bangalore's trusted destination for plants, planters, and urban gardening essentials.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560001",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://www.facebook.com/thegidanstore/",
            "https://www.instagram.com/thegidanstore/",
            "https://www.linkedin.com/company/thegidanstore/",
            "https://www.youtube.com/@thegidanstore/"
        ]
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}
