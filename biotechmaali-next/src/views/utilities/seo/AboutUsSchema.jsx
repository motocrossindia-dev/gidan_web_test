import __logo from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";
const _logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logo = typeof _logo === 'string' ? _logo : _logo?.src || _logo;

export default function AboutUsSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "name": "About Gidan Store",
                "url": "https://gidan.store/about-us",
                "description": "Learn about Gidan Store, Bangalore’s trusted destination for plants, planters, and urban gardening essentials."
            },
            {
                "@type": "Organization",
                "name": "Gidan Store",
                "url": "https://gidan.store",
                "logo": `https://gidan.store/${logo}`,
                "description": "Gidan Store is your trusted destination for plants, planters, and everything that makes urban gardening simple and joyful.",
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
            },
            {
                "@type": "Store",
                "name": "Gidan Store",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Bangalore",
                    "addressRegion": "Karnataka",
                    "addressCountry": "IN"
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
