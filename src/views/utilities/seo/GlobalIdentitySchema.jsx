export default function GlobalIdentitySchema() {
    const siteUrl = "https://gidanbackendtest.mymotokart.in";

    return (
        <>
            {/* Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Gidan Plants",
                        "url": siteUrl,
                        "logo": `${siteUrl}/logo.webp`,
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
                    })
                }}
            />

            {/* Store Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Store",
                        "name": "Gidan Store",
                        "url": siteUrl,
                        "image": `${siteUrl}/logo.webp`,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Bangalore",
                            "addressRegion": "Karnataka",
                            "postalCode": "560001",
                            "addressCountry": "IN"
                        }
                    })
                }}
            />

            {/* WebSite Schema (with SearchAction) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "url": siteUrl,
                        "name": "Gidan Store",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
                            },
                            "query-input": "required name=search_term_string"
                        }
                    })
                }}
            />


        </>
    );
}
