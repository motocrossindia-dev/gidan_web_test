import type { Metadata } from "next";
import ContactUs from '@/views/utilities/ContactUs/ContactUs';


export const metadata: Metadata = {
  title: "Contact Us | Gidan Plants",
  description: "Get in touch with Gidan for plant queries, order support or service enquiries.",
  openGraph: {
    title: "Contact Us | Gidan Plants",
    description: "Get in touch with Gidan for plant queries, order support or service enquiries.",
    url: "https://www.gidan.store/contact-us",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Gidan Plants",
    description: "Get in touch with Gidan for plant queries, order support or service enquiries.",
  },
  alternates: { canonical: "https://www.gidan.store/contact-us" },
  robots: { index: true, follow: true },
};

export default function ContactUsPage() {
  return <ContactUs />;
}
