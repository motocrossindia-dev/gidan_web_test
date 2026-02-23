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
    title: `${subName} - ${catName} | Gidan`,
    description: `Buy ${subName.toLowerCase()} in ${catName.toLowerCase()} category at Gidan. Browse our collection of plants, pots and garden accessories.`,
    openGraph: {
      title: `${subName} - ${catName} | Gidan`,
      description: `Shop ${subName.toLowerCase()} ${catName.toLowerCase()} at Gidan Plants India.`,
      url: `https://www.gidan.store/${categorySlug}/${subcategorySlug}/`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}/${subcategorySlug}/` },
  };
}

import { fetchCategoryBySlug, fetchSubcategoryBySlug, fetchProductsByFilters, fetchSubcategories, fetchFilters } from "@/utils/serverApi";

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
    fetchFilters(typeKey)
  ]);

  if (!category || !subcategory) notFound();

  // Attach subcategories for the filter sidebar and crawlers
  const categoryWithSubs = {
    ...category,
    subCategory: subcategoriesList,
    subCategoryId: subcategory.id
  };

  const initialResults = await fetchProductsByFilters({
    type: typeKey,
    subcategory_id: subcategory.id
  });

  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
      <PlantFilter
        initialResults={initialResults}
        initialCategoryData={categoryWithSubs}
        initialFilterData={filters}
      />
    </Suspense>
  );
}
