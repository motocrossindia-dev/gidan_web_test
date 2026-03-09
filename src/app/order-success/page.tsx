import type { Metadata } from "next";
import OrderSuccess from '@/views/utilities/MobileCheckout/OrderSuccess';


export const metadata: Metadata = {
  title: "Order Success | Gidan Plants",
  description: "Shop and explore order success at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Order Success | Gidan Plants",
    description: "Shop and explore order success at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/order-success",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Success | Gidan Plants",
    description: "Shop and explore order success at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/order-success" },
  robots: { index: true, follow: true },
};

export default function OrderSuccessPage() {
  return <OrderSuccess />;
}
