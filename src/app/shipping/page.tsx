import type { Metadata } from "next";
import ShippingPolicy from '@/components/Footer/ShippingPolicy';


export const metadata: Metadata = {
  title: "Shipping | Gidan Plants",
  description: "Shop and explore shipping at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Shipping | Gidan Plants",
    description: "Shop and explore shipping at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/shipping",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping | Gidan Plants",
    description: "Shop and explore shipping at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/shipping" },
  robots: { index: true, follow: true },
};

export default function ShippingPage() {
  return <ShippingPolicy />;
}
