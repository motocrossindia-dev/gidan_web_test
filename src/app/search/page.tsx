import type { Metadata } from "next";
import PlantCare from '@/views/utilities/PlantCare/PlantCare';


export const metadata: Metadata = {
  title: "Search Plants and Products | Gidan",
  description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
  openGraph: {
    title: "Search Plants and Products | Gidan",
    description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/search",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Plants and Products | Gidan",
    description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/search" },
  robots: { index: true, follow: true },
};

import React, { Suspense } from 'react';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <PlantCare />
    </Suspense>
  );
}
