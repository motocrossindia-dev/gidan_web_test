import type { Metadata } from "next";
import Featured from '@/views/utilities/Featured/Featured';


export const metadata: Metadata = {
  title: "Featured Plants | Gidan",
  description: "Browse featured plants and gardening products collection at Gidan.",
  openGraph: {
    title: "Featured Plants | Gidan",
    description: "Browse featured plants and gardening products collection at Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/feature",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured Plants | Gidan",
    description: "Browse featured plants and gardening products collection at Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/feature" },
  robots: { index: true, follow: true },
};

export default function FeaturePage() {
  return <Featured />;
}
