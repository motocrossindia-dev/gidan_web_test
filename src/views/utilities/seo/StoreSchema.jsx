export default function StoreSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "@id": "https://www.gidan.store/#store",
        "name": "Gidan Store",
        "url": "https://www.gidan.store",
        "image": "https://www.gidan.store/logo.webp",
        "parentOrganization": { "@id": "https://www.gidan.store/#organization" },
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
