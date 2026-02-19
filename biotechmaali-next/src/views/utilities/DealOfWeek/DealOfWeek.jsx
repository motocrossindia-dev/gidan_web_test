'use client';

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../../Axios/axiosInstance";

function DealOfWeek() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all deals directly
  const getAllDeals = async () => {
    try {
      const response = await axiosInstance.get(`/dealOfTheWeek/dealOfTheWeek/`);
      if (response.status === 200) {
        setDeals(response.data); // API gives array directly
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  useEffect(() => {
    getAllDeals();
  }, []);

  // ✅ Format Date
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-IN", options);
  };

  // ✅ Buy Now Handler
  const handleBuyItNowSubmit = async (deal) => {
    if (isAuthenticated) {
      const product_data = {
        order_source: "deal",
        deal_id: deal.id,
//         product_id: deal.main_products?.id,
        // quantity: 1
      };

      try {
        const response = await axiosInstance.post(`/order/placeOrder/`, product_data);

        if (response.status === 200) {
          const ordersummary = response?.data?.data;

          // Save selected deal
          sessionStorage.setItem("selected_deal", JSON.stringify(deal));

          navigate("/checkout", {
            state: { ordersummary, deal },
          });
        }
      } catch (error) {
        console.error("Error placing order:", error);
        if (error.response && error.response.status === 400) {
          enqueueSnackbar(error.response.data?.message, { variant: "error" });
        } else {
          enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
        }
      }
    } else {
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      if (isMobile) {
        navigate("/mobile-signin", { replace: true });
      } else {
        navigate("/?modal=signIn", { replace: true });
      }
    }
  };

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h2 className="md:text-3xl text-xl text-center font-bold mb-4">
        Deal of the Week
      </h2>
      <p className="text-gray-600 mb-8 md:text-xl text-center">
        Grab these exclusive weekly deals before they’re gone!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals?.map((deal, index) => {
          const originalPrice = Math.round(deal?.main_products?.default_selling_price || 0);
          const discount = deal?.discount_percentage || 0;
          const finalPrice = Math.round((originalPrice - (originalPrice * discount) / 100).toFixed(2));

          return (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              {deal?.main_products?.image && (
                <img
                  src={`${process.env.REACT_APP_API_URL}${deal.main_products.image}`}
                  alt={deal?.main_products?.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6 text-start flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-2">
                  {deal?.main_products?.name}
                </h3>

                <div className="mb-2">
                  <span className="text-green-600 text-lg font-bold">₹{finalPrice}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600 line-through">
                    ₹{originalPrice}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-sm">
                    {deal?.discount_percentage}% OFF
                  </span>
                </div>

                {/* ✅ Offer End Date */}
                {deal?.is_active && deal?.end_date && (
                  <p className="text-red-600 text-sm mb-4">
                    Offer ends on {formatDate(deal.end_date)}
                  </p>
                )}

                <button
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  onClick={() => handleBuyItNowSubmit(deal)}
                >
                  <ShoppingCart className="inline-block mr-2" />
                  Buy It Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DealOfWeek;
