import type { Metadata } from "next";
import ProfilePage from '@/views/Users/ProfilePage/ProfilePage';


export const metadata: Metadata = {
  title: "Profile | Gidan Plants",
  description: "Shop and explore profile at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile | Gidan Plants",
    description: "Shop and explore profile at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | Gidan Plants",
    description: "Shop and explore profile at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile" },
  robots: { index: false, follow: false },
};

export default function ProfilePageRoute() {
  return <ProfilePage />;
}
