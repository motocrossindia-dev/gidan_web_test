import React from 'react';
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { fetchFilters, fetchProductsByFilters } from "@/utils/serverApi";

interface CategoryProductGridServerProps {
  categorySlug: string;
  typeKey: string;
  categoryId: string | null;
  categoryWithSubs: any;
  publicFlags: any;
  initialSEOData: any;
}

export default async function CategoryProductGridServer({
  categorySlug,
  typeKey,
  categoryId,
  categoryWithSubs,
  publicFlags,
  initialSEOData,
  hideHeader = false
}: CategoryProductGridServerProps & { hideHeader?: boolean }) {
  
  // Parallel fetch for heavy products and filters
  const [filters, initialData] = await Promise.all([
    fetchFilters(typeKey, categoryId as any),
    fetchProductsByFilters({
      type: typeKey,
      category_id: categoryId || "",
    })
  ]);

  return (
    <PlantFilter
      initialResults={initialData as any}
      initialCategoryData={categoryWithSubs as any}
      initialFilterData={filters as any}
      categorySlug={categorySlug as any}
      initialSEOData={initialSEOData as any}
      initialFlags={publicFlags as any}
      hideHeader={hideHeader}
    />
  );
}
