import type { Metadata } from "next";
import Wallet from '@/views/utilities/Wallet/Wallet';


export const metadata: Metadata = {
  title: "Profile - Wallet | Gidan Plants",
  description: "Shop and explore profile - wallet at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Wallet | Gidan Plants",
    description: "Shop and explore profile - wallet at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/wallet",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Wallet | Gidan Plants",
    description: "Shop and explore profile - wallet at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/wallet" },
  robots: { index: true, follow: true },
};

export default function ProfileWalletPage() {
  return <Wallet />;
}
