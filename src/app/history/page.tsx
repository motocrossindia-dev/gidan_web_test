import type { Metadata } from "next";
import BTCoinsHistory from '@/views/utilities/Wallet/BTCoinsHistory';


export const metadata: Metadata = {
  title: "Order History | Gidan Plants",
  description: "View your complete order history and past purchases at Gidan.",
  openGraph: {
    title: "Order History | Gidan Plants",
    description: "View your complete order history and past purchases at Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/history",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order History | Gidan Plants",
    description: "View your complete order history and past purchases at Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/history" },
  robots: { index: true, follow: true },
};

export default function HistoryPage() {
  return <BTCoinsHistory />;
}
