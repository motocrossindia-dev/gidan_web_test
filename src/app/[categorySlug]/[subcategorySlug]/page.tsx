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
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    const slugs = new Set<string>(data?.data?.categories?.map((c: any) => c.slug) || []);
    slugs.add('gifts');
    slugs.add('gift');
    return slugs;
  } catch (err) {
    return new Set<string>(['gifts', 'gift']);
  }
}

async function getValidSubcategorySlugs(categorySlug: string): Promise<Set<string>> {
  if (categorySlug === 'gifts' || categorySlug === 'gift') return new Set<string>(); // Gifts don't have standard subcategory validation in this context
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/categoryWiseSubCategory/${categorySlug}/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    return new Set<string>(data?.data?.subCategorys?.map((sc: any) => sc.slug) || []);
  } catch (err) {
    return new Set<string>();
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
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import CategoryHero from "@/components/Shared/CategoryHero";
import TrustBadges from "@/components/Shared/TrustBadges";

export default async function SubcategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;

  // 1. Fetch category and subcategory in parallel as first step
  const [category, subcategory, subcategoriesList] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchSubcategoryBySlug(categorySlug, subcategorySlug),
    fetchSubcategories(categorySlug),
  ]);

  const categorySlugLower = categorySlug.toLowerCase();

  // Handle 'gifts' specially if not in standard category API, otherwise resolve typeKey dynamically
  const isGiftCategory = categorySlugLower === 'gifts' || categorySlugLower === 'gift';
  const effectiveCategory = category || (isGiftCategory ? { id: null, name: "Gifts", slug: categorySlug, type: "gift" } : null);

  if (!effectiveCategory || (!isGiftCategory && !subcategory)) notFound();

  // Dynamically resolve typeKey from backend category object, fallback to 'plant'
  const typeKey = (effectiveCategory as any).type || "plant";
  const effectiveId = effectiveCategory.id ? effectiveCategory.id.toString() : null;

  if (!category && (categorySlugLower === 'gifts' || categorySlugLower === 'gift')) {
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
        subcategory_id: undefined, 
    });

    return (
        <Suspense fallback={<div className="flex justify-center p-8">Loading gifts...</div>}>
            <PlantFilter
                initialResults={initialData as any}
                initialCategoryData={giftCategoryData as any}
                initialFilterData={filters as any}
                categorySlug={categorySlug as any}
                subcategorySlug={subcategorySlug as any}
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
    category_id: category.id,
    subcategory_id: subcategory.id
  });

  // Backend returns sub_category_info.{ title, subtitle, description } on each subcategory object
  // Passed as initialSEOData to PlantFilter for SSR first paint + reactive client-side updates
  const subInfo = (subcategory as any).sub_category_info;
  const catInfo = (category as any).category_info?.category_info || (category as any).category_info;
  
  // Extract info_cards correctly from subcategory or fallback to category
  const subInfoCards = (subcategory as any).info_cards || subInfo?.info_cards;
  const catInfoCards = catInfo?.info_cards || [];

  const initialSEOData = {
    title: subInfo?.title || subcategory.name,
    subtitle: subInfo?.subtitle || `${subcategory.name} - Buy Online in India from Gidan.store`,
    description: subInfo?.description || "",
    info_cards: (subInfoCards && subInfoCards.length > 0) ? subInfoCards : catInfoCards,
    tags: subInfo?.tags || [],
    stats: subInfo?.stats || [],
    heading_before: subInfo?.heading_before || "",
    italic_text: subInfo?.italic_text || "",
    heading_after: subInfo?.heading_after || ""
  };

  const breadcrumbItems: { label: string; path: string }[] = [
    {
        label: category.name,
        path: `/${category.slug}/`
    }
  ];
  const breadcrumbPage = subcategory.name;

  return (
    <>
      <CollectionSchema
        category={{ name: category.name, slug: category.slug }}
        subcategory={{ name: subcategory.name, slug: subcategory.slug }}
        products={initialData?.results || []}
      />
      
      <CategoryHero 
        data={initialSEOData as any} 
        breadcrumb={{
            items: breadcrumbItems,
            currentPage: breadcrumbPage
        }}
      />

      <div className="bg-white border-b border-gray-100">
        <TrustBadges variant="row" />
      </div>

      <Suspense fallback={
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[32px]" />
                ))}
            </div>
        </div>
      }>
        <PlantFilter
          initialResults={initialData as any}
          initialCategoryData={categoryWithSubs as any}
          initialFilterData={filters as any}
          categorySlug={categorySlug as any}
          subcategorySlug={subcategorySlug as any}
          subcategoryName={subcategory.name as any}
          initialSEOData={initialSEOData as any}
          // @ts-ignore
          hideHeader={true}
        />
      </Suspense>

      <div className="space-y-12 mt-12 mb-8">
        <RecentlyViewedProducts />
      </div>
    </>
  );
}
