import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "New Arrivals - Latest Plants and Products | Gidan",
  description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
  openGraph: {
    title: "New Arrivals - Latest Plants and Products | Gidan",
    description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
    url: "https://www.gidan.store/latest",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals - Latest Plants and Products | Gidan",
    description: "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/latest" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";


export default async function LatestPage() {
  const [initialData, filters] = await Promise.all([
    fetchProductsByFilters({ is_trending: true }),
    fetchFilters("plant")
  ]);

  return (
    <>
      <CollectionSchema
        category={{ name: "Latest", slug: "latest" }}
        products={initialData?.results || []}
      />
      <StoreSchema />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter initialResults={initialData} initialFilterData={filters} />
      </Suspense>
    </>
  );
}
