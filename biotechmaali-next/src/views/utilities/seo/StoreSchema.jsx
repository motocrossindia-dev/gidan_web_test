'use client';

import { Helmet } from "react-helmet-async";

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
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
