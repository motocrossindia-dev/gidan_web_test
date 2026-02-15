import { Helmet } from "react-helmet-async";
import logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";

export default function ContactUsSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": "https://gidan.store/contact-us/#contactpage",
                "url": "https://gidan.store/contact-us/",
                "name": "Contact Gidan Store",
                "description": "Get in touch with Gidan Store for plants, planters, and urban gardening essentials in Bangalore."
            },
            {
                "@type": "Organization",
                "@id": "https://gidan.store/#organization",
                "name": "Gidan Store",
                "url": "https://gidan.store/",
                "logo": {
                    "@type": "ImageObject",
                    "url": `https://gidan.store/${logo}`
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91 8971710854",
                    "contactType": "customer service",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi"]
                },
                "sameAs": [
                    "https://www.facebook.com/thegidanstore/",
                    "https://www.instagram.com/thegidanstore/",
                    "https://www.youtube.com/@thegidanstore/",
                    "https://www.linkedin.com/company/thegidanstore/"
                ]
            },
            {
                "@type": "Store",
                "@id": "https://gidan.store/#store",
                "name": "Gidan Store",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Head Office, Jaynagar",
                    "addressLocality": "Bangalore",
                    "addressRegion": "Karnataka",
                    "postalCode": "5600XX",
                    "addressCountry": "IN"
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "09:00",
                    "closes": "20:00"
                }
            }
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
