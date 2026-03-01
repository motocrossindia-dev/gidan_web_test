import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Seasonal | Gidan Plants",
  description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Seasonal | Gidan Plants",
    description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/seasonal",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seasonal | Gidan Plants",
    description: "Shop and explore seasonal at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/seasonal" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";


export default async function SeasonalPage() {
  const [initialData, filters] = await Promise.all([
    fetchProductsByFilters({ is_seasonal_collection: true }),
    fetchFilters("plant")
  ]);

  return (
    <>
      <CollectionSchema
        category={{ name: "Seasonal", slug: "seasonal" }}
        products={initialData?.results || []}
      />
      <StoreSchema />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter initialResults={initialData} initialFilterData={filters} />
      </Suspense>
    </>
  );
}
