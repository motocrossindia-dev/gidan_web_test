import type { Metadata } from "next";
import ShippingPolicy from '@/components/Footer/ShippingPolicy';


export const metadata: Metadata = {
  title: "Shipping Policy | Plant Delivery in Bangalore | Gidan",
  description: "Learn about plant delivery and shipping policies at Gidan Store. Find details on delivery timelines, locations and order processing in Bangalore.",
  openGraph: {
    title: "Shipping Policy | Plant Delivery in Bangalore | Gidan",
    description: "Learn about plant delivery and shipping policies at Gidan Store. Find details on delivery timelines, locations and order processing in Bangalore.",
    url: "https://gidanbackendtest.mymotokart.in/shipping",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | Plant Delivery in Bangalore | Gidan",
    description: "Learn about plant delivery and shipping policies at Gidan Store. Find details on delivery timelines, locations and order processing in Bangalore.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/shipping" },
  robots: { index: true, follow: true },
};

export default function ShippingPage() {
  return <ShippingPolicy />;
}
