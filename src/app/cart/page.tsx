import type { Metadata } from "next";
import Cart from '@/views/CartProducts/Cart/Cart';


export const metadata: Metadata = {
  title: "Your Cart | Gidan Plants",
  description: "Review the plants and products in your shopping cart at Gidan.",
  openGraph: {
    title: "Your Cart | Gidan Plants",
    description: "Review the plants and products in your shopping cart at Gidan.",
    url: "https://www.gidan.store/cart",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Cart | Gidan Plants",
    description: "Review the plants and products in your shopping cart at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/cart" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <Cart />;
}
