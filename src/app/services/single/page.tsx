import type { Metadata } from "next";
import ServicePage from '@/Services/ServicePage/ServicePage';


export const metadata: Metadata = {
  title: "Services - Single | Gidan Plants",
  description: "Shop and explore services - single at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services - Single | Gidan Plants",
    description: "Shop and explore services - single at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/services/single",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Single | Gidan Plants",
    description: "Shop and explore services - single at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/services/single" },
  robots: { index: true, follow: true },
};

export default function ServiceSinglePage() {
  return <ServicePage />;
}
