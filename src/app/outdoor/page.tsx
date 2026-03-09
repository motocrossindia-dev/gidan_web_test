import type { Metadata } from "next";
import OutdoorPlants from '@/views/utilities/OutdoorPlants/OutdoorPlants';


export const metadata: Metadata = {
  title: "Outdoor | Gidan Plants",
  description: "Shop and explore outdoor at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Outdoor | Gidan Plants",
    description: "Shop and explore outdoor at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/outdoor",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Outdoor | Gidan Plants",
    description: "Shop and explore outdoor at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/outdoor" },
  robots: { index: true, follow: true },
};

export default function OutdoorPage() {
  return <OutdoorPlants />;
}
