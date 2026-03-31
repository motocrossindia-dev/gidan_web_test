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
import ShopTheLook from '../../components/ShopTheLook/ShopTheLook';
import React, { Suspense } from 'react';


const Home = ({ 
  initialBanners, 
  initialCategories, 
  initialHomeData,
  trendingSection,
  seasonalSection,
  reviewsSection,
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
          <Suspense key={`dynamic-suspense-${section.id}`} fallback={<LoadingFallback />}>
            <DynamicSection section={section} />
          </Suspense>
          
          {/* Inject TrustBadges, CategoryIcons and TrendingSection after the 1st section */}
          {index === 0 && (
            <React.Fragment key={`section-0-injections-${section.id}`}>
              <TrustBadges variant="row" />
              <CategoryIcons initialData={initialCategories} />
              {trendingSection}
            </React.Fragment>
          )}

          {/* Inject SeasonalSection after the 2nd section */}
          {index === 1 && (
             <React.Fragment key={`section-1-injections-${section.id}`}>
                {seasonalSection}
             </React.Fragment>
          )}

          {/* Inject Blog section and GlobalReviews after the 4th section */}
          {index === 3 && (
            <React.Fragment key={`section-3-injections-${section.id}`}>
              <div className="mt-8">
                <Blog />
              </div>
              <div className="mt-8">
                <ShopTheLook />
              </div>
              {reviewsSection}
            </React.Fragment>
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
