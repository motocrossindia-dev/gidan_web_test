import React, { useEffect, useState } from 'react';
import HeroSection from '../../Components/HeroSection/HeroSection';
import CategoryIcons from '../../Components/Category/CategoryIcons';
import Banner from '../../Components/Banner/Banner';
import TrendingSection from '../../Components/TrendingProducts/TrendingSection';
import RewardClub from '../../Components/RewardClub/RewardClub';
import ShopTheLook from '../../Components/ShopTheLook/ShopTheLook';
import SeasonalProduct from '../../Components/SeasonalCollection/SeasonalProduct';
import Services from '../../Services/ServiceHome/Services';
import OfferReward from '../../Components/OfferReward/OfferReward';
import ComboOffer from '../../Components/ComboOffer/ComboOffer';
import Blog from '../../Components/Blog/Blog';
import VideoSection from '../../Components/VideoSection/VideoSection';
import Testimonials from '../../Components/Testinomials/Testinomials';
import ExploreWorks from '../../Components/ExploreWorks/ExploreWorks';
import CheckOutStore from '../../Components/Store/CheckOutStore';
import axiosInstance from '../../Axios/axiosInstance';
import { Helmet } from "react-helmet-async";
import {useLocation} from "react-router-dom";
import axios from "axios";


const Home = () => {

  const location = useLocation(); // gets current route info
  const [homeImages, setHomeImages] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const getBannerImages = async () => {
    try {
      const response = await axiosInstance.get(`/promotion/banner/`);
      console.log(response);
      const banner_images = response?.data?.data?.banners;
      console.log(banner_images,'===============all banners');
      const home_images = banner_images.filter((images) => images.type === 'Home' && images.is_visible === true);
      setHomeImages(home_images);
      const hero_images = banner_images.filter((images) => images.type === 'Hero' && images.is_visible === true);
      setHeroImages(hero_images);
    } catch (error) {
      console.error('Error fetching banner images:', error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  useEffect(() => {
    console.log(homeImages,'------------home');
    console.log(heroImages,'------------heroImages');

    getBannerImages();
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
      </Helmet>



      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-xl">Loading...</p>
        </div>
      ) : (
        <>
          <CategoryIcons />
          <HeroSection hero={heroImages} />
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
          {/* <Testimonials />
          <ExploreWorks /> */}
          <CheckOutStore/>
        </>
      )}
    </div>
  );
};

export default Home;
