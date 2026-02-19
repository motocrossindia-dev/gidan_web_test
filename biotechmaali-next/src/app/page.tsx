import type { Metadata } from "next";
import Home from '@/components/Home/Home';


export const metadata: Metadata = {
  title: "Gidan - Plants, Seeds & Gardening Store Online India",
  description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  openGraph: {
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
    url: "https://www.gidan.store",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  },
  alternates: { canonical: "https://www.gidan.store" },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <Home />;
}
