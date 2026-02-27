'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../../Axios/axiosInstance";
import ProductCard from "../PlantFilter/ProductCard";
import Verify from "../../../Services/Services/Verify";
import ModernComboCard from "./ModernComboCard";

function ComboImage() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [comboOffers, setComboOffers] = useState([])
  const router = useRouter(); 
  
  const getAllcombos = async () => {
    try {
      const response = await axiosInstance.get(`/combo/combo_offers_list/`);
      if (response.status === 200) {
        const data = response.data.data?.combo_offers || [];
        setComboOffers(data);
      }
    } catch (error) {
      console.log(error);
      setComboOffers([]);
    }
  };
  useEffect(() => {
    getAllcombos()
  }, [])


  const handleBuyItNowSubmit = async (id) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      if (isMobile) {
        router.push("/mobile-signin", { replace: true });
      } else {
        router.push("/?modal=signIn", { replace: true });
      }
      return;
    }

    const product_data = {
      order_source: "combo",
      combo_id: id,
      quantity: 1
    };

    try {
      const response = await axiosInstance.post(`/order/placeOrder/`, product_data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const ordersummary = response?.data?.data;
        const selectedOffer = comboOffers.find((o) => o.id === id) || null;

        if (selectedOffer) {
          sessionStorage.setItem("selected_combo_offer", JSON.stringify(selectedOffer));
          sessionStorage.setItem("checkout_combo_offer", JSON.stringify(selectedOffer));
        }
        sessionStorage.setItem('checkout_ordersummary', JSON.stringify(ordersummary));
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (error.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.message || error.response.data?.error;
        
        if (status === 400) {
          errorMessage = serverMsg || "Invalid order data. Please check your selection.";
        } else if (status === 401) {
          errorMessage = "Please login again to continue.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (serverMsg) {
          errorMessage = serverMsg;
        }
      }
      
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h2 className="md:text-3xl text-xl text-center font-bold mb-4">Combo Offers</h2>
      <p className="text-gray-600 mb-8 md:text-xl">
        Indoor flowering plants bring vibrant colors and natural beauty into your home. From elegant peace lilies to cheerful ferns, these plants add a touch of joy and fragrance to any space. Discover the enchanting world of indoor flowering plants and create a blooming oasis indoors.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 justify-items-center">
        {comboOffers?.map((offer, index) => (
          <div 
            key={offer.id || index} 
            className="w-full cursor-pointer group" 
            onClick={() => handleBuyItNowSubmit(offer?.id)}
          >
            <ModernComboCard offer={offer} />
          </div>
        ))}
      </div>
      <Verify />

    </div>
  );
}

export default ComboImage;
