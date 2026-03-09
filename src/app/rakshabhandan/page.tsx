import type { Metadata } from "next";
import RakshaBhandan from '@/views/utilities/RakshaBhandan/RakshaBhandan';


export const metadata: Metadata = {
  title: "Rakshabhandan | Gidan Plants",
  description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Rakshabhandan | Gidan Plants",
    description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/rakshabhandan",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakshabhandan | Gidan Plants",
    description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/rakshabhandan" },
  robots: { index: true, follow: true },
};

export default function RakshabhandanPage() {
  return <RakshaBhandan />;
}
