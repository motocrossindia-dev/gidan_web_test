import type { Metadata } from "next";
import Faqs from '@/components/Footer/Faqs';


export const metadata: Metadata = {
  title: "FAQ | Gidan Plants",
  description: "Find answers to common questions about ordering plants, delivery, care tips and returns at Gidan.",
  openGraph: {
    title: "FAQ | Gidan Plants",
    description: "Find answers to common questions about ordering plants, delivery, care tips and returns at Gidan.",
    url: "https://www.gidan.store/faq",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Gidan Plants",
    description: "Find answers to common questions about ordering plants, delivery, care tips and returns at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/faq" },
  robots: { index: true, follow: true },
};

export default function FaqPage() {
  return <Faqs />;
}
