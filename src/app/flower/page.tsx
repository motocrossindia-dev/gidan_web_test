import type { Metadata } from "next";
import FloweringPlants from '@/views/utilities/FloweringPlants/FloweringPlants';


export const metadata: Metadata = {
  title: "Flowering Plants | Gidan Plant Store",
  description: "Buy beautiful flowering plants for balcony, garden and indoors at Gidan.",
  openGraph: {
    title: "Flowering Plants | Gidan Plant Store",
    description: "Buy beautiful flowering plants for balcony, garden and indoors at Gidan.",
    url: "https://www.gidan.store/flower",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowering Plants | Gidan Plant Store",
    description: "Buy beautiful flowering plants for balcony, garden and indoors at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/flower" },
  robots: { index: true, follow: true },
};

export default function FlowerPage() {
  return <FloweringPlants />;
}
