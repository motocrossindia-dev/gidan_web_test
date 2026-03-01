import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Featured Products | Gidan Plants",
  description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
  openGraph: {
    title: "Featured Products | Gidan Plants",
    description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
    url: "https://www.gidan.store/featured",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured Products | Gidan Plants",
    description: "Hand-picked featured plants and gardening products curated by the Gidan team.",
  },
  alternates: { canonical: "https://www.gidan.store/featured" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";


export default async function FeaturedPage() {
  const [initialData, filters] = await Promise.all([
    fetchProductsByFilters({ is_featured: true }),
    fetchFilters("plant") // Default to plant for general special collections
  ]);

  return (
    <>
      <CollectionSchema
        category={{ name: "Featured", slug: "featured" }}
        products={initialData?.results || []}
      />
      <StoreSchema />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter initialResults={initialData} initialFilterData={filters} />
      </Suspense>
    </>
  );
}
