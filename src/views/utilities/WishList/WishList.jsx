'use client';

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { trackAddToCart } from "../../../utils/ga4Ecommerce";


const WishlistItem = ({
  name,
  price,
  mrp,
  stock_status,
  handleRemove,
  product,
  handleAddToCart,

}) => {
  const router = useRouter(); const isOutOfStock = stock_status === "Out Of Stock";


  return (
    <div className="relative flex flex-col bg-white border rounded-lg shadow-md w-[160px] sm:w-[220px] h-[300px] sm:h-[320px] p-3">
      <button
        onClick={() => handleRemove(product.id)}
        className="absolute top-2 right-2 flex justify-center items-center w-7 h-7 bg-white text-gray-600 rounded-full transition hover:text-red-500 z-10"
      >
        <RiDeleteBin6Line className="w-5 h-5" />
      </button>

      <div className="flex justify-center p-3">
        {/* <img name=" "   
          className={`w-[100px] sm:w-[120px] h-[120px] sm:h-[140px] object-contain ${isOutOfStock ? "opacity-40" : ""}`}
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
          }} 
        {/* /> */}
        <img name=" "
          className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
          loading="lazy"
          alt={product.name}
        />
        {isOutOfStock && (
          <span className="absolute top-14 sm:top-16 text-center text-xs text-red-600 font-bold">
            OUT OF STOCK
          </span>
        )}
      </div>

      <div className="flex-grow text-center">
        <p className="text-sm sm:text-md font-semibold line-clamp-2">{name}</p>
        {/* <div className="flex justify-center text-yellow-500 text-xs sm:text-sm">★ ★ ★ ★ ☆</div> */}
        <div className="flex justify-center gap-2 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm  text-navy-blue">₹{Math.round(price)}</span>
            {mrp && (
              <span className="text-xs text-gray-400 line-through">₹{Math.round(mrp)}</span>
            )}
          </div>
        </div>
      </div>

      {/* <Link to="/cart" className="mt-auto"> */}
      <button
        className={`w-full py-2 rounded text-xs sm:text-sm font-medium text-white transition ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        disabled={isOutOfStock}
        onClick={() => {
          if (product.is_cart) {
            router.push("/cart"); // Redirect to cart if the product is already in the cart
          } else {
            handleAddToCart(product.product_id);
          }
        }}
      >
        {product.is_cart ? "Go to Cart" : "Add to Bag"}
      </button>


      {/* </Link> */}
    </div>
  );
};

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();



  // ⬆️ Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: -10, left: 0, behavior: 'auto' }); // change to 'smooth' if needed
  }, [pathname]);



  const getWishlistItems = async () => {
    try {
      const response = await axiosInstance.get(`/order/wishlist/`);
      const itemsWithOldPrices = response.data?.data?.wishlists.map((item) => ({
        ...item,
        oldPrice: Number(item.price) + 100,
      }));
      setWishlistItems(itemsWithOldPrices);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to fetch wishlist items", {
        variant: "error"
      });
    }
  };

  useEffect(() => {
    getWishlistItems();
  }, [accessToken]);


  const handleRemove = (id) => {
    axiosInstance.delete(`/order/wishlist/${id}/`)
      .then((response) => {
        if (response.status === 200) {
          setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
          window.dispatchEvent(new Event("wishlistUpdated"));

        }

      })
      .catch((error) => {
        console.error("Error removing item from wishlist:", error);
      });
  };

  const handleAddToCart = async (id) => {
    if (!isAuthenticated) {
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/cart/`,
        { prod_id: id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 201) {

        enqueueSnackbar("Added to cart", { variant: "success" });
        setIsAdded(!isAdded);
        getWishlistItems()
        window.dispatchEvent(new Event("wishlistUpdated"));

        // GA4: Track add_to_cart event
        const wishlistProduct = wishlistItems.find(item => item.product_id === id);
        if (wishlistProduct) trackAddToCart(wishlistProduct);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);

      const errorMessage = error.response?.data?.message || "Failed to add item to cart";
      getWishlistItems()

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };
  return (
    <>


      <div className="container mx-auto md:p-4 sm:p-0 bg-gray-50">
        <h1 className="text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-16">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              product={item}
              handleAddToCart={handleAddToCart}
              handleRemove={handleRemove}
              mrp={Math.round(item.mrp)}
              price={Math.round(item.selling_price)}
              {...item}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WishList;