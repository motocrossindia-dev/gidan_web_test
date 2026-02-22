import type { Metadata } from "next";
import Landscape from '@/Services/ServicePage/Landscape';


export const metadata: Metadata = {
  title: "Services - Single - Landscapingpage | Gidan Plants",
  description: "Shop and explore services - single - landscapingpage at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services - Single - Landscapingpage | Gidan Plants",
    description: "Shop and explore services - single - landscapingpage at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/services/single/landscapingpage",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Single - Landscapingpage | Gidan Plants",
    description: "Shop and explore services - single - landscapingpage at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/services/single/landscapingpage" },
  robots: { index: true, follow: true },
};

export default function LandscapingPage() {
  return <Landscape />;
}
