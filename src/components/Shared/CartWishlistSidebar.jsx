'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import axiosInstance from '../../Axios/axiosInstance';
import { selectAccessToken } from '../../redux/User/verificationSlice';
import RightDrawer from './RightDrawer';
import { ShoppingBag, Heart, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CartWishlistSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('cart'); // 'cart' or 'wishlist'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector(selectAccessToken);
  const pathname = usePathname();

  const fetchItems = async (contentType) => {
    // setLoading(true); // Remove or comment out to prevent loader when just syncing background data
    try {
      const endpoint = contentType === 'cart' ? '/order/cart/' : '/order/wishlist/';
      const response = await axiosInstance.get(endpoint);
      
      if (contentType === 'cart') {
        setItems(response.data?.data?.cart || []);
      } else {
        setItems(response.data?.data?.wishlists || []);
      }
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // If we're on the cart page, don't trigger the sidebar's internal update logic that might show a loader or open it
    const isCartPage = pathname === '/cart';
    
    // Optimistic UI update
    const previousItems = [...items];
    setItems(items.map(item => item.id === cartId ? { ...item, quantity: newQuantity } : item));

    try {
      const response = await axiosInstance.patch(
        `/order/cart/`,
        { cart_id: cartId, quantity: newQuantity }
      );

      if (response.data?.message === "success") {
        // Still dispatch so badges update, but sidebar should stay closed due to useEffect check
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      setItems(previousItems);
      const msg = err.response?.data?.message || "";
      const availableStock = err.response?.data?.available_stock;
      if ((msg.toLowerCase().includes("not enough stock") || msg.toLowerCase().includes("stock")) && availableStock !== undefined) {
        enqueueSnackbar(`Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available in stock.`, { variant: "warning" });
      } else {
        enqueueSnackbar(msg || "Failed to update quantity", { variant: "error" });
      }
    }
  };

  const removeItem = async (id) => {
    try {
      const endpoint = type === 'cart' ? `/order/cart/${id}/` : `/order/wishlist/${id}/`;
      const response = await axiosInstance.delete(endpoint);
      
      if (response.status === 200 || response.data?.message === 'success') {
        enqueueSnackbar("Removed successfully", { variant: "success" });
        setItems(items.filter(item => item.id !== id));
        window.dispatchEvent(new Event(type === 'cart' ? "cartUpdated" : "wishlistUpdated"));
      }
    } catch (error) {
      enqueueSnackbar("Failed to remove item", { variant: "error" });
    }
  };

  const fetchGuestItems = (contentType) => {
    const key = contentType === 'cart' ? 'pendingCartAction' : 'pendingWishlistAction';
    const pending = localStorage.getItem(key);
    if (pending) {
      // For guest, we might only have one item or the action payload
      // Since we don't have full product data easily available without another fetch,
      // we'll just show a simplified "Guest Session" view or empty instructions.
      // But usually, the user wants to see the actual updated list.
      // For now, let's just stick to what's available.
      setItems([]); 
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      // Sync data in background regardless of page
      if (accessToken) fetchItems('cart');
      else fetchGuestItems('cart');
      
      const currentPath = window.location.pathname;
      if (currentPath.includes('/cart') || currentPath.includes('/wishlist')) {
        return;
      }
      
      setType('cart');
      setIsOpen(true);
    };

    const handleWishlistUpdate = () => {
      // Sync data in background regardless of page
      if (accessToken) fetchItems('wishlist');
      else fetchGuestItems('wishlist');
      
      const currentPath = window.location.pathname;
      if (currentPath.includes('/cart') || currentPath.includes('/wishlist')) {
        return;
      }
      
      setType('wishlist');
      setIsOpen(true);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [accessToken, pathname]);

  const title = type === 'cart' ? 'Shopping Cart' : 'My Wishlist';
  const subtitle = type === 'cart' ? 'Your selected plants' : 'Plants you love';
  const footerText = type === 'cart' ? 'Free shipping on orders over ₹2000' : 'Sign in to save these items permanently';

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={title}
      subtitle={subtitle}
      footerIcon={type === 'cart' ? <ShoppingBag size={18} className="text-[#375421]" /> : <Heart size={18} className="text-[#375421]" />}
      footerText={footerText}
    >
      <div className="flex flex-col h-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-[#375421] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Updating your list...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const wishlistProduct = type === 'wishlist' ? (item.main_product_details || item.product_details || item) : null;
              const product = type === 'cart' ? item : wishlistProduct;
              if (!product) return null;
              
              const price = product.price || product.mrp;
              const imgUrl = product.image || product.product_image || product.product_img || (product.images && product.images[0]?.image);

              return (
                <div 
                  key={item.id || idx}
                  className="group relative p-4 border-2 border-gray-900 rounded-[24px] bg-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-site-bg rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                       <Image 
                        src={imgUrl?.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_API_URL}${imgUrl}`}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                       />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 text-sm truncate leading-tight mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#375421] font-black text-sm">₹{Math.round(price)}</span>
                        {product.mrp > price && (
                          <span className="text-gray-400 line-through text-[10px]">₹{Math.round(product.mrp)}</span>
                        )}
                      </div>
                      {type === 'cart' ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-900 rounded-lg overflow-hidden h-7 bg-[#ebf5eb]">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 hover:bg-gray-200 transition-colors"
                            >
                              <Minus size={10} strokeWidth={3} />
                            </button>
                            <span className="px-2 text-[10px] font-black border-x border-gray-900 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={10} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      ) : (
                         <div className="flex items-center gap-1">
                           <span className="text-[10px] font-black uppercase text-gray-400">Wishlist Item</span>
                         </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
               <Link 
                href={type === 'cart' ? '/cart' : '/wishlist'}
                onClick={() => setIsOpen(false)}
                className="w-full py-4.5 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all active:scale-[0.96] flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-900 hover:bg-site-bg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
               >
                 VIEW FULL {type.toUpperCase()} <ArrowRight size={14} />
               </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-site-bg rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
               {type === 'cart' ? <ShoppingBag size={32} className="text-gray-300" /> : <Heart size={32} className="text-gray-300" />}
            </div>
            <p className="text-gray-900 font-black text-lg tracking-tight mb-2">Nothing here yet!</p>
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest leading-relaxed px-10">
              Go back and pick some green friends for your home
            </p>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-8 px-8 py-3 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#375421] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </RightDrawer>
  );
};

export default CartWishlistSidebar;
