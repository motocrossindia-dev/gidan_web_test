import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop All Plants, Pots & Gardening Products Online | Gidan",
  description: "Browse the complete Gidan collection — plants, pots, seeds, plant care essentials and more. Shop online and get doorstep delivery across Bangalore & India.",
  openGraph: {
    title: "Shop All Plants, Pots & Gardening Products Online | Gidan",
    description: "Browse the complete Gidan collection — plants, pots, seeds, plant care essentials and more. Shop online and get doorstep delivery across Bangalore & India.",
    url: "https://www.gidan.store/shop",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Plants, Pots & Gardening Products Online | Gidan",
    description: "Browse the complete Gidan collection — plants, pots, seeds, plant care essentials and more.",
  },
  alternates: { canonical: "https://www.gidan.store/shop" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters, fetchPublicFlags } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";


export default async function ShopPage() {
  // Fetch ALL products with no flag/type filter — returns the full catalog
  const [initialData, filters, publicFlags] = await Promise.all([
    fetchProductsByFilters({ type: "" }),
    fetchFilters(""),
    fetchPublicFlags()
  ]);

  const shopSEOData = {
    heading_before: "Shop All",
    italic_text: "Products",
    heading_after: "Online",
    description: "Explore our complete collection of plants, pots, seeds, and plant care essentials. Find everything you need for your garden, delivered to your doorstep.",
  };

  return (
    <>
      <CollectionSchema
        category={{ name: "Shop All", slug: "shop" }}
        products={initialData?.results || []}
      />
      <StoreSchema />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter 
            initialResults={initialData as any} 
            initialFilterData={filters as any} 
            initialFlags={publicFlags as any}
            initialSEOData={shopSEOData as any}
        />
      </Suspense>
    </>
  );
}
