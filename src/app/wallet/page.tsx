import type { Metadata } from "next";
import Wallet from '@/views/utilities/Wallet/Wallet';


export const metadata: Metadata = {
  title: "Wallet | Gidan Plants",
  description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Wallet | Gidan Plants",
    description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/wallet",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallet | Gidan Plants",
    description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/wallet" },
  robots: { index: false, follow: false },
};

export default function WalletPage() {
  return <Wallet />;
}
