import type { Metadata } from "next";
import ComboOffer from '@/views/utilities/ComboOffer/ComboOffer';


export const metadata: Metadata = {
  title: "Combo Offers - Plants and Accessories | Gidan",
  description: "Save more with exclusive plant and pot combo deals at Gidan.",
  openGraph: {
    title: "Combo Offers - Plants and Accessories | Gidan",
    description: "Save more with exclusive plant and pot combo deals at Gidan.",
    url: "https://www.gidan.store/combooffer",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Combo Offers - Plants and Accessories | Gidan",
    description: "Save more with exclusive plant and pot combo deals at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/combooffer" },
  robots: { index: true, follow: true },
};

export default function ComboOfferPage() {
  return <ComboOffer />;
}
