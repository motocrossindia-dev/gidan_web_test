import type { Metadata } from "next";
import DealOfWeek from '@/views/utilities/DealOfWeek/DealOfWeek';


export const metadata: Metadata = {
  title: "Deal of the Week | Gidan Plants",
  description: "This week special deals on plants, pots and gardening tools at Gidan.",
  openGraph: {
    title: "Deal of the Week | Gidan Plants",
    description: "This week special deals on plants, pots and gardening tools at Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/dealofweek",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deal of the Week | Gidan Plants",
    description: "This week special deals on plants, pots and gardening tools at Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/dealofweek" },
  robots: { index: true, follow: true },
};

export default function DealOfWeekPage() {
  return <DealOfWeek />;
}
