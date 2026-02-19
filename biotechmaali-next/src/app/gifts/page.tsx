import type { Metadata } from "next";
import Comingsoon from '@/views/utilities/Gifts/Comingsoon';


export const metadata: Metadata = {
  title: "Gift Plants and Hampers | Gidan",
  description: "Shop curated plant gift hampers and personalised green gifts for every occasion at Gidan.",
  openGraph: {
    title: "Gift Plants and Hampers | Gidan",
    description: "Shop curated plant gift hampers and personalised green gifts for every occasion at Gidan.",
    url: "https://www.gidan.store/gifts",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Plants and Hampers | Gidan",
    description: "Shop curated plant gift hampers and personalised green gifts for every occasion at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/gifts" },
  robots: { index: true, follow: true },
};

export default function GiftsPage() {
  return <Comingsoon />;
}
