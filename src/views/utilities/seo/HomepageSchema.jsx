import { Helmet } from "react-helmet-async";
import logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";

export default function HomepageSchema({
                                           siteUrl = "https://gidan.store",
                                       }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gidan Store",
        "url": siteUrl,
        "logo": `${siteUrl}${logo}`, // ✅ correct logo path
        "description": "Gidan Store is Bangalore’s trusted destination for plants, planters, and urban gardening essentials.",
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
