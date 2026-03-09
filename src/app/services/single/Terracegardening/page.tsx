import type { Metadata } from "next";
import Terracegardening from '@/Services/ServicePage/Terracegardening';


export const metadata: Metadata = {
  title: "Services - Single - Terracegardening | Gidan Plants",
  description: "Shop and explore services - single - terracegardening at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services - Single - Terracegardening | Gidan Plants",
    description: "Shop and explore services - single - terracegardening at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/services/single/Terracegardening",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Single - Terracegardening | Gidan Plants",
    description: "Shop and explore services - single - terracegardening at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/services/single/Terracegardening" },
  robots: { index: true, follow: true },
};

export default function TerraceGardeningPage() {
  return <Terracegardening />;
}
