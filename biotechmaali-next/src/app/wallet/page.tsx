import type { Metadata } from "next";
import Wallet from '@/views/utilities/Wallet/Wallet';


export const metadata: Metadata = {
  title: "Wallet | Gidan Plants",
  description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Wallet | Gidan Plants",
    description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/wallet",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallet | Gidan Plants",
    description: "Shop and explore wallet at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/wallet" },
  robots: { index: true, follow: true },
};

export default function WalletPage() {
  return <Wallet />;
}
