import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import plant11 from '../../../src/Assets/OfferRewardImg/shopping 1.png';
import plant12 from '../../../src/Assets/OfferRewardImg/shopping 2.png';
import plant13 from '../../../src/Assets/OfferRewardImg/shopping 3.png';
import plant14 from '../../../src/Assets/OfferRewardImg/shopping 4.png';
import plant15 from '../../../src/Assets/OfferRewardImg/shopping 5.png';
import axiosInstance from '../../Axios/axiosInstance';

const OfferCard = ({ title, description, buttonText, image, link }) => (
  <div className="flex bg-[#4A664A] rounded-lg overflow-hidden mb-6 h-[300px] sm:h-[300px] font-sans">
    <div className="w-full sm:w-1/2 p-8 text-white flex flex-col justify-center">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4">{title}</h2>
      <p className="mb-6 text-xs sm:text-sm">{description}</p>
      <Link to={link} className="bg-white text-green-700 font-medium py-1 px-2 md:px-6 rounded-md w-fit hover:bg-gray-100 transition duration-300">
        {buttonText}
      </Link>
    </div>
    <div className="w-full sm:w-1/2">
      <img name=" "    src={image}  alt={title} className="w-full h-full object-cover" />
    </div>
  </div>
);

const SideOfferCard = ({ title, description, image, link }) => (
  <div className="bg-[#4A664A] rounded-lg overflow-hidden mb-6 h-[192px] sm:h-[192px]">
    <div className="flex h-full">
      <div className="w-full sm:w-1/2 p-4 text-white flex flex-col justify-center">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
        <p className="text-xs sm:text-sm mb-3">{description}</p>
        {/* <Link to={link} className="bg-white text-green-700 font-medium py-1 px-4 rounded-md w-fit text-sm sm:text-base hover:bg-gray-100 transition duration-300">
          {buttonText}
        </Link> */}
      </div>
      <div className="w-full sm:w-1/2">
        <img name=" "    src={image}  alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  </div>
);

const OfferReward = () => {

  const [id,setID] = useState()
  const getDealoftheweekproid=async()=>{
  try {
    
    const response = await axiosInstance.get(`/dealOfTheWeek/dealOfTheWeek/`)
    if (response.status===200) {
      setID(response.data.main_product_id)
    }
  } catch (error) {
    console.log(error);
    
  }  
  }

  useEffect(()=>{
    getDealoftheweekproid()
  },[])
  const offers = [
    {
      title: 'A Living Gift - Upto 40% off',
      description: 'Express true emotions with a gift that grow faster',
      buttonText: 'Buy It Now',
      image: plant11,
      link: '/gifts', // Example filter link
    },
    {
      title: 'Deal of the week',
      description: 'Express true emotions with a gift that grow faster',
      buttonText: 'Buy It Now',
      image: plant12,
      link: '/dealofweek', // Example filter link
    },
  ];

  const sideOffers = [
    {
      title: 'Winter Flower Seeds',
      description: 'Buy high quality hybrid Winter Flowering Seeds at best price ',
      buttonText: 'Buy It Now',
      image: plant13,
      link: '/filter?offer=winter-flower-seeds', // Example filter link
    },
    {
      title: 'Events Gifts - Rs.199',
      description: 'Express true emotions with a gift that grow faster',
      buttonText: 'Buy It Now',
      image: plant14,
      link: '/filter?offer=events-gifts', // Example filter link
    },
    {
      title: 'Deal of the week',
      description: 'Express true emotions with a gift that grow faster',
      buttonText: 'Buy It Now',
      image: plant15,
      link: '/filter?offer=deal-of-the-week', // Example filter link
    },
  ];

  return (
    <div className="container mx-auto px-4 md:py-8 py-0">
      <h1 className="md:text-2xl text-xl font-bold mb-6 text-center">Offers & Rewards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2">
          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}
        </div>
        <div className="sm:col-span-1">
          {sideOffers.map((sideOffer, index) => (
            <SideOfferCard key={index} {...sideOffer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferReward;
