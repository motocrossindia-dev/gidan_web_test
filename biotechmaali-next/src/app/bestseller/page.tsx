import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Best Selling Plants and Pots | Gidan",
  description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
  openGraph: {
    title: "Best Selling Plants and Pots | Gidan",
    description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
    url: "https://www.gidan.store/bestseller",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Selling Plants and Pots | Gidan",
    description: "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands.",
  },
  alternates: { canonical: "https://www.gidan.store/bestseller" },
  robots: { index: true, follow: true },
};

import { fetchProductsByFilters, fetchFilters } from "@/utils/serverApi";

export default async function BestSellerPage() {
  const [initialResults, filters] = await Promise.all([
    fetchProductsByFilters({ is_best_seller: true }),
    fetchFilters("plant")
  ]);

  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
      <PlantFilter initialResults={initialResults} initialFilterData={filters} />
    </Suspense>
  );
}
