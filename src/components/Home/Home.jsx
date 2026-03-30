'use client';

import ResourceHints from '../Shared/ResourceHints';
import LazyLoadWrapper from '../Shared/LazyLoadWrapper';
import DynamicSection from '../Shared/Sections/DynamicSection';
import CategoryIcons from '../../components/Category/CategoryIcons';
import Banner from '../../components/Banner/Banner';
import { TrendingSection } from '../../components/TrendingProducts/TrendingSection';
import { SeasonalSection } from '../../components/Seasonal/SeasonalSection';
import { Suspense } from 'react';


const Home = ({ 
  initialBanners, 
  initialCategories, 
  initialHomeData,
  initialTrending,
  initialFeatured,
  initialBestseller,
  initialSeasonal
}) => {
  const homeData = initialHomeData;

  const banners = initialBanners || [];
  const homeImages = banners.filter(b => b.type === 'Home' && b.is_visible);
  const heroImages = banners.filter(b => b.type === 'Hero' && b.is_visible);

  const LoadingFallback = () => (
    <div className="w-full h-32 bg-gray-100 animate-pulse rounded-3xl" />
  );

  return (
    <div className="bg-[#faf9f6] pb-20">
      <ResourceHints />

      {homeData?.sections?.map((section, index) => (
        <LazyLoadWrapper key={section.id} height="600px">
          <Suspense fallback={<LoadingFallback />}>
            <DynamicSection section={section} />
          </Suspense>
          
          {/* Inject CategoryIcons and TrendingSection after the 1st section */}
          {index === 0 && (
            <>
              <CategoryIcons initialData={initialCategories} />
              <div className="mt-8">
                <TrendingSection 
                  initialTrending={initialTrending}
                  initialFeatured={initialFeatured}
                  initialBestseller={initialBestseller}
                />
              </div>
            </>
          )}

          {/* Inject SeasonalSection after the 2nd section */}
          {index === 1 && (
            <div className="mt-8">
              <SeasonalSection initialSeasonal={initialSeasonal} />
            </div>
          )}
        </LazyLoadWrapper>
      ))}

      <Banner home={homeImages} />
    </div>
  );
};


export default Home;
