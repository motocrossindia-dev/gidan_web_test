import type { Metadata } from "next";
import PaymentGateway from '@/views/utilities/PaymentGateway/PaymentGateway';


export const metadata: Metadata = {
  title: "Payment | Gidan Plants",
  description: "Complete your payment securely at Gidan.",
  openGraph: {
    title: "Payment | Gidan Plants",
    description: "Complete your payment securely at Gidan.",
    url: "https://www.gidan.store/PaymentGateway",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment | Gidan Plants",
    description: "Complete your payment securely at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/PaymentGateway" },
  robots: { index: true, follow: true },
};

export default function PaymentGatewayPage() {
  return <PaymentGateway />;
}
