import React from 'react';
import { TrendingSection } from '@/components/TrendingProducts/TrendingSection';

async function getProductsByFilter(filterQuery: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?${filterQuery}&page_size=20&limit=20&page=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || data?.data?.results || data?.data?.products || [];
  } catch (err) {
    console.error(`Failed to fetch trending products for ${filterQuery}`, err);
    return [];
  }
}

export default async function TrendingSectionServer({ 
  trendingQuery, 
  featuredQuery, 
  bestsellerQuery, 
  latestQuery,
  publicFlags 
}: any) {
  const [
    initialTrending,
    initialFeatured,
    initialBestseller,
    initialLatest
  ] = await Promise.all([
    getProductsByFilter(trendingQuery),
    getProductsByFilter(featuredQuery),
    getProductsByFilter(bestsellerQuery),
    getProductsByFilter(latestQuery)
  ]);

  return (
    <div className="mt-8">
      <TrendingSection 
        initialTrending={initialTrending}
        initialFeatured={initialFeatured}
        initialBestseller={initialBestseller}
        initialLatest={initialLatest}
        publicFlags={publicFlags}
      />
    </div>
  );
}
