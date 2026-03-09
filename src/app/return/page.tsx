import type { Metadata } from "next";
import ReturnPolicy from '@/components/Footer/ReturnPolicy';


export const metadata: Metadata = {
  title: "Return Policy | Gidan Store Bangalore",
  description: "Read the return and replacement policy of Gidan Store. Learn how we handle damaged plants, refunds and customer support for orders.",
  openGraph: {
    title: "Return Policy | Gidan Store Bangalore",
    description: "Read the return and replacement policy of Gidan Store. Learn how we handle damaged plants, refunds and customer support for orders.",
    url: "https://gidanbackendtest.mymotokart.in/return",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Return Policy | Gidan Store Bangalore",
    description: "Read the return and replacement policy of Gidan Store. Learn how we handle damaged plants, refunds and customer support for orders.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/return" },
  robots: { index: true, follow: true },
};

export default function ReturnPage() {
  return <ReturnPolicy />;
}
