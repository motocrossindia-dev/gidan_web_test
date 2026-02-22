import type { Metadata } from "next";
import OrderSummary from '@/views/utilities/MobileCheckout/OrderSummary';


export const metadata: Metadata = {
  title: "Order Summary | Gidan Plants",
  description: "Shop and explore order summary at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Order Summary | Gidan Plants",
    description: "Shop and explore order summary at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/order-summary",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Summary | Gidan Plants",
    description: "Shop and explore order summary at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/order-summary" },
  robots: { index: true, follow: true },
};

export default function OrderSummaryPage() {
  return <OrderSummary />;
}
