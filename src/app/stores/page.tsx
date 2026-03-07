import type { Metadata } from "next";
import Stores from '@/views/Stores/Stores';


export const metadata: Metadata = {
  title: "Plant Stores in Bangalore | Gidan Store Locations",
  description: "Find Gidan Store locations in Bangalore. Visit our plant stores to explore indoor plants, outdoor plants, planters and gardening supplies.",
  openGraph: {
    title: "Plant Stores in Bangalore | Gidan Store Locations",
    description: "Find Gidan Store locations in Bangalore. Visit our plant stores to explore indoor plants, outdoor plants, planters and gardening supplies.",
    url: "https://www.gidan.store/stores",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Stores in Bangalore | Gidan Store Locations",
    description: "Find Gidan Store locations in Bangalore. Visit our plant stores to explore indoor plants, outdoor plants, planters and gardening supplies.",
  },
  alternates: { canonical: "https://www.gidan.store/stores" },
  robots: { index: true, follow: true },
};

export default function StoresPage() {
  return <Stores />;
}
