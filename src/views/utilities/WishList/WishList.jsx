'use client';

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { trackAddToCart } from "../../../utils/ga4Ecommerce";
import emptyWishlistImg from "../../../Assets/wishlist.webp";
import { Trash2, Heart, ShoppingCart, ChevronRight, ShieldCheck, Truck, RefreshCcw, Leaf, Star, Plus, ArrowRight, Info, ShoppingBag } from "lucide-react";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  const getWishlistItems = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.get(`/order/wishlist/`);
        const items = response.data?.data?.wishlists || [];
        setWishlistItems(items);
      } catch (error) {
        if (error.response?.status !== 401) {
          enqueueSnackbar(error.response?.data?.message || "Failed to fetch wishlist items", {
            variant: "error"
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Guest Mode
      const raw = typeof window !== 'undefined' ? localStorage.getItem('pendingWishlistAction') : null;
      let guestItems = [];
      try {
        guestItems = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(guestItems)) guestItems = guestItems ? [guestItems] : [];
      } catch (e) {
        guestItems = [];
      }

      const mappedItems = guestItems.map((item, idx) => ({
        id: item.id || item.prod_id || idx,
        product_id: item.prod_id || item.id,
        name: item.name || 'Product',
        selling_price: Number(item.price) || Number(item.selling_price) || Number(item.mrp) || 0,
        mrp: Number(item.mrp) || Number(item.price) || Number(item.selling_price) || 0,
        image: item.product_image || item.image || item.product_img || '',
        stock_status: "In Stock"
      }));
      setWishlistItems(mappedItems);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlistItems();
  }, [accessToken]);

  const handleRemove = (id) => {
    if (accessToken) {
      axiosInstance.delete(`/order/wishlist/${id}/`)
        .then((response) => {
          if (response.status === 200) {
            setWishlistItems((prev) => prev.filter((item) => item.id !== id));
            enqueueSnackbar("Removed from wishlist", { variant: "success" });
            window.dispatchEvent(new Event("wishlistUpdated"));
          }
        })
        .catch(() => {
          enqueueSnackbar("Failed to remove item", { variant: "error" });
        });
    } else {
      const raw = localStorage.getItem('pendingWishlistAction');
      const guestItems = raw ? JSON.parse(raw) : [];
      const updated = guestItems.filter(item => (item.id || item.prod_id) !== id);
      localStorage.setItem('pendingWishlistAction', JSON.stringify(updated));
      enqueueSnackbar("Removed from favorites", { variant: "success" });
      getWishlistItems();
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  const handleClearWishlist = async () => {
    if (accessToken) {
      try {
        // Remove items one by one since there's no bulk clear endpoint
        await Promise.all(wishlistItems.map(item => axiosInstance.delete(`/order/wishlist/${item.id}/`)));
        setWishlistItems([]);
        enqueueSnackbar("Wishlist cleared!", { variant: "success" });
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (err) {
        enqueueSnackbar("Failed to clear wishlist", { variant: "error" });
      }
    } else {
      localStorage.removeItem('pendingWishlistAction');
      setWishlistItems([]);
      enqueueSnackbar("Wishlist cleared", { variant: "success" });
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  const handleAddToCart = async (id) => {
    const productToBag = wishlistItems.find(item => item.product_id === id || item.id === id);

    if (accessToken) {
      try {
        const response = await axiosInstance.post(
          `/order/cart/`,
          { prod_id: id, quantity: 1 }
        );

        if (response.status === 201 || response.status === 200) {
          enqueueSnackbar("Added to cart!", { variant: "success" });
          getWishlistItems();
          window.dispatchEvent(new Event("wishlistUpdated"));
          window.dispatchEvent(new Event("cartUpdated"));
          if (productToBag) trackAddToCart(productToBag);
        }
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to add item to cart";
        const availableStock = error.response?.data?.available_stock;
        getWishlistItems();
        if ((msg.toLowerCase().includes("stock")) && availableStock !== undefined) {
          enqueueSnackbar(`Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available.`, { variant: "warning" });
        } else if (msg.toLowerCase().includes("already") || error.response?.status === 400) {
          enqueueSnackbar("This item is already in your cart.", { variant: "info" });
        } else {
          enqueueSnackbar(msg, { variant: "error" });
        }
      }
    } else {
      if (!productToBag) return;

      const raw = localStorage.getItem('pendingCartAction');
      let guestCart = [];
      try {
        guestCart = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(guestCart)) guestCart = guestCart ? [guestCart] : [];
      } catch (e) {
        guestCart = [];
      }

      const existingIndex = guestCart.findIndex(item => item.prod_id === id || item.id === id);
      if (existingIndex > -1) {
        guestCart[existingIndex].quantity = (Number(guestCart[existingIndex].quantity) || 1) + 1;
      } else {
        guestCart.push({
          prod_id: id,
          id: id,
          quantity: 1,
          name: productToBag.name,
          price: productToBag.selling_price || productToBag.price,
          selling_price: productToBag.selling_price || productToBag.price,
          mrp: productToBag.mrp,
          product_image: productToBag.image
        });
      }

      localStorage.setItem('pendingCartAction', JSON.stringify(guestCart));
      enqueueSnackbar("Added to bag!", { variant: "success" });
      window.dispatchEvent(new Event("cartUpdated"));
      getWishlistItems();
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlistItems.length === 0) return;

    if (accessToken) {
      try {
        const products = wishlistItems
          .filter(item => item.stock_status !== "Out Of Stock")
          .map(item => ({
            prod_id: item.product_id || item.id,
            quantity: 1
          }));

        if (products.length === 0) {
          enqueueSnackbar("No in-stock items to add", { variant: "info" });
          return;
        }

        const response = await axiosInstance.post(`/order/cart/`, { products });

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar(`${products.length} item${products.length > 1 ? 's' : ''} added to cart!`, { variant: "success" });
          getWishlistItems();
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to add items to cart";
        if (msg.toLowerCase().includes("already") || error.response?.status === 400) {
          enqueueSnackbar("Some items are already in your cart.", { variant: "info" });
        } else {
          enqueueSnackbar(msg, { variant: "error" });
        }
        getWishlistItems();
      }
    } else {
      // Guest: add each item to localStorage cart
      for (const item of wishlistItems) {
        const id = item.product_id || item.id;
        await handleAddToCart(id);
      }
    }
  };

  const totalItems = wishlistItems.length;
  const totalValue = wishlistItems.reduce((acc, item) => acc + (Number(item.selling_price) || 0), 0);
  const totalMrp = wishlistItems.reduce((acc, item) => acc + (Number(item.mrp) || 0), 0);
  const totalSavings = totalMrp - totalValue;

  return (
    <div className="min-h-screen bg-gray-50 pb-8 sm:px-6 lg:px-8">
      {/* ── Breadcrumb Stepper ── */}
      <div className="bg-white border-b py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between w-full relative overflow-x-auto pb-2 scrollbar-hide">
            {/* Step 1: Wishlist (Current) */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap">
              <div className="w-10 h-10 rounded-full border-2 bg-[#375421] border-[#375421] flex items-center justify-center shadow-lg shadow-green-100">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-[13px] font-bold uppercase tracking-wide text-[#375421]">Wishlist</span>
            </div>

            <div className="flex-1 min-w-[30px] h-[2px] mx-4 bg-[#e6edde]" />

            {/* Step 2: Add to Cart */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Cart</span>
            </div>

            <div className="flex-1 min-w-[30px] h-[2px] mx-4 bg-[#e6edde]" />

            {/* Step 3: Checkout */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                <span className="text-sm font-black text-gray-400 opacity-60">✓</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium italic">Loading your favorites...</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Wishlist Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                    <h2 className="sr-only">Wishlist Items</h2>
                    <p className="text-sm text-gray-500 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} saved</p>
                  </div>
                  <button
                    onClick={handleClearWishlist}
                    className="px-3 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-all text-sm font-medium border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                  </button>
                </div>

                {/* Info Banner */}
                <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                        <span className="text-sm font-bold text-gray-800">
                          {totalItems} plant{totalItems !== 1 ? 's' : ''} waiting for a new home
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">Add them to your cart before they run out!</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 block mb-0.5 uppercase tracking-tighter">Worth</span>
                      <span className="text-lg font-black text-green-700">₹{Math.round(totalValue)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-gray-100/60">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      Price-match guarantee
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                        <RefreshCcw className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      7-day guarantee
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Truck className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      Free shipping above ₹2000
                    </div>
                  </div>
                </div>

                {/* Wishlist Items List */}
                <div className="space-y-4">
                  {wishlistItems.map((item) => {
                    const product = item.main_product_details || item.product_details || item;
                    const itemName = product.name || item.name || 'Product';
                    const sellingPrice = Number(product.selling_price) || Number(product.price) || Number(item.selling_price) || 0;
                    const mrpPrice = Number(product.mrp) || Number(item.mrp) || sellingPrice;
                    const discount = mrpPrice > sellingPrice ? mrpPrice - sellingPrice : 0;
                    const imgUrl = product.image || product.product_image || item.image || '';
                    const isOutOfStock = item.stock_status === "Out Of Stock" || product.stock_status === "Out Of Stock";
                    const isInCart = item.is_cart || false;
                    const category = product.category || item.category || 'Plant';

                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300"
                      >
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 z-10"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Product Image */}
                        <div className={`relative w-full sm:w-32 md:w-40 aspect-square overflow-hidden rounded-xl bg-gray-50 flex-shrink-0 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}>
                          <img
                            src={imgUrl?.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_API_URL}${imgUrl}`}
                            alt={itemName}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          {discount > 0 && (
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                              SAVE ₹{Math.round(discount)}
                            </div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">Out of Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col flex-1 min-w-0 py-1">
                          <div className="mb-1">
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full border border-green-100/50">
                              {category}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-gray-900 truncate pr-8 group-hover:text-green-800 transition-colors">
                            {itemName}
                          </h3>

                          <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xl font-black text-gray-900">
                                  ₹{Math.round(sellingPrice)}
                                </p>
                                {mrpPrice > sellingPrice && (
                                  <p className="text-sm font-bold line-through text-gray-400 decoration-red-400/50">
                                    ₹{Math.round(mrpPrice)}
                                  </p>
                                )}
                              </div>
                              {discount > 0 && (
                                <p className="text-[11px] font-bold text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded-md border border-green-100">
                                  ✓ You save ₹{Math.round(discount)}
                                </p>
                              )}
                            </div>

                            <button
                              disabled={isOutOfStock}
                              onClick={() => {
                                if (isInCart) {
                                  router.push("/cart");
                                } else {
                                  handleAddToCart(item.product_id || item.id);
                                }
                              }}
                              className={`h-10 lg:h-12 px-4 lg:px-6 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm active:scale-95 ${
                                isOutOfStock
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : isInCart
                                    ? "bg-[#6D7D62] text-white"
                                    : "bg-[#375421] text-white hover:shadow-lg hover:shadow-[#375421]/20"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest leading-none">
                                {isInCart ? "In Cart" : "Add to Bag"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Wishlist Summary</h2>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>Total Items</span>
                    <span className="text-gray-900 font-bold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>Total MRP</span>
                    <span className="text-gray-900 font-bold">₹{Math.round(totalMrp)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-green-600">
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Potential savings</span>
                      <span>-₹{Math.round(totalSavings)}</span>
                    </div>
                  )}

                  <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Estimated Total</span>
                      <span className="text-3xl font-black text-gray-900">₹{Math.round(totalValue)}</span>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Star className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs font-black text-green-800 uppercase tracking-tight">
                        Total savings of ₹{Math.round(totalSavings)}!
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddAllToCart}
                  className="w-full mt-8 bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add All to Cart
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Payments secured by RazorPay SSL</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-gray-400" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">7-day plant survival guarantee</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Expert packaging — 99.2% arrive healthy</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-gray-400" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Image src={emptyWishlistImg} alt="Empty Wishlist" width={64} height={64} className="grayscale opacity-40 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Save items you love to your wishlist and come back later!</p>
            <button
              className="bg-green-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95"
              onClick={() => router.push("/")}
            >
              Explore Plants
            </button>
          </div>
        )}

        {/* Recently Viewed */}
        {wishlistItems.length > 0 && (
          <div className="mt-16">
            <RecentlyViewedProducts title="You May Also Like" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;