import type { Metadata } from "next";
import BTcoins from '@/views/utilities/Wallet/BTcoins';


export const metadata: Metadata = {
  title: "Profile - Btcoins | Gidan Plants",
  description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Btcoins | Gidan Plants",
    description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/profile/btcoins",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Btcoins | Gidan Plants",
    description: "Shop and explore profile - btcoins at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/profile/btcoins" },
  robots: { index: true, follow: true },
};

export default function ProfileBTcoinsPage() {
  return <BTcoins />;
}
