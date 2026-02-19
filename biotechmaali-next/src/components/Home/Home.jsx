'use client';

/**
 * ============================================
 * PERFORMANCE OPTIMIZATION - Updated: Feb 16, 2026
 * ============================================
 * Changes:
 * 1. Added lazy loading for below-the-fold components
 * 2. Implemented code splitting with webpack chunk names
 * 3. Added ResourceHints and LazyLoadWrapper for better performance
 * 4. Integrated TanStack Query for data fetching & caching
 * 5. Target: Increase performance score from 47 to 90+
 * ============================================
 */

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import { useEffect, useState, lazy, Suspense } from 'react';
// import axiosInstance from '../../Axios/axiosInstance';
// import { Helmet } from "react-helmet-async";
// import ResourceHints from '../Shared/ResourceHints';
// import LazyLoadWrapper from '../Shared/LazyLoadWrapper';
// 
// // Critical above-the-fold components - load immediately (no lazy loading)
// import CategoryIcons from '../../components/Category/CategoryIcons';
// import HeroSection from '../../components/HeroSection/HeroSection';
// import Banner from '../../components/Banner/Banner';
// 
// // Below-the-fold components - lazy load with code splitting for better performance
// const TrendingSection = lazy(() => import(/* webpackChunkName: "trending" */ '../../components/TrendingProducts/TrendingSection'));
// const RewardClub = lazy(() => import(/* webpackChunkName: "reward-club" */ '../../components/RewardClub/RewardClub'));
// const ShopTheLook = lazy(() => import(/* webpackChunkName: "shop-look" */ '../../components/ShopTheLook/ShopTheLook'));
// const SeasonalProduct = lazy(() => import(/* webpackChunkName: "seasonal" */ '../../components/SeasonalCollection/SeasonalProduct'));
// const Services = lazy(() => import(/* webpackChunkName: "services" */ '../../Services/ServiceHome/Services'));
// const OfferReward = lazy(() => import(/* webpackChunkName: "offer-reward" */ '../../components/OfferReward/OfferReward'));
// const ComboOffer = lazy(() => import(/* webpackChunkName: "combo-offer" */ '../../components/ComboOffer/ComboOffer'));
// const Blog = lazy(() => import(/* webpackChunkName: "blog" */ '../../components/Blog/Blog'));
// const VideoSection = lazy(() => import(/* webpackChunkName: "video" */ '../../components/VideoSection/VideoSection'));
// const CheckOutStore = lazy(() => import(/* webpackChunkName: "store" */ '../../components/Store/CheckOutStore'));
// const HomepageSchema = lazy(() => import(/* webpackChunkName: "schema" */ '../../views/utilities/seo/HomepageSchema'));
// const StoreSchema = lazy(() => import(/* webpackChunkName: "schema" */ '../../views/utilities/seo/StoreSchema'));
// 
// const Home = () => {
//   const [homeImages, setHomeImages] = useState([]);
//   const [heroImages, setHeroImages] = useState([]);
//   const [loading, setLoading] = useState(true);
// 
//   const getBannerImages = async () => {
//     try {
//       const response = await axiosInstance.get(`/promotion/banner/`);
//       const banner_images = response?.data?.data?.banners;
//       const home_images = banner_images.filter((images) => images.type === 'Home' && images.is_visible === true);
//       setHomeImages(home_images);
//       const hero_images = banner_images.filter((images) => images.type === 'Hero' && images.is_visible === true);
//       setHeroImages(hero_images);
//     } catch (error) {
//       console.error('Error fetching banner images:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
// 
//   useEffect(() => {
//     getBannerImages();
// 
//     // Prefetch below-the-fold components when browser is idle
//     if ('requestIdleCallback' in window) {
//       requestIdleCallback(() => {
//         import(/* webpackChunkName: "trending" */ '../../components/TrendingProducts/TrendingSection');
//         import(/* webpackChunkName: "reward-club" */ '../../components/RewardClub/RewardClub');
//         import(/* webpackChunkName: "seasonal" */ '../../components/SeasonalCollection/SeasonalProduct');
//       });
//     }
//   }, []);
// 
//   // Loading fallback component
//   const LoadingFallback = () => (
//     <div className="w-full h-32 bg-gray-100 animate-pulse rounded" />
//   );
// 
//   return (
//     <div>
//       <Helmet>
//         <title>Gidan® – Buy Plants, Planters, Pots & Seeds Online in Bangalore</title>
//         <meta
//           name="description"
//           content="Buy plants, planters, pots & seeds online in Bangalore from Gidan. Fresh plants, garden décor and reliable doorstep delivery."
//         />
//         <link rel="canonical" href="https://gidan.store" />
//       </Helmet>
// 
//       <ResourceHints />
// 
//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-gray-500 text-xl">Loading...</p>
//         </div>
//       ) : (
//         <>
//           <CategoryIcons />
//           <HeroSection hero={heroImages} />
//           <Banner home={homeImages} />
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <TrendingSection />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="300px">
//             <Suspense fallback={<LoadingFallback />}>
//               <RewardClub />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <ShopTheLook />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="500px">
//             <Suspense fallback={<LoadingFallback />}>
//               <SeasonalProduct />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <Services />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="300px">
//             <Suspense fallback={<LoadingFallback />}>
//               <OfferReward />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <ComboOffer />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <Blog />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="400px">
//             <Suspense fallback={<LoadingFallback />}>
//               <VideoSection />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <LazyLoadWrapper height="300px">
//             <Suspense fallback={<LoadingFallback />}>
//               <CheckOutStore />
//             </Suspense>
//           </LazyLoadWrapper>
// 
//           <Suspense fallback={null}>
//             <HomepageSchema />
//             <StoreSchema />
//           </Suspense>
//         </>
//       )}
//     </div>
//   );
// };
// 
// export default Home;
// ========== END OLD CODE ==========

// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { useEffect, lazy, Suspense } from 'react';
import { Helmet } from "react-helmet-async";
import ResourceHints from '../Shared/ResourceHints';
import LazyLoadWrapper from '../Shared/LazyLoadWrapper';
import { useBannerImages } from '../../hooks/useBannerImages'; // TanStack Query hook

// Critical above-the-fold components - load immediately (no lazy loading)
import CategoryIcons from '../../components/Category/CategoryIcons';
import HeroSection from '../../components/HeroSection/HeroSection';
import Banner from '../../components/Banner/Banner';

// Below-the-fold components - lazy load with code splitting for better performance
const TrendingSection = lazy(() => import(/* webpackChunkName: "trending" */ '../../components/TrendingProducts/TrendingSection'));
const RewardClub = lazy(() => import(/* webpackChunkName: "reward-club" */ '../../components/RewardClub/RewardClub'));
const ShopTheLook = lazy(() => import(/* webpackChunkName: "shop-look" */ '../../components/ShopTheLook/ShopTheLook'));
const SeasonalProduct = lazy(() => import(/* webpackChunkName: "seasonal" */ '../../components/SeasonalCollection/SeasonalProduct'));
const OfferReward = lazy(() => import(/* webpackChunkName: "offer-reward" */ '../../components/OfferReward/OfferReward'));
const ComboOffer = lazy(() => import(/* webpackChunkName: "combo-offer" */ '../../components/ComboOffer/ComboOffer'));
const Blog = lazy(() => import(/* webpackChunkName: "blog" */ '../../components/Blog/Blog'));
const VideoSection = lazy(() => import(/* webpackChunkName: "video" */ '../../components/VideoSection/VideoSection'));
const CheckOutStore = lazy(() => import(/* webpackChunkName: "store" */ '../../components/Store/CheckOutStore'));
const HomepageSchema = lazy(() => import(/* webpackChunkName: "schema" */ '../../views/utilities/seo/HomepageSchema'));
const StoreSchema = lazy(() => import(/* webpackChunkName: "schema" */ '../../views/utilities/seo/StoreSchema'));

const Home = () => {
  // ✅ Use TanStack Query hook - automatic caching, no unnecessary re-renders
  const { data, isLoading, isError } = useBannerImages();

  // Prefetch below-the-fold components when browser is idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import(/* webpackChunkName: "trending" */ '../../components/TrendingProducts/TrendingSection');
        import(/* webpackChunkName: "reward-club" */ '../../components/RewardClub/RewardClub');
        import(/* webpackChunkName: "seasonal" */ '../../components/SeasonalCollection/SeasonalProduct');
      });
    }
  }, []);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="w-full h-32 bg-gray-100 animate-pulse rounded" />
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error loading banner images</p>
      </div>
    );
  }

  const { homeImages = [], heroImages = [] } = data || {};

  return (
    <div>
      <Helmet>
        <title>Gidan® – Buy Plants, Planters, Pots & Seeds Online in Bangalore</title>
        <meta
          name="description"
          content="Buy plants, planters, pots & seeds online in Bangalore from Gidan. Fresh plants, garden décor and reliable doorstep delivery."
        />
        <link rel="canonical" href="https://gidan.store" />
      </Helmet>

      <ResourceHints />

      {/* Critical above-the-fold content - no lazy loading */}
      <CategoryIcons />
      <HeroSection hero={heroImages} />
      <Banner home={homeImages} />

      {/* Below-the-fold content - lazy load with intersection observer */}
      <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <TrendingSection />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="300px">
        <Suspense fallback={<LoadingFallback />}>
          <RewardClub />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <ShopTheLook />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="500px">
        <Suspense fallback={<LoadingFallback />}>
          <SeasonalProduct />
        </Suspense>
      </LazyLoadWrapper>

      {/* <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <Services />
        </Suspense>
      </LazyLoadWrapper> */}

      <LazyLoadWrapper height="300px">
        <Suspense fallback={<LoadingFallback />}>
          <OfferReward />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <ComboOffer />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <Blog />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="400px">
        <Suspense fallback={<LoadingFallback />}>
          <VideoSection />
        </Suspense>
      </LazyLoadWrapper>

      <LazyLoadWrapper height="300px">
        <Suspense fallback={<LoadingFallback />}>
          <CheckOutStore />
        </Suspense>
      </LazyLoadWrapper>

      {/* Schema components - load at the end */}
      <Suspense fallback={null}>
        <HomepageSchema />
        <StoreSchema />
      </Suspense>
    </div>
  );
};

export default Home;
// ========== END NEW CODE ==========
