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
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    const categories = data?.data?.categories || [];
    const slugs = new Set<string>(categories.map((c: any) => c.slug));
    // Manually add 'gifts' or 'gift' to support the gifts route
    slugs.add('gifts');
    slugs.add('gift');
    return slugs;
  } catch (err) {
    console.error("Error fetching category slugs", err);
    return new Set<string>(['gifts', 'gift']); // Fallback to at least supporting gifts
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
    'plant-care': 'plantcare',
    'gifts': 'gift'
  };
  const categorySlugLower = categorySlug.toLowerCase();
  const typeKey = categoryToTypeMap[categorySlugLower] || (categorySlugLower === 'gifts' || categorySlugLower === 'gift' ? "gift" : "plant");

  const [category, subcategories] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchSubcategories(categorySlug),
  ]);

  const isGiftCategory = categorySlugLower === 'gifts' || categorySlugLower === 'gift';
  // Handle 'gifts' specially if not in standard category API
  if (!category && isGiftCategory) {
    const giftCategoryData = {
        id: "",
        name: "Gifts",
        slug: categorySlug,
        subCategory: []
    };
    
    // We can still try to fetch filters even without a category object
    const filters = await fetchFilters(typeKey, undefined);
    const initialData = await fetchProductsByFilters({
        type: typeKey,
        category_id: undefined,
    });

    return (
        <Suspense fallback={<div className="flex justify-center p-8">Loading gifts...</div>}>
            <PlantFilter
                initialResults={initialData}
                initialCategoryData={giftCategoryData}
                initialFilterData={filters}
                categorySlug={categorySlug}
            />
        </Suspense>
    );
  }

  if (!category) notFound();

  // Special handling for gifts - backend needs type='gift' and category_id=''
  const effectiveCategoryId = isGiftCategory ? "" : category.id;

  const filters = await fetchFilters(typeKey, category.id);

  // Attach subCategory to category object for PlantFilter
  const categoryWithSubs = { ...category, subCategory: subcategories };

  // 2. Fetch initial products
  const initialData = await fetchProductsByFilters({
    type: typeKey,
    category_id: effectiveCategoryId,
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
