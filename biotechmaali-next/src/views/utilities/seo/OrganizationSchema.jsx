'use client';

// src/seo/OrganizationSchema.jsx
import { Helmet } from "react-helmet-async";
import __logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";
const _logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logo = typeof _logo === 'string' ? _logo : _logo?.src || _logo;

export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://gidan.store/#organization",
        "name": "Gidan Store",
        "url": "https://gidan.store",
        "logo": `https://gidan.store${logo}`,
        "description": "Gidan Store is Bangalore's trusted destination for plants, planters, and urban gardening essentials.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
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

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
