import type { Metadata } from "next";
import DripIrrigation from '@/Services/ServicePage/DripIrrigation';


export const metadata: Metadata = {
  title: "Services - Single - Dripirrigation | Gidan Plants",
  description: "Shop and explore services - single - dripirrigation at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Services - Single - Dripirrigation | Gidan Plants",
    description: "Shop and explore services - single - dripirrigation at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/services/single/dripirrigation",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Single - Dripirrigation | Gidan Plants",
    description: "Shop and explore services - single - dripirrigation at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/services/single/dripirrigation" },
  robots: { index: true, follow: true },
};

export default function DripIrrigationPage() {
  return <DripIrrigation />;
}
