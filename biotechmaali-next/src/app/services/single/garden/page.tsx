import type { Metadata } from "next";
import GardenMaintenance from '@/Services/ServicePage/GardenMaintenance';


export const metadata: Metadata = {
  title: "Services - Single - Garden | Gidan Plants",
  description: "Shop and explore services - single - garden at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services - Single - Garden | Gidan Plants",
    description: "Shop and explore services - single - garden at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/services/single/garden",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Single - Garden | Gidan Plants",
    description: "Shop and explore services - single - garden at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/services/single/garden" },
  robots: { index: true, follow: true },
};

export default function GardenMaintenancePage() {
  return <GardenMaintenance />;
}
