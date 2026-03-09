import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Trending | Gidan Plants",
  description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Trending | Gidan Plants",
    description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/trending",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending | Gidan Plants",
    description: "Shop and explore trending at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/trending" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";


export default async function TrendingPage() {
  const [initialData, filters] = await Promise.all([
    fetchProductsByFilters({ is_trending: true }),
    fetchFilters("plant")
  ]);

  return (
    <>
      <CollectionSchema
        category={{ name: "Trending", slug: "trending" }}
        products={initialData?.results || []}
      />
      <StoreSchema />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter initialResults={initialData} initialFilterData={filters} />
      </Suspense>
    </>
  );
}
