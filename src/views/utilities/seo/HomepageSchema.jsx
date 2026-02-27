export default function HomepageSchema({ siteUrl = "https://www.gidan.store" }) {
    const cleanSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

    const graph = [
        {
            "@type": "Organization",
            "@id": `${cleanSiteUrl}/#organization`,
            "name": "Gidan Plants",
            "url": cleanSiteUrl,
            "logo": {
                "@type": "ImageObject",
                "@id": `${cleanSiteUrl}/#logo`,
                "url": `${cleanSiteUrl}/logo.webp`,
                "width": "192",
                "height": "192",
                "caption": "Gidan Plants"
            },
            "description": "Gidan is India's trusted destination for plants, planters, seeds and urban gardening essentials with expert landscaping services.",
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
                "https://www.youtube.com/@thegidanstore/",
                "https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
            ]
        },
        {
            "@type": "Store",
            "@id": `${cleanSiteUrl}/#store`,
            "name": "Gidan Store",
            "parentOrganization": { "@id": `${cleanSiteUrl}/#organization` },
            "url": cleanSiteUrl,
            "image": `${cleanSiteUrl}/logo.webp`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560001",
                "addressCountry": "IN"
            }
        },
        {
            "@type": "WebSite",
            "@id": `${cleanSiteUrl}/#website`,
            "url": cleanSiteUrl,
            "name": "Gidan Store",
            "publisher": { "@id": `${cleanSiteUrl}/#organization` },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${cleanSiteUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@type": "WebPage",
            "@id": `${cleanSiteUrl}/#webpage`,
            "url": cleanSiteUrl,
            "name": "Gidan - Plants, Seeds & Gardening Store Online India",
            "isPartOf": { "@id": `${cleanSiteUrl}/#website` },
            "about": { "@id": `${cleanSiteUrl}/#organization` },
            "description": "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India."
        }
    ];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": graph
                })
            }}
        />
    );
}
