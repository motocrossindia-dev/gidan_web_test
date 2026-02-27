// src/seo/OrganizationSchema.jsx
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.gidan.store/#organization",
  name: "Gidan Plants",
  url: "https://www.gidan.store",
  logo: "https://www.gidan.store/logo.webp",
  description:
    "Gidan is India's trusted destination for plants, planters, seeds and urban gardening essentials with expert landscaping services.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560001",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/thegidanstore/",
    "https://www.instagram.com/thegidanstore/",
    "https://www.linkedin.com/company/thegidanstore/",
    "https://www.youtube.com/@thegidanstore/",
    "https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/",
  ],
};

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

