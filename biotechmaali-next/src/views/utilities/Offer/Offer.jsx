'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { addToCart } from "../../../redux/Slice/cartSlice";
import { selectAccessToken } from "../../../redux/User/verificationSlice"; // adjust import

function Offer() {
  const [offers, setOffers] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Auth states
  const [token] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const accessToken = useSelector(selectAccessToken);

  // ✅ Fetch Offer Products
  const getOfferProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/offerProducts/`);
      if (response.status === 200) {
        setOffers(response.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    getOfferProducts();
  }, []);

  // ✅ Add to Cart handler
  const handleAddToCartSubmit = async (offer) => {
    // 🔑 Check auth using token or accessToken
    if (token || accessToken) {
      const product_data = {
        main_prod_id: offer.id,
        quantity: 1,
      };

      try {
        const response = await axiosInstance.post(`/order/cart/`, product_data);

        if (response.status === 201) {
          dispatch(addToCart(product_data));
          enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));
          setCartItems((prev) => [...prev, offer.id]);
        }
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to add product to cart",
          { variant: "info" }
        );
      }
    } else {
      enqueueSnackbar("Please sign in", { variant: "info" });
      router.push("/?modal=signIn", { replace: true });
    }
  };

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

          const isInCart = cartItems.includes(offer.id);

          return (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              {offer?.image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${offer.image}`}
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

                {/* ✅ Add to Cart Button */}
                <button
                  className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white mt-4"
                  onClick={
                    isInCart
                      ? () => router.push("/cart")
                      : () => handleAddToCartSubmit(offer)
                  }
                >
                  <ShoppingCart className="inline-block mr-2" />
                  {isInCart ? "Go to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Offer;
