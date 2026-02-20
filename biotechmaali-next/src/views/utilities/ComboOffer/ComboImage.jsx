'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../../Axios/axiosInstance";

function ComboImage() {
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [comboOffers, setComboOffers] = useState([])
  const router = useRouter();const getAllcombos = async () => {
    try {

      if (accessToken) {
        const response = await axiosInstance.get(`/combo/combo-offers/`)
        if (response.status === 200) {
          setComboOffers(response.data.data.combo_offers)
        }
      } else {
        const response = await axiosInstance.get(`/combo/combo-offers/`)
        if (response.status === 200) {
          setComboOffers(response.data.data.combo_offers)
        }
      }

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getAllcombos()
  }, [])


  const handleBuyItNowSubmit = async (id) => {

    if (isAuthenticated) {
    

      const product_data = {
        order_source: "combo",
        combo_id: id,
        // quantity: quantity,
      };

      try {
        const response = await axiosInstance.post(`/order/placeOrder/`,
          product_data);


        if (response.status === 200) {
          // enqueueSnackbar("Order placed successfully!", { variant: "success" });

          const ordersummary = response?.data?.data;
          // 🟢 get the full offer object by id
      const selectedOffer = comboOffers.find((o) => o.id === id) || null;

            // also keep it in sessionStorage to survive page refresh on checkout
      if (selectedOffer) {
        sessionStorage.setItem("selected_combo_offer", JSON.stringify(selectedOffer));
        sessionStorage.setItem("checkout_combo_offer", JSON.stringify(selectedOffer));
      }
          sessionStorage.setItem('checkout_ordersummary', JSON.stringify(ordersummary));
          router.push("/checkout"); // Navigate to checkout
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
      // If not authenticated, redirect based on device type
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      if (isMobile) {
        router.push("/mobile-signin", { replace: true });
      } else {
        router.push("/?modal=signIn", { replace: true });
      }
    }
  };

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h2 className="md:text-3xl text-xl text-center font-bold mb-4">Combo Offers</h2>
      <p className="text-gray-600 mb-8 md:text-xl">
        Indoor flowering plants bring vibrant colors and natural beauty into your home. From elegant peace lilies to cheerful ferns, these plants add a touch of joy and fragrance to any space. Discover the enchanting world of indoor flowering plants and create a blooming oasis indoors.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {comboOffers?.map((offer, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            <img name=" "   
              src={`${process.env.NEXT_PUBLIC_API_URL}${offer?.image}`} // Use the imageUrl from the offer object
              loading="lazy"
              alt={offer?.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="">
              <div className="bg-pink-100   p-6 md:p-6 text-start flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-2">{offer?.title}</h3>
                <div className="mb-4">
                  <span className="text-gray-600 text-md mb-4">Price : {Math.round(offer?.final_price)}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600 text-md mb-4 line-through">Price : {Math.round(offer?.total_price)}</span>
                </div>
                <p className="text-gray-600 text-md mb-3">{offer?.description}</p>
              </div>
            </div>
            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
              onClick={() => handleBuyItNowSubmit(offer?.id)}
            >
              <ShoppingCart className="inline-block mr-2" />
              Buy It Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComboImage;
