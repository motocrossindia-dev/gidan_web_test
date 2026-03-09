import type { Metadata } from "next";
import MyOrders from '@/views/utilities/My Orders/MyOrders';

export const metadata: Metadata = {
  title: "Orders | Gidan Plants",
  description: "Shop and explore orders at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Orders | Gidan Plants",
    description: "Shop and explore orders at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/profile/orders",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orders | Gidan Plants",
    description: "Shop and explore orders at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/profile/orders" },
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <MyOrders />;
}
