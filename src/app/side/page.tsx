import type { Metadata } from "next";
import SideParrot from '@/views/Users/SideBar/SideParrot';


export const metadata: Metadata = {
  title: "Side | Gidan Plants",
  description: "Shop and explore side at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Side | Gidan Plants",
    description: "Shop and explore side at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/side",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Side | Gidan Plants",
    description: "Shop and explore side at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/side" },
  robots: { index: true, follow: true },
};

export default function SidePage() {
  return <SideParrot />;
}
