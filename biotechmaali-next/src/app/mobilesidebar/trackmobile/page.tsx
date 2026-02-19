import type { Metadata } from "next";
import TrackOrderMobile from '@/views/MobileUser/TrackOrderMobile/TrackOrderMobile';


export const metadata: Metadata = {
  title: "Mobilesidebar - Trackmobile | Gidan Plants",
  description: "Shop and explore mobilesidebar - trackmobile at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Mobilesidebar - Trackmobile | Gidan Plants",
    description: "Shop and explore mobilesidebar - trackmobile at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/mobilesidebar/trackmobile",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobilesidebar - Trackmobile | Gidan Plants",
    description: "Shop and explore mobilesidebar - trackmobile at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/trackmobile" },
  robots: { index: true, follow: true },
};

export default function TrackMobilePage() {
  return <TrackOrderMobile />;
}
