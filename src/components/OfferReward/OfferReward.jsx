'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import axios from "axios";

const OfferCard = ({ title, description, buttonText, image, link }) => (
  <div className="bg-[#4A664A] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
    <div className="flex flex-col md:flex-row h-full md:min-h-[280px] lg:min-h-[300px]">
      {/* Content Section */}
      <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-7 lg:p-8 text-white flex flex-col justify-center order-2 md:order-1">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">{title}</h2>
        <p className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-xs sm:text-sm md:text-base leading-relaxed">{description}</p>
        <Link 
          href={link || "#"} 
          className="bg-white text-green-700 font-medium py-2 sm:py-2.5 px-5 sm:px-6 rounded-md text-sm sm:text-base text-center w-fit hover:bg-gray-100 transition duration-300 active:scale-[0.98]"
        >
          {buttonText}
        </Link>
      </div>
      
      {/* Image Section */}
      <div className="w-full md:w-1/2 h-[180px] sm:h-[220px] md:h-auto order-1 md:order-2">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  </div>
);

const SideOfferCard = ({ title, description, image, link }) => (
  <Link href={link || "/filter"} className="block h-full">
    <div className="bg-[#4A664A] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="flex h-full min-h-[160px] sm:min-h-[180px] md:min-h-[185px]">
        {/* Content Section */}
        <div className="w-1/2 p-3 sm:p-4 md:p-5 text-white flex flex-col justify-center">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1.5 md:mb-2 leading-tight">{title}</h3>
          <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-4">{description}</p>
        </div>

        {/* Image Section */}
        <div className="w-1/2">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </Link>
);

const OfferReward = () => {
  const [id, setID] = useState();
  const [contentBlocks, setContentBlocks] = useState([]);

  useEffect(() => {
    const fetchOffersRewards = async () => {
      try {
        const res = await axios.get(
          "https://gidanbackendtest.mymotokart.in/utils/content-blocks/?section=offers_rewards&title="
        );
        setContentBlocks(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOffersRewards();
  }, []);

  const getDealoftheweekproid = async () => {
    try {
      const response = await axiosInstance.get(`/dealOfTheWeek/dealOfTheWeek/`);
      if (response.status === 200) {
        setID(response.data.main_product_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDealoftheweekproid();
  }, []);

  const offers = contentBlocks.slice(0, 2).map((item) => ({
    title: item.title,
    description: item.subtitle,
    buttonText: item.button_text || "Buy It Now",
    image: item.image,
    link:
      item.title === "Deal of the week" && id
        ? `/product/${id}`
        : "/gifts/",
  }));

  const sideOffers = contentBlocks.slice(2, 5).map((item) => ({
    title: item.title,
    description: item.subtitle,
    image: item.image,
    link: "/trending/",
  }));

  if (!contentBlocks.length) return null;

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
      <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">
        Offers & Rewards
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 md:auto-rows-fr">
        {/* Main Offers - Takes 2 columns on desktop */}
        <div className="md:col-span-2 grid grid-cols-1 gap-4 md:gap-5 lg:gap-6">
          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}
        </div>
        
        {/* Side Offers - Takes 1 column on desktop, equal height cards */}
        <div className="md:col-span-1 grid grid-cols-1 gap-4 md:gap-5 lg:gap-6">
          {sideOffers.map((sideOffer, index) => (
            <SideOfferCard key={index} {...sideOffer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferReward;

// ================old=================
// import { useEffect, useState } from 'react';
// // import axiosInstance from '../../Axios/axiosInstance';
// import axios from "axios";

// // Desktop: Keep original side-by-side layout
// // Mobile: Stack image on top, content below for better UX
// const OfferCard = ({ title, description, buttonText, image, link }) => (
//   <div className="bg-[#4A664A] rounded-lg overflow-hidden mb-6 font-sans">
//     {/* Mobile: Vertical stack | Desktop: Horizontal flex */}
//     <div className="flex flex-col sm:flex-row sm:h-[300px]">
//       {/* Content Section */}
//       <div className="w-full sm:w-1/2 p-6 sm:p-8 text-white flex flex-col justify-center order-2 sm:order-1">
//         <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{title}</h2>
//         <p className="mb-5 sm:mb-6 text-sm sm:text-sm leading-relaxed">{description}</p>
//         <Link 
//           to={link} 
//           className="bg-white text-green-700 font-medium py-3 sm:py-1 px-6 sm:px-6 rounded-md text-center sm:w-fit hover:bg-gray-100 transition duration-300 active:scale-[0.98]"
//         >
//           {buttonText}
//         </Link>
//       </div>
      
//       {/* Image Section - Shows first on mobile */}
//       <div className="w-full sm:w-1/2 aspect-[16/9] sm:aspect-auto order-1 sm:order-2">
//         <img 
//           src={image} 
//           alt={title} 
//           className="w-full h-full object-cover" 
//         />
//       </div>
//     </div>
//   </div>
// );

// // Desktop: Keep original layout
// // Mobile: Optimize for single column with better spacing
// const SideOfferCard = ({ title, description, image }) => (
//   <div className="bg-[#4A664A] rounded-lg overflow-hidden mb-6 sm:mb-6">
//     <div className="flex h-[160px] sm:h-[192px]">
//       {/* Content Section */}
//       <div className="w-[55%] sm:w-1/2 p-4 text-white flex flex-col justify-center">
//         <h3 className="text-lg sm:text-2xl font-bold mb-2 leading-tight">{title}</h3>
//         <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">{description}</p>
//       </div>
      
//       {/* Image Section */}
//       <div className="w-[45%] sm:w-1/2">
//         <img 
//           src={image} 
//           alt={title} 
//           className="w-full h-full object-cover" 
//         />
//       </div>
//     </div>
//   </div>
// );

// const OfferReward = () => {
//   const [id, setID] = useState();
//   const [contentBlocks, setContentBlocks] = useState([]);

//   useEffect(() => {
//     const fetchOffersRewards = async () => {
//       try {
//         const res = await axios.get(
//           "https://gidanbackendtest.mymotokart.in/utils/content-blocks/?section=offers_rewards&title="
//         );
//         setContentBlocks(res.data || []);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchOffersRewards();
//   }, []);

//   const getDealoftheweekproid = async () => {
//     try {
//       const response = await axiosInstance.get(`/dealOfTheWeek/dealOfTheWeek/`);
//       if (response.status === 200) {
//         setID(response.data.main_product_id);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getDealoftheweekproid();
//   }, []);

//   const offers = contentBlocks.slice(0, 2).map((item) => ({
//     title: item.title,
//     description: item.subtitle,
//     buttonText: item.button_text || "Buy It Now",
//     image: item.image,
//     link:
//       item.title === "Deal of the week" && id
//         ? `/product/${id}`
//         : "/gifts",
//   }));

//   const sideOffers = contentBlocks.slice(2, 5).map((item) => ({
//     title: item.title,
//     description: item.subtitle,
//     image: item.image,
//     link: "/filter",
//   }));

//   if (!contentBlocks.length) return null;

//   return (
//     <div className="container mx-auto px-4 py-4 md:py-8">
//       <h1 className="text-2xl md:text-2xl font-bold mb-6 text-center">Offers & Rewards</h1>
      
//       {/* Desktop: Original grid layout | Mobile: Single column stack */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-6">
//         <div className="sm:col-span-2">
//           {offers.map((offer, index) => (
//             <OfferCard key={index} {...offer} />
//           ))}
//         </div>
//         <div className="sm:col-span-1">
//           {sideOffers.map((sideOffer, index) => (
//             <SideOfferCard key={index} {...sideOffer} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OfferReward;
