import type { Metadata } from "next";
import CheckoutClient from './CheckoutClient';


export const metadata: Metadata = {
  title: "Checkout | Gidan Plants",
  description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
  openGraph: {
    title: "Checkout | Gidan Plants",
    description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
    url: "https://gidanbackendtest.mymotokart.in/checkout",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | Gidan Plants",
    description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPageRoute() {
  return <CheckoutClient />;
}
