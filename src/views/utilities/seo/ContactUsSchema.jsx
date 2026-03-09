import __logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";
const _logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logo = typeof _logo === 'string' ? _logo : _logo?.src || _logo;

export default function ContactUsSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": "https://gidanbackendtest.mymotokart.in/contact-us/#contactpage",
                "url": "https://gidanbackendtest.mymotokart.in/contact-us/",
                "name": "Contact Gidan Store",
                "description": "Get in touch with Gidan Store for plants, planters, and urban gardening essentials in Bangalore."
            },
            {
                "@type": "Organization",
                "@id": "https://gidanbackendtest.mymotokart.in/#organization",
                "name": "Gidan Store",
                "url": "https://gidanbackendtest.mymotokart.in/",
                "logo": {
                    "@type": "ImageObject",
                    "url": `https://gidanbackendtest.mymotokart.in/${logo}`
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
                "@id": "https://gidanbackendtest.mymotokart.in/#store",
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
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
