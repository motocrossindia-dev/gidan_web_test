import type { Metadata } from "next";
import ReferAFriend from '@/views/Users/ReferAFriend/ReferAFriend';


export const metadata: Metadata = {
  title: "Profile - Referal | Gidan Plants",
  description: "Shop and explore profile - referal at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Referal | Gidan Plants",
    description: "Shop and explore profile - referal at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/referal",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Referal | Gidan Plants",
    description: "Shop and explore profile - referal at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/referal" },
  robots: { index: true, follow: true },
};

export default function ReferalPage() {
  return <ReferAFriend />;
}
