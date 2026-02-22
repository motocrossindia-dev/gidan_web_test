import type { Metadata } from "next";
import Wallet from '@/views/utilities/Wallet/Wallet';


export const metadata: Metadata = {
  title: "Wallet | Gidan Plants",
  description: "View and manage your Gidan wallet balance and history.",
  openGraph: {
    title: "Wallet | Gidan Plants",
    description: "View and manage your Gidan wallet balance and history.",
    url: "https://www.gidan.store/mobilesidebar/walletmobile",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallet | Gidan Plants",
    description: "View and manage your Gidan wallet balance and history.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/walletmobile" },
  robots: { index: true, follow: true },
};

export default function WalletMobilePage() {
  return <Wallet />;
}
