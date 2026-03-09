import type { Metadata } from "next";
import WalletHistory from '@/views/utilities/Wallet/WalletHistory';


export const metadata: Metadata = {
  title: "Profile - Wallethistory | Gidan Plants",
  description: "Shop and explore profile - wallethistory at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Wallethistory | Gidan Plants",
    description: "Shop and explore profile - wallethistory at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/wallethistory",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Wallethistory | Gidan Plants",
    description: "Shop and explore profile - wallethistory at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/wallethistory" },
  robots: { index: true, follow: true },
};

export default function ProfileWalletHistoryPage() {
  return <WalletHistory />;
}
