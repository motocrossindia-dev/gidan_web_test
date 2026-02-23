import type { Metadata } from "next";
import CheckoutClient from './CheckoutClient';


export const metadata: Metadata = {
  title: "Checkout | Gidan Plants",
  description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
  openGraph: {
    title: "Checkout | Gidan Plants",
    description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
    url: "https://www.gidan.store/checkout",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | Gidan Plants",
    description: "Complete your purchase at Gidan. Secure checkout powered by Razorpay.",
  },
  alternates: { canonical: "https://www.gidan.store/checkout" },
  robots: { index: true, follow: true },
};

export default function CheckoutPageRoute() {
  return <CheckoutClient />;
}
