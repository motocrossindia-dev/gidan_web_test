import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';


export const metadata: Metadata = {
  title: "New Arrivals - Latest Plants and Products | Gidan",
  description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
  openGraph: {
    title: "New Arrivals - Latest Plants and Products | Gidan",
    description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
    url: "https://www.gidan.store/latest",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals - Latest Plants and Products | Gidan",
    description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/latest" },
  robots: { index: true, follow: true },
};

export default function LatestPage() {
  return <PlantFilter />;
}
