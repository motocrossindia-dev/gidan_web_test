import type { Metadata } from "next";
import Thankyou from '@/views/utilities/Thankyou/Thankyou';


export const metadata: Metadata = {
  title: "Thankyou | Gidan Plants",
  description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Thankyou | Gidan Plants",
    description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/thankyou",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thankyou | Gidan Plants",
    description: "Shop and explore thankyou at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/thankyou" },
  robots: { index: true, follow: true },
};

export default function ThankyouPage() {
  return <Thankyou />;
}
