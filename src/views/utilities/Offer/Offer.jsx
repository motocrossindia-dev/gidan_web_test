import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Axios/axiosInstance";

function Offer() {
  const [offers, setOffers] = useState([]);

  // ✅ Fetch Offer Products
  const getOfferProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/offerProducts/`);
      if (response.status === 200) {
        setOffers(response.data.products || []); // use products array
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    getOfferProducts();
  }, []);



  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h2 className="md:text-3xl text-xl text-center font-bold mb-4">Special Offers</h2>
      <p className="text-gray-600 mb-8 md:text-xl text-center">
        Don’t miss out on these exclusive offers!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offers?.map((offer, index) => {
          const originalPrice = Math.round(offer?.mrp || 0);
          const finalPrice = Math.round(offer?.selling_price || 0);
          const discount = originalPrice
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0;

          return (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              {offer?.image && (
                <img
                  src={`${process.env.REACT_APP_API_URL}${offer.image}`}
                  alt={offer?.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6 text-start flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-2">{offer?.name}</h3>

                <div className="mb-2">
                  <span className="text-green-600 text-lg font-bold">₹{finalPrice}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 line-through">₹{originalPrice}</span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Offer;
