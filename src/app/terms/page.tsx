import type { Metadata } from "next";
import TermsofServices from '@/components/Footer/TermsofServices';


export const metadata: Metadata = {
  title: "Terms & Conditions | Gidan Store Bangalore",
  description: "Read the terms and conditions for using Gidan Store. Learn about orders, payments, website use and policies for our online plant store in Bangalore.",
  openGraph: {
    title: "Terms & Conditions | Gidan Store Bangalore",
    description: "Read the terms and conditions for using Gidan Store. Learn about orders, payments, website use and policies for our online plant store in Bangalore.",
    url: "https://www.gidan.store/terms",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Gidan Store Bangalore",
    description: "Read the terms and conditions for using Gidan Store. Learn about orders, payments, website use and policies for our online plant store in Bangalore.",
  },
  alternates: { canonical: "https://www.gidan.store/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsofServices />;
}
