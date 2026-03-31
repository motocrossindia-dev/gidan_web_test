import React from 'react';
import { SeasonalSection } from '@/components/Seasonal/SeasonalSection';

async function getProductsByFilter(filterQuery: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?${filterQuery}&page_size=20&limit=20&page=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || data?.data?.results || data?.data?.products || [];
  } catch (err) {
    console.error(`Failed to fetch seasonal products for ${filterQuery}`, err);
    return [];
  }
}

export default async function SeasonalSectionServer({ 
  seasonalQuery, 
  trendingQuery, 
  featuredQuery, 
  bestsellerQuery,
  publicFlags 
}: any) {
  const [
    initialSeasonal,
    initialSeasonalTrending,
    initialSeasonalFeatured,
    initialSeasonalBestseller
  ] = await Promise.all([
    getProductsByFilter(seasonalQuery),
    getProductsByFilter(`${seasonalQuery}&${trendingQuery}`),
    getProductsByFilter(`${seasonalQuery}&${featuredQuery}`),
    getProductsByFilter(`${seasonalQuery}&${bestsellerQuery}`)
  ]);

  return (
    <div className="mt-8">
      <SeasonalSection 
        initialSeasonal={initialSeasonal} 
        initialSeasonalBestseller={initialSeasonalBestseller}
        publicFlags={publicFlags}
      />
    </div>
  );
}
