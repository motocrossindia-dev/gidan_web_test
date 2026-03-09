export default function StoreSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "@id": "https://gidanbackendtest.mymotokart.in/#store",
        "name": "Gidan Store",
        "url": "https://gidanbackendtest.mymotokart.in",
        "image": "https://gidanbackendtest.mymotokart.in/logo.webp",
        "parentOrganization": { "@id": "https://gidanbackendtest.mymotokart.in/#organization" },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560001",
            "addressCountry": "IN"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
