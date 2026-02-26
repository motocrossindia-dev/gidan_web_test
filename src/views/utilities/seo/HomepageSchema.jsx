export default function HomepageSchema({ siteUrl = "https://www.gidan.store" }) {
    const cleanSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

    const graph = [
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
            "name": "Home - Gidan Store",
            "isPartOf": { "@id": `${cleanSiteUrl}/#website` },
            "about": { "@id": `${cleanSiteUrl}/#organization` },
            "description": "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India."
        },
        {
            "@type": "Organization",
            "@id": `${cleanSiteUrl}/#organization`,
            "name": "Gidan Plants",
            "url": cleanSiteUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${cleanSiteUrl}/logo192.ico`,
                "width": "192",
                "height": "192"
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
            "image": `${cleanSiteUrl}/logo192.ico`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
            }
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
