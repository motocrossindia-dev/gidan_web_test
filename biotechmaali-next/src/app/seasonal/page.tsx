import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';


export const metadata: Metadata = {
  title: "Seasonal | Gidan Plants",
  description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Seasonal | Gidan Plants",
    description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/seasonal",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seasonal | Gidan Plants",
    description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/seasonal" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters } from "@/utils/serverApi";

export default async function SeasonalPage() {
  const initialResults = await fetchProductsByFilters({ is_seasonal_collection: true });
  return <PlantFilter initialResults={initialResults} />;
}
