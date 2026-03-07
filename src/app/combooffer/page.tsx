import type { Metadata } from "next";
import ComboOffer from '@/views/utilities/ComboOffer/ComboOffer';


export const metadata: Metadata = {
  title: "Plant Combo Offers Online in Bangalore | Gidan Store",
  description: "Buy plant combo offers online in Bangalore from Gidan Store. Shop indoor plants with pots and planters at special bundle prices.",
  openGraph: {
    title: "Plant Combo Offers Online in Bangalore | Gidan Store",
    description: "Buy plant combo offers online in Bangalore from Gidan Store. Shop indoor plants with pots and planters at special bundle prices.",
    url: "https://www.gidan.store/combooffer",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Combo Offers Online in Bangalore | Gidan Store",
    description: "Buy plant combo offers online in Bangalore from Gidan Store. Shop indoor plants with pots and planters at special bundle prices.",
  },
  alternates: { canonical: "https://www.gidan.store/combooffer" },
  robots: { index: true, follow: true },
};

export default function ComboOfferPage() {
  return <ComboOffer />;
}
