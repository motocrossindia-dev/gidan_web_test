import type { Metadata } from "next";
import Comingsoon from '@/views/utilities/Gifts/Comingsoon';


export const metadata: Metadata = {
  title: "Profile - Giftcard | Gidan Plants",
  description: "Shop and explore profile - giftcard at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Giftcard | Gidan Plants",
    description: "Shop and explore profile - giftcard at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/giftcard",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Giftcard | Gidan Plants",
    description: "Shop and explore profile - giftcard at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/giftcard" },
  robots: { index: true, follow: true },
};

export default function ProfileGiftCardPage() {
  return <Comingsoon />;
}
