import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axios/axiosInstance';

const HeroSection = ({ hero }) => {
  const navigate = useNavigate();

  const gotooffers = async () => {
    try {
      const response = await axiosInstance.get(`/product/offerProducts/`);
      if (response.status === 200) {
        navigate(`/filter/`, { state: { products: response?.data } });
      }
    } catch (error) {
      console.error("Error fetching offer products:", error);
    }
  };

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {hero && hero.length > 0 ? (
        <div className="flex justify-center items-center w-full">
          <img
            src={`https://backend.biotechmaali.com${hero[0].web_banner}`}
            alt="Hero Banner"
            onClick={gotooffers}
            className="w-full max-h-[600px] h-auto object-contain cursor-pointer transition duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500 text-lg">No hero images available</p>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
