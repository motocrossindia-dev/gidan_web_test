import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';


export const metadata: Metadata = {
  title: "Trending | Gidan Plants",
  description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Trending | Gidan Plants",
    description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/trending",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending | Gidan Plants",
    description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/trending" },
  robots: { index: true, follow: true },
};

export default function TrendingPage() {
  return <PlantFilter />;
}
