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
    const slugs = new Set(data?.data?.categories?.map((c: any) => c.slug) || []);
    slugs.add('gifts');
    slugs.add('gift');
    return slugs;
  } catch (err) {
    return new Set(['gifts', 'gift']);
  }
}

async function getValidSubcategorySlugs(categorySlug: string): Promise<Set<string>> {
  if (categorySlug === 'gifts' || categorySlug === 'gift') return new Set(); // Gifts don't have standard subcategory validation in this context
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
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";

export default async function SubcategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;

  // 1. Fetch category, subcategory, subcategories list, and filters data on server
  const categoryToTypeMap: Record<string, string> = {
    'plants': 'plant',
    'pots': 'pot',
    'seeds': 'seed',
    'plant-care': 'plantcare',
    'gift': 'gift',
    'gifts': 'gift'
  };
  const categorySlugLower = categorySlug.toLowerCase();
  const typeKey = categoryToTypeMap[categorySlugLower] || "plant";

  const [category, subcategory, subcategoriesList] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchSubcategoryBySlug(categorySlug, subcategorySlug),
    fetchSubcategories(categorySlug),
  ]);

  if (!category && (categorySlugLower === 'gifts' || categorySlugLower === 'gift')) {
    const giftCategoryData = {
        id: "",
        name: "Gifts",
        slug: categorySlug,
        subCategory: []
    };
    
    // We can still try to fetch filters even without a category object
    const filters = await fetchFilters(typeKey, "");
    const initialData = await fetchProductsByFilters({
        type: typeKey,
        category_id: "",
        subcategory_id: "", 
    });

    return (
        <Suspense fallback={<div className="flex justify-center p-8">Loading gifts...</div>}>
            <PlantFilter
                initialResults={initialData}
                initialCategoryData={giftCategoryData}
                initialFilterData={filters}
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
            />
        </Suspense>
    );
  }

  if (!category || !subcategory) notFound();

  const filters = await fetchFilters(typeKey, category.id);

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

  // Backend returns sub_category_info.{ title, subtitle, description } on each subcategory object
  // Passed as initialSEOData to PlantFilter for SSR first paint + reactive client-side updates
  const subInfo = (subcategory as any).sub_category_info;
  const initialSEOData = {
    title: subInfo?.title || subcategory.name,
    subtitle: subInfo?.subtitle || `${subcategory.name} - Buy Online in India from Gidan.store`,
    description: subInfo?.description || "",
  };

  return (
    <>
      <CollectionSchema
        category={{ name: category.name, slug: category.slug }}
        subcategory={{ name: subcategory.name, slug: subcategory.slug }}
        products={initialData?.results || []}
      />
      <Suspense fallback={<div className="flex justify-center p-8">Loading products...</div>}>
        {/* @ts-ignore */}
        <PlantFilter
          initialResults={initialData}
          initialCategoryData={categoryWithSubs}
          initialFilterData={filters}
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
          subcategoryName={subcategory.name}
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
