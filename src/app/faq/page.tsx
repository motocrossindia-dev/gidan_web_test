import type { Metadata } from "next";
import Faqs from '@/components/Footer/Faqs';
import FAQSchema from '@/views/utilities/seo/FAQSchema';


export const metadata: Metadata = {
  title: "Gidan Store FAQs | Plants Delivery & Care Questions",
  description: "Find answers to common questions about plant delivery, plant care and orders at Gidan Store in Bangalore.",
  openGraph: {
    title: "Gidan Store FAQs | Plants Delivery & Care Questions",
    description: "Find answers to common questions about plant delivery, plant care and orders at Gidan Store in Bangalore.",
    url: "https://www.gidan.store/faq",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidan Store FAQs | Plants Delivery & Care Questions",
    description: "Find answers to common questions about plant delivery, plant care and orders at Gidan Store in Bangalore.",
  },
  alternates: { canonical: "https://www.gidan.store/faq" },
  robots: { index: true, follow: true },
};

export default function FaqPage() {
  return (
    <>
      <FAQSchema />
      <Faqs />
    </>
  );
}
