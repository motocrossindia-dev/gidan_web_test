export default function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://gidanbackendtest.mymotokart.in/#website",
        "name": "Gidan Store",
        "url": "https://gidanbackendtest.mymotokart.in/",
        "publisher": { "@id": "https://gidanbackendtest.mymotokart.in/#organization" },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://gidanbackendtest.mymotokart.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
