import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string }> };

// Fetch valid category slugs
async function getValidCategorySlugs(): Promise<Set<string>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set();
    const data = await res.json();
    return new Set(data?.data?.categories?.map((c: any) => c.slug) || []);
  } catch (err) {
    return new Set();
  }
}

// Fetch valid subcategory slugs for a given category
async function getValidSubcategorySlugs(categorySlug: string): Promise<Set<string>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/categoryWiseSubCategory/${categorySlug}/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set();
    const data = await res.json();
    return new Set(data?.data?.subCategorys?.map((sc: any) => sc.slug) || []);
  } catch (err) {
    return new Set();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;

  const validCatSlugs = await getValidCategorySlugs();
  const validSubSlugs = await getValidSubcategorySlugs(categorySlug);

  if (validCatSlugs.size > 0 && !validCatSlugs.has(categorySlug)) return {};
  if (validSubSlugs.size > 0 && !validSubSlugs.has(subcategorySlug)) return {};

  const catName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const subName = subcategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Buy ${subName} ${catName} Online India | Gidan`,
    description: `Shop the best ${subName.toLowerCase()} ${catName.toLowerCase()} online at Gidan. Quality gardening products with fast delivery across India.`,
    openGraph: {
      title: `Buy ${subName} ${catName} Online India | Gidan`,
      description: `Browse our collection of ${subName.toLowerCase()} ${catName.toLowerCase()} at Gidan. Premium selection for your home and garden.`,
      url: `/${categorySlug}/${subcategorySlug}/`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `/${categorySlug}/${subcategorySlug}/` },
  };
}

import { fetchCategoryBySlug, fetchSubcategoryBySlug, fetchProductsByFilters, fetchSubcategories, fetchFilters } from "@/utils/serverApi";
import CategoryStaticSEO from "@/views/utilities/Info/CategoryStaticSEO";
import RecentlyViewedProducts from "@/components/Shared/RecentlyViewedProducts";
import CheckoutStores from "@/views/utilities/PlantFilter/CheckoutStores";

export default async function SubcategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;

  // 1. Fetch category, subcategory, subcategories list, and filters data on server
  const categoryToTypeMap: Record<string, string> = {
    'plants': 'plant',
    'pots': 'pot',
    'seeds': 'seed',
    'plant-care': 'plantcare'
  };
  const typeKey = categoryToTypeMap[categorySlug.toLowerCase()] || "plant";

  const [category, subcategory, subcategoriesList, filters] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchSubcategoryBySlug(categorySlug, subcategorySlug),
    fetchSubcategories(categorySlug),
    fetchFilters(typeKey, (await fetchCategoryBySlug(categorySlug))?.id)
  ]);

  if (!category || !subcategory) notFound();

  // Attach subcategories for the filter sidebar and crawlers
  const categoryWithSubs = {
    ...category,
    subCategory: subcategoriesList,
    subCategoryId: subcategory.id
  };

  const initialData = await fetchProductsByFilters({
    type: typeKey,
    subcategory_id: subcategory.id
  });

  return (
    <>
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        <PlantFilter
          initialResults={initialData}
          initialCategoryData={categoryWithSubs}
          initialFilterData={filters}
        />
      </Suspense>

      <div className="space-y-12 mt-12 mb-8">
        <RecentlyViewedProducts />
        <CategoryStaticSEO
          categorySlug={categorySlug}
          subcategoryName={subcategory.name}
          subcategorySlug={subcategorySlug}
          isSubcategory={true}
        />
        <CheckoutStores />
      </div>
    </>
  );
}
