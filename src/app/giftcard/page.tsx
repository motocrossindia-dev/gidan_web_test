import type { Metadata } from "next";
import EcommerceGiftCard from '@/views/utilities/E-GiftCard/EcommerceGiftCard';


export const metadata: Metadata = {
  title: "E-Gift Cards | Gidan Plants",
  description: "Send an e-gift card and let them choose their favourite plants at Gidan.",
  openGraph: {
    title: "E-Gift Cards | Gidan Plants",
    description: "Send an e-gift card and let them choose their favourite plants at Gidan.",
    url: "https://www.gidan.store/giftcard",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Gift Cards | Gidan Plants",
    description: "Send an e-gift card and let them choose their favourite plants at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/giftcard" },
  robots: { index: true, follow: true },
};

export default function GiftCardPage() {
  return <EcommerceGiftCard />;
}
