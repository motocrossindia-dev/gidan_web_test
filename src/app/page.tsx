import type { Metadata } from "next";
import Home from '@/components/Home/Home';

// Server-side fetching for LCP optimization
async function getInitialBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotion/banner/`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.banners || null;
  } catch (err) {
    console.error("Failed to fetch banners on server", err);
    return null;
  }
}


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

export default async function HomePage() {
  const initialBanners = await getInitialBanners();
  return <Home initialBanners={initialBanners} />;
}
