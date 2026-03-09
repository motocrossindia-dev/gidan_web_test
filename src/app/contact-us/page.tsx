import type { Metadata } from "next";
import ContactUs from '@/views/utilities/ContactUs/ContactUs';


export const metadata: Metadata = {
  title: "Contact Gidan Store | Plant Store in Bangalore",
  description: "Contact Gidan Store for plant orders, delivery support or gardening queries in Bangalore. Reach our team for plants, planters and garden supplies.",
  openGraph: {
    title: "Contact Gidan Store | Plant Store in Bangalore",
    description: "Contact Gidan Store for plant orders, delivery support or gardening queries in Bangalore. Reach our team for plants, planters and garden supplies.",
    url: "https://gidanbackendtest.mymotokart.in/contact-us",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Gidan Store | Plant Store in Bangalore",
    description: "Contact Gidan Store for plant orders, delivery support or gardening queries in Bangalore. Reach our team for plants, planters and garden supplies.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/contact-us" },
  robots: { index: true, follow: true },
};

export default function ContactUsPage() {
  return <ContactUs />;
}
