'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "../CartComponent/ProductCard";
import CartSummary from "../CartComponent/Cartsummary";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { useSearchParams } from "next/navigation";
import { trackViewCart, trackRemoveFromCart } from "../../../utils/ga4Ecommerce";
import emptyCartImg from "../../../Assets/emptycart.webp";
import { Trash2, ChevronRight, Info, ShieldCheck, RefreshCcw, Truck, Leaf, Gift, Star, Plus, ShoppingCart, MapPin, CreditCard, Check } from "lucide-react";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";

const Cart = () => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [completeYourGarden, setCompleteYourGarden] = useState([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);
  const [loading, setLoading] = useState(true);

  // Progress steps for checkout
  const steps = [
    { id: 'cart', label: 'Cart', icon: ShoppingCart, active: true, completed: false },
    { id: 'checkout', label: 'Checkout', icon: MapPin, active: false, completed: false },
    { id: 'payment', label: 'Payment', icon: CreditCard, active: false, completed: false },
  ];

  // Fetch cart items and free shipping threshold
  const fetchCartItems = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.get(`/order/cart/`);

        if (response.data?.message === "success") {
          const cartItems = response.data.data.cart;
          setProducts(cartItems);
          setCompleteYourGarden(response.data.data.complete_your_garden || []);

          // GA4: Track view_cart event
          trackViewCart(cartItems);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest Mode: Fetch from localStorage
      const guestItems = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('pendingCartAction') || '[]') : [];
      // Map guest items to match the structure expected by ProductCard
      const mappedItems = guestItems.map((item, idx) => ({
        id: item.id || item.prod_id || idx,
        product_id: item.prod_id || item.id,
        name: item.name,
        mrp: item.mrp || item.price,
        selling_price: item.price || item.mrp,
        quantity: item.quantity || 1,
        image: item.product_image || item.image,
        stock_status: true // Default for guest as we don't have real-time check here
      }));
      setProducts(mappedItems);
      setLoading(false);
    }
  };

  const fetchFreeShippingThreshold = async () => {
    try {
      const response = await axiosInstance.get(`/utils/freeShipping/`);
      if (response.data?.status === "success" || response.data?.message === "success") {
        const threshold = response.data?.data?.threshold || response.data?.threshold || 2000;
        setFreeShippingThreshold(Number(threshold));
      }
    } catch (err) {
      console.error("Error fetching free shipping threshold:", err.message);
    }
  };

  // Shared refresh function to ensure real-time updates
  const refreshCartData = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.get(`/order/cart/`);
        if (response.data?.message === "success") {
          setProducts(response.data.data.cart);
          setCompleteYourGarden(response.data.data.complete_your_garden || []);
        }
        await fetchFreeShippingThreshold();
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error refreshing cart data:", err.message);
      }
    } else {
      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchFreeShippingThreshold();
  }, [accessToken]);

  // Handle updating product quantity in cart
  const handleUpdateQuantity = async (cartId, newQuantity, rollback) => {
    if (accessToken) {
      try {
        const response = await axiosInstance.patch(
          `/order/cart/`,
          { cart_id: cartId, quantity: newQuantity }
        );

        if (response.data?.message === "success") {
          await refreshCartData();
        }
      } catch (err) {
        const msg = err.response?.data?.message || "";
        const availableStock = err.response?.data?.available_stock;
        if ((msg.toLowerCase().includes("not enough stock") || msg.toLowerCase().includes("stock")) && availableStock !== undefined) {
          enqueueSnackbar(`Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available in stock.`, { variant: "warning" });
        } else {
          enqueueSnackbar(msg || "Failed to update product quantity!", { variant: "error" });
        }
        if (rollback) rollback();
      }
    } else {
      // Guest update
      const guestItems = JSON.parse(localStorage.getItem('pendingCartAction') || '[]');
      const itemIndex = guestItems.findIndex(item => (item.id || item.prod_id) === cartId);
      if (itemIndex > -1) {
        guestItems[itemIndex].quantity = newQuantity;
        localStorage.setItem('pendingCartAction', JSON.stringify(guestItems));
        fetchCartItems();
      }
    }
  };

  // Handle removing products from cart
  const handleRemove = async (id) => {
    if (accessToken) {
      try {
        const response = await axiosInstance.delete(`/order/cart/${id}/`);

        if (response.status === 200) {
          enqueueSnackbar("Product removed from cart!", { variant: "success" });
          const removedProduct = products.find((p) => p.id === id);
          if (removedProduct) trackRemoveFromCart(removedProduct, removedProduct.quantity || 1);
          await refreshCartData();
        }
      } catch (err) {
        enqueueSnackbar("Failed to remove product from cart!", { variant: "error" });
      }
    } else {
      // Guest removal
      const guestItems = JSON.parse(localStorage.getItem('pendingCartAction') || '[]');
      const updated = guestItems.filter(item => (item.id || item.prod_id) !== id);
      localStorage.setItem('pendingCartAction', JSON.stringify(updated));
      enqueueSnackbar("Removed from guest cart", { variant: "success" });
      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Handle adding product to cart from upsell
  const handleAddToCart = async (productId) => {
    try {
      console.log("Adding to cart:", productId);
      const response = await axiosInstance.post(`/order/cart/`, {
        main_prod_id: productId,
        quantity: 1,
      });

      console.log("Add to cart response:", response.data);

      if (response.data?.message === "success" || response.status === 201 || response.status === 200) {
        enqueueSnackbar("Product added to cart!", { variant: "success" });
        
        // Immediate full refresh of all data states
        await refreshCartData();
      } else {
        // Fallback for different success formats
        enqueueSnackbar("Item added successfully", { variant: "success" });
        await refreshCartData();
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add product to cart!";
      enqueueSnackbar(msg, { variant: "error" });
    }
  };

  // Handle clearing the entire cart
  const handleClearCart = async () => {
    if (accessToken) {
      try {
        const response = await axiosInstance.delete(`/order/cart/clear/`);
        if (response.data?.message === "success" || response.status === 200) {
          enqueueSnackbar("Cart cleared successfully!", { variant: "success" });
          await refreshCartData();
        }
      } catch (err) {
        console.error("Clear cart error:", err);
        enqueueSnackbar("Failed to clear cart!", { variant: "error" });
      }
    } else {
      // Guest clear
      localStorage.removeItem('pendingCartAction');
      enqueueSnackbar("Guest cart cleared", { variant: "success" });
      fetchCartItems();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // Calculate total items and amount
  const totalItems = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalAmount = products.reduce((acc, product) => acc + product.mrp * product.quantity, 0);
  const totalSellingPrice = products.reduce((acc, product) => acc + product.selling_price * product.quantity, 0);
  const discount = totalAmount - totalSellingPrice;

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totalSellingPrice);
  const freeShippingProgress = Math.min(100, (totalSellingPrice / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-8 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between w-full relative overflow-x-auto pb-2 scrollbar-hide">
            
            {/* Step 1: Shopping Cart (Current) */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap">
              <div className="w-10 h-10 rounded-full border-2 bg-[#375421] flex items-center justify-center transition-all duration-500 bg-[#375421] border-[#375421] shadow-lg shadow-green-100">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-[13px] font-bold uppercase tracking-wide transition-colors text-[#375421]">Shopping Cart</span>
            </div>

            {/* Line 1 */}
            <div className="flex-1 min-w-[30px] h-[2px] mx-4 bg-[#e6edde]" />

            {/* Step 2: Checkout */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                <span className="text-sm font-black text-gray-400 opacity-60">2</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Checkout</span>
            </div>

            {/* Line 2 */}
            <div className="flex-1 min-w-[30px] h-[2px] mx-4 bg-[#e6edde]" />

            {/* Step 3: Payment */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                <span className="text-sm font-black text-gray-400 opacity-60">3</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Payment</span>
            </div>

            {/* Line 3 */}
            <div className="flex-1 min-w-[30px] h-[2px] mx-4 bg-[#e6edde]" />

            {/* Step 4: Confirmation */}
            <div className="flex items-center gap-3 relative z-10 whitespace-nowrap opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                <span className="text-sm font-black text-gray-400 opacity-60">4</span>
              </div>
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Confirmation</span>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium italic">Syncing your garden...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items and Progress */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                    <p className="text-sm text-gray-500 mt-1">{totalItems} items · ₹{Math.round(totalSellingPrice)}</p>
                  </div>
                  <button 
                    onClick={handleClearCart}
                    className="px-3 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-all text-sm font-medium border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear cart
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                         <Truck className="w-5 h-5 text-orange-500" />
                         <span className="text-sm font-bold text-gray-800">
                          {amountToFreeShipping > 0 
                            ? `Add ₹${Math.round(amountToFreeShipping)} more for FREE shipping` 
                            : "You've earned FREE shipping!"}
                         </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">Valid on all orders above ₹{freeShippingThreshold}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-bold text-gray-400 block mb-0.5 uppercase tracking-tighter">Current Balance</span>
                       <span className="text-lg font-black text-green-700">₹{Math.round(totalSellingPrice)}</span>
                    </div>
                  </div>

                  <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner mb-6">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full shadow-sm ${
                        freeShippingProgress >= 100 ? 'bg-[#375421]' : 'bg-[#375421]'
                      }`} 
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                    
                    {/* Goal indicator */}
                    <div className="absolute top-0 right-0 h-full w-[2px] bg-white opacity-50 z-20" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-gray-100/60">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      Secure packaging
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                        <RefreshCcw className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      7-day guarantee
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Gift className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      Gift wrap available
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      handleRemove={handleRemove}
                      handleQuantityChange={handleUpdateQuantity}
                    />
                  ))}
                </div>
              </div>

              {/* Upsell Section */}
              {completeYourGarden.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Star className="w-32 h-32 text-orange-400 rotate-12" />
                  </div>
                  <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-800 uppercase tracking-wide relative z-10">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    </div>
                    Complete your garden
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 relative z-10">
                    {completeYourGarden.map((item) => (
                      <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:shadow-green-50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] bg-gradient-to-br from-green-50/50 to-white flex items-center justify-center relative overflow-hidden">
                           <img 
                             src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`} 
                             alt={item.name} 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                           {item.ribbon && (
                             <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm z-20">
                               {item.ribbon}
                             </div>
                           )}
                           <div className="absolute inset-0 bg-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4 border-t border-gray-50">
                          <h3 className="text-sm font-bold text-gray-800 leading-tight mb-1 group-hover:text-green-800 transition-colors truncate">{item.name}</h3>
                          <p className="text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-tighter truncate">{item.category_slug}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[15px] text-gray-900">₹{Math.round(item.selling_price)}</span>
                              {item.mrp > item.selling_price && (
                                <span className="text-[10px] text-gray-400 line-through">₹{Math.round(item.mrp)}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleAddToCart(item.main_prod_id || item.product_id || item.id)}
                              className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-90"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <CartSummary
                totalItems={totalItems}
                totalAmount={Math.round(totalAmount)}
                discount={Math.round(discount)}
                totalSellingPrice={Math.round(totalSellingPrice)}
                amountToFreeShipping={amountToFreeShipping}
                products={products}
                handlePlaceOrder={null} // Passing null to override original button but keep logic available
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <img src={emptyCartImg.src} alt="Empty Cart" className="w-16 h-16 grayscale opacity-40 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything yet. Start exploring our beautiful plants!</p>
            <button
              className="bg-green-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Recently Viewed Products (Only show if cart has items) */}
        {products.length > 0 && (
          <div className="mt-16">
            <RecentlyViewedProducts title="Recently Viewed Items" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
