import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';


export const metadata: Metadata = {
  title: "Featured Products | Gidan Plants",
  description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
  openGraph: {
    title: "Featured Products | Gidan Plants",
    description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
    url: "https://www.gidan.store/featured",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured Products | Gidan Plants",
    description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
  },
  alternates: { canonical: "https://www.gidan.store/featured" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters } from "@/utils/serverApi";

export default async function FeaturedPage() {
  const initialResults = await fetchProductsByFilters({ is_featured: true });
  return <PlantFilter initialResults={initialResults} />;
}
