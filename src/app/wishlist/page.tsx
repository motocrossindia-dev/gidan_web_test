import type { Metadata } from "next";
import WishList from '@/views/utilities/WishList/WishList';


export const metadata: Metadata = {
  title: "Wishlist | Gidan Plants",
  description: "Shop and explore wishlist at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Wishlist | Gidan Plants",
    description: "Shop and explore wishlist at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/wishlist",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishlist | Gidan Plants",
    description: "Shop and explore wishlist at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/wishlist" },
  robots: { index: true, follow: true },
};

export default function WishlistPage() {
  return <WishList />;
}
