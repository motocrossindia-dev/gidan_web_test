import type { Metadata } from "next";
import BTCoinsHistory from '@/views/utilities/Wallet/BTCoinsHistory';


export const metadata: Metadata = {
  title: "Profile - History | Gidan Plants",
  description: "Shop and explore profile - history at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - History | Gidan Plants",
    description: "Shop and explore profile - history at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/history",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - History | Gidan Plants",
    description: "Shop and explore profile - history at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/history" },
  robots: { index: true, follow: true },
};

export default function ProfileHistoryPage() {
  return <BTCoinsHistory />;
}
