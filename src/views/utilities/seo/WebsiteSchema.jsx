// src/seo/WebsiteSchema.jsx
import { Helmet } from "react-helmet-async";
import logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";
export default function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Gidan Store",
        "url": "https://gidan.store"
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
