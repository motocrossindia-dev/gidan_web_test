import type { Metadata } from "next";
import AnniversaryGifts from '@/views/utilities/AnniversaryGifts/AnniversaryGifts';


export const metadata: Metadata = {
  title: "Anniversary Gift Plants | Gidan",
  description: "Celebrate love with elegant indoor plants and gift sets. Perfect anniversary gifts from Gidan.",
  openGraph: {
    title: "Anniversary Gift Plants | Gidan",
    description: "Celebrate love with elegant indoor plants and gift sets. Perfect anniversary gifts from Gidan.",
    url: "https://www.gidan.store/anniversary",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anniversary Gift Plants | Gidan",
    description: "Celebrate love with elegant indoor plants and gift sets. Perfect anniversary gifts from Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/anniversary" },
  robots: { index: true, follow: true },
};

export default function AnniversaryPage() {
  return <AnniversaryGifts />;
}
