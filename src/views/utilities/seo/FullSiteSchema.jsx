export default function FullSiteSchema({ isHomePage = false }) {
    const siteUrl = "https://www.gidan.store";

    const organization = {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Gidan Plants",
        "url": siteUrl,
        "logo": {
            "@type": "ImageObject",
            "@id": `${siteUrl}/#logo`,
            "url": `${siteUrl}/logo.webp`,
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
    };

    const store = {
        "@type": "Store",
        "@id": `${siteUrl}/#store`,
        "name": "Gidan Store",
        "parentOrganization": { "@id": `${siteUrl}/#organization` },
        "url": siteUrl,
        "image": `${siteUrl}/logo.webp`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560001",
            "addressCountry": "IN"
        }
    };

    const website = {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Gidan Store",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    const graph = [organization, store, website];

    if (isHomePage) {
        graph.push({
            "@type": "WebPage",
            "@id": `${siteUrl}/#webpage`,
            "url": siteUrl,
            "name": "Gidan - Plants, Seeds & Gardening Store Online India",
            "isPartOf": { "@id": `${siteUrl}/#website` },
            "about": { "@id": `${siteUrl}/#organization` },
            "description": "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India."
        });
    }

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
