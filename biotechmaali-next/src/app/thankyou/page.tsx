import type { Metadata } from "next";
import Thankyou from '@/views/utilities/Thankyou/Thankyou';


export const metadata: Metadata = {
  title: "Thankyou | Gidan Plants",
  description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Thankyou | Gidan Plants",
    description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/thankyou",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thankyou | Gidan Plants",
    description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/thankyou" },
  robots: { index: true, follow: true },
};

export default function ThankyouPage() {
  return <Thankyou />;
}
