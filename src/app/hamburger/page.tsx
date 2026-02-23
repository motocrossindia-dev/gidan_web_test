import type { Metadata } from "next";
import Hamburger from '@/views/utilities/Hamburger/Hamburger';


export const metadata: Metadata = {
  title: "Menu | Gidan Plants",
  description: "Explore all categories at Gidan Plants.",
  openGraph: {
    title: "Menu | Gidan Plants",
    description: "Explore all categories at Gidan Plants.",
    url: "https://www.gidan.store/hamburger",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu | Gidan Plants",
    description: "Explore all categories at Gidan Plants.",
  },
  alternates: { canonical: "https://www.gidan.store/hamburger" },
  robots: { index: true, follow: true },
};

export default function HamburgerPage() {
  return <Hamburger />;
}
