import type { Metadata } from "next";
import React, { Suspense } from 'react';
import PlantCare from '@/views/utilities/PlantCare/PlantCare';
import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";

export const metadata: Metadata = {
  title: "Search Plants and Products | Gidan",
  description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
  openGraph: {
    title: "Search Plants and Products | Gidan",
    description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
    url: "https://www.gidan.store/search",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Plants and Products | Gidan",
    description: "Browse search results for plants, pots, seeds and gardening products at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/search" },
  robots: { index: true, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string; type?: string }> }) {
  const { query = "", type = "" } = await searchParams;

  // 1. Fetch initial search results and filters on the server
  // We fetch at most 100 for SEO/Initial paint, client-side pagination handles the rest
  const [initialData, initialFilters] = await Promise.all([
    fetchProductsByFilters({ search: query, type: type || "" }),
    fetchFilters(type || "plant"), // Default to plant for general filters if no type selected
  ]);

  // Extract initial SEO data from the products call
  const initialSEOData = (initialData as any)?.category_info?.category_info || null;

  return (
    <Suspense fallback={<div className="flex justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#375421]"></div>
    </div>}>
      <PlantCare
        initialResults={initialData}
        initialFilterData={initialFilters}
        initialSEOData={initialSEOData}
      />
    </Suspense>
  );
}
