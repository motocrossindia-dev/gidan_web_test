import type { Metadata } from "next";
import Stores from '@/views/Stores/Stores';


export const metadata: Metadata = {
  title: "Stores | Gidan Plants",
  description: "Shop and explore stores at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Stores | Gidan Plants",
    description: "Shop and explore stores at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/stores",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stores | Gidan Plants",
    description: "Shop and explore stores at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/stores" },
  robots: { index: true, follow: true },
};

export default function StoresPage() {
  return <Stores />;
}
