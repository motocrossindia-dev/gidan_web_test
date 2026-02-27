import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";

type Props = { params: Promise<{ categorySlug: string }> };

// Fetch valid category slugs from the backend
async function getValidCategorySlugs(): Promise<Set<string>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set();
    const data = await res.json();
    const categories = data?.data?.categories || [];
    return new Set(categories.map((c: any) => c.slug));
  } catch (err) {
    console.error("Error fetching category slugs", err);
    return new Set();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;

  const validSlugs = await getValidCategorySlugs();
  if (validSlugs.size > 0 && !validSlugs.has(categorySlug)) return {};

  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Buy ${name} Online India | Best Collection | Gidan`,
    description: `Shop the best ${name.toLowerCase()} for your home and garden at Gidan. Wide variety of ${name.toLowerCase()} available online with fast delivery across India.`,
    openGraph: {
      title: `Buy ${name} Online India | Gidan`,
      description: `Browse our extensive collection of ${name.toLowerCase()} at Gidan. Quality products, competitive prices, and fast shipping in India.`,
      url: `/${categorySlug}/`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `/${categorySlug}/` },
  };
}

import { fetchCategoryBySlug, fetchSubcategoryBySlug, fetchProductsByFilters, fetchSubcategories, fetchFilters } from "@/utils/serverApi";
import CategoryStaticSEO from "@/views/utilities/Info/CategoryStaticSEO";
import RecentlyViewedProducts from "@/components/Shared/RecentlyViewedProducts";
import CheckoutStores from "@/views/utilities/PlantFilter/CheckoutStores";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  // 1. Fetch category, subcategories, and filters data on server in parallel
  const categoryToTypeMap: Record<string, string> = {
    'plants': 'plant',
    'pots': 'pot',
    'seeds': 'seed',
    'plant-care': 'plantcare'
  };
  const typeKey = categoryToTypeMap[categorySlug.toLowerCase()] || "plant";

  const [category, subcategories, filters] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchSubcategories(categorySlug),
    fetchFilters(typeKey, (await fetchCategoryBySlug(categorySlug))?.id)
  ]);

  if (!category) notFound();

  // Attach subCategory to category object for PlantFilter
  const categoryWithSubs = { ...category, subCategory: subcategories };

  // 2. Fetch initial products for this category using the already derived typeKey
  const initialData = await fetchProductsByFilters({
    type: typeKey,
    category_id: category.id,
  });

  // Extract SEO content — passed into PlantFilter as initialSEOData so it's SSR on first paint
  // and reactive when client-side subcategory filter changes
  const initialSEOData = (initialData as any)?.category_info?.category_info || null;

  return (
    <>
      <CollectionSchema
        category={{ name: category.name, slug: category.slug }}
        products={initialData?.results || []}
      />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        {/* @ts-ignore */}
        <PlantFilter
          initialResults={initialData}
          initialCategoryData={categoryWithSubs}
          initialFilterData={filters}
          categorySlug={categorySlug}
          initialSEOData={initialSEOData}
        />
      </Suspense>

      <div className="space-y-12 mt-12 mb-8">
        <RecentlyViewedProducts />
        <CheckoutStores />
      </div>
    </>
  );
}
