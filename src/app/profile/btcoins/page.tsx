import type { Metadata } from "next";
import BTcoinsClient from '@/app/btcoins/BTcoinsClient';


export const metadata: Metadata = {
  title: "Profile - Btcoins | Gidan Plants",
  description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Btcoins | Gidan Plants",
    description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/btcoins",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Btcoins | Gidan Plants",
    description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/btcoins" },
  robots: { index: true, follow: true },
};

export default function ProfileBTcoinsPage() {
  return <BTcoinsClient />;
}
