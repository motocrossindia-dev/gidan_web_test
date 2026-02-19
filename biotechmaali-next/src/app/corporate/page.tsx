import type { Metadata } from "next";
import CorporateGiftingPage from '@/views/utilities/CorperateGifting/CorporateGiftingPage';


export const metadata: Metadata = {
  title: "Corporate Gifting Plants | Gidan",
  description: "Premium indoor plants and green decor for corporate gifting. Bulk orders welcome at Gidan.",
  openGraph: {
    title: "Corporate Gifting Plants | Gidan",
    description: "Premium indoor plants and green decor for corporate gifting. Bulk orders welcome at Gidan.",
    url: "https://www.gidan.store/corporate",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Gifting Plants | Gidan",
    description: "Premium indoor plants and green decor for corporate gifting. Bulk orders welcome at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/corporate" },
  robots: { index: true, follow: true },
};

export default function CorporatePage() {
  return <CorporateGiftingPage />;
}
