import type { Metadata } from "next";
import WalletHistory from '@/views/utilities/Wallet/WalletHistory';


export const metadata: Metadata = {
  title: "Wallethistory | Gidan Plants",
  description: "Shop and explore wallethistory at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Wallethistory | Gidan Plants",
    description: "Shop and explore wallethistory at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/wallethistory",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallethistory | Gidan Plants",
    description: "Shop and explore wallethistory at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/wallethistory" },
  robots: { index: true, follow: true },
};

export default function WalletHistoryPage() {
  return <WalletHistory />;
}
