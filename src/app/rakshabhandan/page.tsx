import type { Metadata } from "next";
import RakshaBhandan from '@/views/utilities/RakshaBhandan/RakshaBhandan';


export const metadata: Metadata = {
  title: "Rakshabhandan | Gidan Plants",
  description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Rakshabhandan | Gidan Plants",
    description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/rakshabhandan",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakshabhandan | Gidan Plants",
    description: "Shop and explore rakshabhandan at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/rakshabhandan" },
  robots: { index: true, follow: true },
};

export default function RakshabhandanPage() {
  return <RakshaBhandan />;
}
