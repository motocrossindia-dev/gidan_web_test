import type { Metadata } from "next";
import ServicePage from '@/Services/Service new/ServicePage';


export const metadata: Metadata = {
  title: "Services | Gidan Plants",
  description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services | Gidan Plants",
    description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/services",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Gidan Plants",
    description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/services" },
  robots: { index: true, follow: true },
};

export default function ServicesPage() {
  return <ServicePage />;
}
