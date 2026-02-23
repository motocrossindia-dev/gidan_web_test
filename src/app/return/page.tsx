import type { Metadata } from "next";
import ReturnPolicy from '@/components/Footer/ReturnPolicy';


export const metadata: Metadata = {
  title: "Return | Gidan Plants",
  description: "Shop and explore return at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Return | Gidan Plants",
    description: "Shop and explore return at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/return",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Return | Gidan Plants",
    description: "Shop and explore return at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/return" },
  robots: { index: true, follow: true },
};

export default function ReturnPage() {
  return <ReturnPolicy />;
}
