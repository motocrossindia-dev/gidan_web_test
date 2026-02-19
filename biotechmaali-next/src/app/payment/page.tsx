import type { Metadata } from "next";
import PaymentPage from '@/views/utilities/MobileCheckout/PaymentPage';


export const metadata: Metadata = {
  title: "Payment | Gidan Plants",
  description: "Shop and explore payment at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Payment | Gidan Plants",
    description: "Shop and explore payment at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/payment",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment | Gidan Plants",
    description: "Shop and explore payment at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/payment" },
  robots: { index: true, follow: true },
};

export default function PaymentPageRoute() {
  return <PaymentPage />;
}
