import type { Metadata } from "next";
import { fetchServicesList } from "@/utils/serverApi";
import ServicePage from '@/Services/Service new/ServicePage';

export const metadata: Metadata = {
  title: "Services | Gidan Plants",
  description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services | Gidan Plants",
    description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/services",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Gidan Plants",
    description: "Shop and explore services at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/services" },
  robots: { index: true, follow: true },
};

export const revalidate = 3600; // Revalidate every hour

export default async function ServicesListingPage() {
  const initialServices: any[] = await fetchServicesList();
  
  return <ServicePage {...({ initialServices } as any)} />;
}
