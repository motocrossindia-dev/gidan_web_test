'use client';

import { lazy, Suspense } from 'react';
import ResourceHints from '../Shared/ResourceHints';
import LazyLoadWrapper from '../Shared/LazyLoadWrapper';
import useHomepageData from '../../hooks/useHomepageData';
import DynamicSection from '../Shared/Sections/DynamicSection';
import CategoryIcons from '../../components/Category/CategoryIcons';
import Banner from '../../components/Banner/Banner';
import { TrendingSection } from '../../components/TrendingProducts/TrendingSection';
import { SeasonalSection } from '../../components/Seasonal/SeasonalSection';

const Home = ({ initialBanners, initialCategories }) => {
  const { data: homeData, isLoading } = useHomepageData();

  const banners = initialBanners || [];
  const homeImages = banners.filter(b => b.type === 'Home' && b.is_visible);
  const heroImages = banners.filter(b => b.type === 'Hero' && b.is_visible);

  const LoadingFallback = () => (
    <div className="w-full h-32 bg-gray-100 animate-pulse rounded-3xl" />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif italic text-[#375421]">Growing something beautiful...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6] pb-20">
      <ResourceHints />

      {homeData?.sections?.map((section, index) => (
        <LazyLoadWrapper key={section.id} height="600px">
          <Suspense fallback={<LoadingFallback />}>
            <DynamicSection section={section} />
          </Suspense>
          {index === 0 && (
            <>
              <CategoryIcons initialData={initialCategories} />
              <div className="mt-8">
                <TrendingSection />
              </div>
            </>
          )}
          {section.id === 2 && (
            <div className="mt-8">
              <SeasonalSection />
            </div>
          )}
        </LazyLoadWrapper>
      ))}

      <Banner home={homeImages} />
    </div>
  );
};

export default Home;

