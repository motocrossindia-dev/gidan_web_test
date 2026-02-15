import {lazy, Suspense, useEffect, useState} from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import {Helmet} from "react-helmet-async";

// CRITICAL: Load above-the-fold components immediately (no lazy)
import CategoryIcons from '../../Components/Category/CategoryIcons';
import HeroSection from '../../Components/HeroSection/HeroSection';

// Lazy load below-the-fold components with priority
const Banner = lazy(() => import('../../Components/Banner/Banner'));
const TrendingSection = lazy(() => import('../../Components/TrendingProducts/TrendingSection'));

// Lazy load non-critical components (load on scroll/idle)
const RewardClub = lazy(() => import('../../Components/RewardClub/RewardClub'));
const ShopTheLook = lazy(() => import('../../Components/ShopTheLook/ShopTheLook'));
const SeasonalProduct = lazy(() => import('../../Components/SeasonalCollection/SeasonalProduct'));
const Services = lazy(() => import('../../Services/ServiceHome/Services'));
const OfferReward = lazy(() => import('../../Components/OfferReward/OfferReward'));
const ComboOffer = lazy(() => import('../../Components/ComboOffer/ComboOffer'));
const Blog = lazy(() => import('../../Components/Blog/Blog'));
const VideoSection = lazy(() => import('../../Components/VideoSection/VideoSection'));
const CheckOutStore = lazy(() => import('../../Components/Store/CheckOutStore'));
const HomepageSchema = lazy(() => import('../../views/utilities/seo/HomepageSchema'));
const StoreSchema = lazy(() => import('../../views/utilities/seo/StoreSchema'));

// Minimal loading fallback
const LoadingFallback = () => <div className="h-20" />;

const Home = () => {
  const [homeImages, setHomeImages] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBelowFold, setShowBelowFold] = useState(false);

  const getBannerImages = async () => {
    try {
      const response = await axiosInstance.get(`/promotion/banner/`);
      const banner_images = response?.data?.data?.banners;
      const home_images = banner_images.filter((images) => images.type === 'Home' && images.is_visible === true);
      setHomeImages(home_images);
      const hero_images = banner_images.filter((images) => images.type === 'Hero' && images.is_visible === true);
      setHeroImages(hero_images);
    } catch (error) {
      console.error('Error fetching banner images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBannerImages();
    
    // Load below-the-fold content after initial render
    const timer = setTimeout(() => {
      setShowBelowFold(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Gidan® – Buy Plants, Planters, Pots & Seeds Online in Bangalore</title>
        <meta
          name="description"
          content="Buy plants, planters, pots & seeds online in Bangalore from Gidan. Fresh plants, garden décor and reliable doorstep delivery."
        />
        <link rel="canonical" href="https://gidan.store" />
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.REACT_APP_API_URL} />
        <link rel="dns-prefetch" href={process.env.REACT_APP_API_URL} />
      </Helmet>

      {/* Above-the-fold: Load immediately for fast LCP */}
      <CategoryIcons />
      {!loading && <HeroSection hero={heroImages} />}

      {/* Below-the-fold: Load progressively */}
      {showBelowFold && (
        <Suspense fallback={<LoadingFallback />}>
          <Banner home={homeImages} />
          <TrendingSection />
          <RewardClub />
          <ShopTheLook />
          <SeasonalProduct />
          <Services />
          <OfferReward />
          <ComboOffer />
          <Blog />
          <VideoSection />
          <CheckOutStore />
          <HomepageSchema />
          <StoreSchema />
        </Suspense>
      )}
    </div>
  );
};

export default Home;

// ==================== OLD CODE (COMMENTED) ====================
// import { useEffect, useState, lazy, Suspense } from 'react';
// import axiosInstance from '../../Axios/axiosInstance';
// import { Helmet } from "react-helmet-async";
//
// // Lazy load components
// const HeroSection = lazy(() => import('../../Components/HeroSection/HeroSection'));
// const CategoryIcons = lazy(() => import('../../Components/Category/CategoryIcons'));
// const Banner = lazy(() => import('../../Components/Banner/Banner'));
// const TrendingSection = lazy(() => import('../../Components/TrendingProducts/TrendingSection'));
// const RewardClub = lazy(() => import('../../Components/RewardClub/RewardClub'));
// const ShopTheLook = lazy(() => import('../../Components/ShopTheLook/ShopTheLook'));
// const SeasonalProduct = lazy(() => import('../../Components/SeasonalCollection/SeasonalProduct'));
// const Services = lazy(() => import('../../Services/ServiceHome/Services'));
// const OfferReward = lazy(() => import('../../Components/OfferReward/OfferReward'));
// const ComboOffer = lazy(() => import('../../Components/ComboOffer/ComboOffer'));
// const Blog = lazy(() => import('../../Components/Blog/Blog'));
// const VideoSection = lazy(() => import('../../Components/VideoSection/VideoSection'));
// const CheckOutStore = lazy(() => import('../../Components/Store/CheckOutStore'));
// const HomepageSchema = lazy(() => import('../../views/utilities/seo/HomepageSchema'));
// const StoreSchema = lazy(() => import('../../views/utilities/seo/StoreSchema'));
//
// // Loading fallback component
// const LoadingFallback = () => (
//   <div className="flex justify-center items-center py-8">
//     <div className="animate-pulse text-gray-500">Loading...</div>
//   </div>
// );
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
//   }, []);
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
//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <p className="text-gray-500 text-xl">Loading...</p>
//         </div>
//       ) : (
//         <Suspense fallback={<LoadingFallback />}>
//           <CategoryIcons />
//           <HeroSection hero={heroImages} />
//           <Banner home={homeImages} />
//           <TrendingSection />
//           <RewardClub />
//           <ShopTheLook />
//           <SeasonalProduct />
//           <Services />
//           <OfferReward />
//           <ComboOffer />
//           <Blog />
//           <VideoSection />
//           <CheckOutStore />
//           <HomepageSchema />
//           <StoreSchema />
//         </Suspense>
//       )}
//     </div>
//   );
// };
//
// export default Home;
