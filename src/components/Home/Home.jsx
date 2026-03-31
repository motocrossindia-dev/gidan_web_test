'use client';

import ResourceHints from '../Shared/ResourceHints';
import LazyLoadWrapper from '../Shared/LazyLoadWrapper';
import DynamicSection from '../Shared/Sections/DynamicSection';
import CategoryIcons from '../../components/Category/CategoryIcons';
import { TrendingSection } from '../../components/TrendingProducts/TrendingSection';
import { SeasonalSection } from '../../components/Seasonal/SeasonalSection';
import TrustBadges from '../Shared/TrustBadges';
import Blog from '../../components/Blog/Blog';
import ReferralSection from '../../components/Home/ReferralSection';
import StoreSection from '../../components/Home/StoreSection';
import GlobalReviews from '../../components/Home/GlobalReviews';
import { Suspense } from 'react';


const Home = ({ 
  initialBanners, 
  initialCategories, 
  initialHomeData,
  initialTrending,
  initialFeatured,
  initialBestseller,
  initialSeasonal,
  initialSeasonalTrending,
  initialSeasonalFeatured,
  initialSeasonalBestseller,
  initialLatest,
  initialGlobalReviews,
  publicFlags = []
}) => {


  const homeData = initialHomeData;

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
          
          {/* Inject TrustBadges, CategoryIcons and TrendingSection after the 1st section */}
          {index === 0 && (
            <>
              <TrustBadges />
              <CategoryIcons initialData={initialCategories} />
              <div className="mt-8">
                <TrendingSection 
                  initialTrending={initialTrending}
                  initialFeatured={initialFeatured}
                  initialBestseller={initialBestseller}
                  initialLatest={initialLatest}
                  publicFlags={publicFlags}
                />
              </div>
            </>
          )}

          {/* Inject SeasonalSection after the 2nd section */}
          {index === 1 && (
            <div className="mt-8">
              <SeasonalSection 
                initialSeasonal={initialSeasonal} 
                initialSeasonalTrending={initialSeasonalTrending}
                initialSeasonalFeatured={initialSeasonalFeatured}
                initialSeasonalBestseller={initialSeasonalBestseller}
                publicFlags={publicFlags}
              />
            </div>
          )}

          {/* Inject Blog section and GlobalReviews after the 4th section */}
          {index === 3 && (
            <>
              <div className="mt-8">
                <Blog />
              </div>
              <div className="mt-8">
                <GlobalReviews initialGlobalReviews={initialGlobalReviews} />
              </div>
            </>
          )}

          {/* Inject Referral section after the 5th section */}
          {index === 4 && (
            <div className="mt-8">
              <ReferralSection />
            </div>
          )}
        </LazyLoadWrapper>
      ))}

      <StoreSection />
    </div>
  );
};


export default Home;
