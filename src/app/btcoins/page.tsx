import type { Metadata } from "next";
import BTcoinsClient from './BTcoinsClient';


export const metadata: Metadata = {
  title: "BT Coins | Gidan Rewards",
  description: "Earn and redeem BT Coins on your Gidan purchases. Check your coins balance and history.",
  openGraph: {
    title: "BT Coins | Gidan Rewards",
    description: "Earn and redeem BT Coins on your Gidan purchases. Check your coins balance and history.",
    url: "https://www.gidan.store/btcoins",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BT Coins | Gidan Rewards",
    description: "Earn and redeem BT Coins on your Gidan purchases. Check your coins balance and history.",
  },
  alternates: { canonical: "https://www.gidan.store/btcoins" },
  robots: { index: true, follow: true },
};

export default function BTcoinsPage() {
  return <BTcoinsClient />;
}
