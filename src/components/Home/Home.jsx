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
    <div className="bg-[#faf9f6]">
      <ResourceHints />

      {homeData?.sections?.map((section, index) => {
        const isFirstSection = index === 0;
        const sectionContent = (
          <>
            <Suspense key={`dynamic-suspense-${section.id}`} fallback={<LoadingFallback />}>
              <DynamicSection section={section} />
            </Suspense>
            
            {index === 0 && (
              <React.Fragment key={`section-0-injections-${section.id}`}>
                <TrustBadges variant="row" />
                <CategoryIcons initialData={initialCategories} />
                {trendingSection}
              </React.Fragment>
            )}

            {index === 1 && (
               <React.Fragment key={`section-1-injections-${section.id}`}>
                  {seasonalSection}
               </React.Fragment>
            )}

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

            {index === 4 && (
              <div className="mt-8">
                <ReferralSection />
              </div>
            )}
          </>
        );

        return isFirstSection ? (
          <div key={section.id} className="opacity-100 min-h-[400px]">
             {sectionContent}
          </div>
        ) : (
          <LazyLoadWrapper key={section.id} height="600px">
            {sectionContent}
          </LazyLoadWrapper>
        );
      })}

      <StoreSection />
    </div>
  );
};


export default Home;
