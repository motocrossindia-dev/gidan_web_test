import type { Metadata } from "next";
import BestSeller from '@/views/utilities/BestSeller/BestSeller';


export const metadata: Metadata = {
  title: "Best Selling Plants and Pots | Gidan",
  description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
  openGraph: {
    title: "Best Selling Plants and Pots | Gidan",
    description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
    url: "https://www.gidan.store/bestseller",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Selling Plants and Pots | Gidan",
    description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
  },
  alternates: { canonical: "https://www.gidan.store/bestseller" },
  robots: { index: true, follow: true },
};

export default function BestSellerPage() {
  return <BestSeller />;
}
