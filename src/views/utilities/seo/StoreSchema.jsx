export default function StoreSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "Gidan Store",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
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
