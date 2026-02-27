'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { addToCart } from "../../../redux/Slice/cartSlice";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import ProductCard from "../PlantFilter/ProductCard";
import Verify from "../../../Services/Services/Verify";
import { getProductUrl } from "../../../utils/urlHelper";

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

  const handleAddToCartSubmit = (offer) => {
    // This is now handled internally by ProductCard
    // but we can keep it as a fallback or if we need custom logic
  };

  const [wishlistUpdated, setWishlistUpdated] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(0);

  useEffect(() => {
    const handleWishlistUpdate = () => setWishlistUpdated(prev => prev + 1);
    const handleCartUpdate = () => setCartUpdated(prev => prev + 1);

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Re-fetch or refresh states when wishlist/cart changes
  useEffect(() => {
    getOfferProducts();
  }, [wishlistUpdated, cartUpdated]);

  return (
    <div className="container mx-auto md:px-4 px-0 py-8">
      <h2 className="md:text-3xl text-xl text-center font-bold mb-4">Special Offers</h2>
      <p className="text-gray-600 mb-8 md:text-xl text-center">
        Don’t miss out on these exclusive offers!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 justify-items-center">
        {offers?.map((offer, index) => (
          <div
            key={`offer-${offer.id}-${index}`}
            className="w-full cursor-pointer"
            onClick={() => router.push(getProductUrl(offer))}
          >
            <ProductCard
              name={offer?.name}
              price={Math.round(offer?.selling_price)}
              imageUrl={offer?.image}
              userRating={offer?.product_rating?.avg_rating || 0}
              ratingNumber={offer?.product_rating?.num_ratings || 0}
              product={offer}
              mrp={Math.round(offer?.mrp)}
              ribbon={offer?.ribbon || "OFFER"}
              inWishlist={offer?.is_wishlist}
              inCart={offer?.is_cart}
            />
          </div>
        ))}
      </div>
      <Verify />

    </div>
  );
}

export default Offer;
