// src/seo/OrganizationSchema.jsx
import { Helmet } from "react-helmet-async";
import logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";
export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gidan Store",
        "url": "https://gidan.store",
        "logo": `https://gidan.store/${logo}`
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
