'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Sparkles, ShoppingCart, Loader2 } from "lucide-react";
import axiosInstance from "../../../Axios/axiosInstance";
import RatingsAndReviews from "./ProductReviews";

/**
 * Lightweight video renderer — replaces react-player to avoid pulling in
 * dashjs (931 KB) and hls.js (496 KB) as transitive dependencies.
 */
const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&#]+)/);
  return m ? m[1] : null;
};

const LightVideo = ({ url }) => {
  if (!url) return <p className="text-gray-400 text-center py-8">No video available</p>;
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytId}`}
        title="Product video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video rounded-lg"
        loading="lazy"
      />
    );
  }
  // Direct MP4 / WebM URL
  return (
    <video controls className="w-full rounded-lg" preload="metadata">
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  );
};

const AboutProduct = ({ productDetailData, ratingData, reviewData, onWriteReview }) => {
  const router = useRouter();
  const cartItems = useSelector(state => state.cart.items) || [];
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [isAuthenticatedMobile] = useState(() => typeof window !== 'undefined' ? !!localStorage.getItem('userData') : false);

  const hasInitialData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
  const [activeTab, setActiveTab] = useState("about"); // Default to Description
  const [video, setVideo] = useState(hasInitialData ? (productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "") : "");
  const [productData, setProductData] = useState(hasInitialData ? productDetailData : {});
  const [careGuides, setCareGuides] = useState(productDetailData?.data?.care_guides || []);
  const [addOnData, setAddOnData] = useState(productDetailData?.data?.product_add_ons || []);
  const [isBundling, setIsBundling] = useState(false);

  useEffect(() => {
    // Check if it's a valid data object, not just an empty array
    const hasData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
    if (hasData) {
      setProductData(productDetailData);
      setVideo(productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "");
      setCareGuides(productDetailData?.data?.care_guides || []);
      const addons = productDetailData?.data?.product_add_ons || [];
      setAddOnData(addons);
      
      // Auto-switch to bundle tab if it's available on first load with data
      if (addons.length > 0) {
        setActiveTab("bundle");
      }
    }
  }, [productDetailData]);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-about-content">
            <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {productData?.data?.product?.short_description || productData?.product?.short_description || productData?.short_description || ""}
            </p>
          </motion.div>
        );
      case "bundle":
        const mainId = productData?.data?.product?.id;
        const mainInCart = cartItems.some(item => item.prod_id === mainId || item.main_prod_id === mainId);
        const bundleSavings = Math.round(
          ((productData?.data?.product?.mrp - productData?.data?.product?.selling_price) || 0) + 
          addOnData.reduce((acc, curr) => acc + ((curr.mrp - curr.selling_price) || 0), 0)
        );
        const totalPrice = Math.round(
          (productData?.data?.product?.selling_price || 0) + 
          addOnData.reduce((acc, curr) => acc + (curr.selling_price || 0), 0)
        );
        const totalMrp = Math.round(
          (productData?.data?.product?.mrp || 0) + 
          addOnData.reduce((acc, curr) => acc + (curr.mrp || 0), 0)
        );

        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-bundle-content">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
                <Sparkles className="w-24 h-24 text-bio-green" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Frequently Bought Together</h3>
              <p className="text-[13px] text-gray-500 mb-10 font-medium">Customers who bought this also added these items. Save ₹{bundleSavings.toLocaleString()} as a bundle.</p>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-12">
                {/* Main Product Card */}
                <div className="relative group/main">
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 bg-white ${mainInCart ? 'border-bio-green/20 bg-emerald-50/10' : 'border-gray-100'}`}>
                    <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden bg-white">
                      <img 
                        src={(() => {
                          const img = productData?.data?.product?.images?.[0];
                          const path = img?.image || img?.url || productData?.data?.product?.image || "";
                          return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${path}`;
                        })()} 
                        alt="Current Product" 
                        className="w-full h-full object-contain p-1 group-hover/main:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-[10px] font-black text-bio-green uppercase tracking-wider">Current Item</p>
                      <p className="text-sm font-black text-gray-900">₹{Math.round(productData?.data?.product?.selling_price || 0)}</p>
                    </div>
                  </div>
                  {mainInCart && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-bio-green text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-50 duration-500">
                      <span className="text-xs font-black">✓</span>
                    </div>
                  )}
                </div>

                <div className="text-gray-300 font-light text-2xl h-full flex items-center mt-[-40px]">+</div>

                {/* Add-ons List */}
                {addOnData.map((item, idx) => {
                  const addonId = item.product_id || item.id;
                  const isInCart = cartItems.some(c => 
                    c.prod_id === addonId || 
                    c.main_prod_id === addonId || 
                    c.product_id === addonId
                  );
                  return (
                    <React.Fragment key={item.id || idx}>
                      <div className="relative group/addon">
                        <div className={`p-4 rounded-2xl border-2 transition-all duration-300 bg-white ${isInCart ? 'border-bio-green/20 bg-emerald-50/10' : 'border-gray-100'}`}>
                          <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden bg-white">
                            <img 
                              src={item.image.startsWith("http") ? item.image : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${item.image}`} 
                              alt={item.name} 
                              className="w-full h-full object-contain p-2 group-hover/addon:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="space-y-1 text-center">
                            <p className="text-[10px] font-bold text-gray-400 line-clamp-1 w-24 mx-auto">{item.name}</p>
                            <p className="text-sm font-black text-gray-900">₹{Math.round(item.selling_price)}</p>
                          </div>
                        </div>
                        {isInCart && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-bio-green text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-50 duration-500">
                            <span className="text-xs font-black">✓</span>
                          </div>
                        )}
                      </div>
                      {idx < addOnData.length - 1 && (
                        <div className="text-gray-300 font-light text-2xl h-full flex items-center mt-[-40px]">+</div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Total Calculation Bar */}
              <div className="bg-[#f8fbf6] rounded-3xl p-6 md:p-8 flex flex-wrap justify-between items-center border border-bio-green/10 gap-6">
                <div className="space-y-1">
                  <p className="text-base md:text-lg font-black text-gray-900">Total for {addOnData.length + 1} items</p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-bio-green rounded-full animate-pulse" />
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Includes free shipping on this bundle</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 line-through text-sm font-medium">₹{totalMrp.toLocaleString()}</span>
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                    <div className="bg-[#ffe8e8] text-[#ff4d4d] px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                      Save ₹{bundleSavings.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={isBundling}
                onClick={async () => {
                  if (!isAuthenticated && !isAuthenticatedMobile) {
                    enqueueSnackbar("Please login to add bundle to cart", { variant: "info" });
                    router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn");
                    return;
                  }

                  setIsBundling(true);
                  const itemsToAdd = [];
                  if (!mainInCart) itemsToAdd.push({ prod_id: mainId, quantity: 1 });
                  addOnData.forEach(item => {
                    const addonId = item.product_id || item.id;
                    const isInCart = cartItems.some(c => 
                      c.prod_id === addonId || 
                      c.main_prod_id === addonId || 
                      c.product_id === addonId
                    );
                    if (!isInCart) itemsToAdd.push({ prod_id: addonId, quantity: 1 });
                  });

                  if (itemsToAdd.length === 0) {
                    enqueueSnackbar("Bundle is already in your cart! 🌿", { variant: "info" });
                    router.push('/cart');
                    setIsBundling(false);
                    return;
                  }

                  try {
                    enqueueSnackbar(`Adding bundle items...`, { variant: "info" });
                    for (const item of itemsToAdd) {
                      try {
                        await axiosInstance.post('/order/cart/', item);
                      } catch (singleErr) {
                        const msg = singleErr.response?.data?.message || "";
                        if (msg.toLowerCase().includes("already")) continue;
                        throw singleErr;
                      }
                    }
                    enqueueSnackbar("Bundle items updated successfully! 🎉", { variant: "success" });
                    window.dispatchEvent(new Event("cartUpdated"));
                  } catch (err) {
                    enqueueSnackbar("Failed to complete bundle addition.", { variant: "error" });
                  } finally {
                    setIsBundling(false);
                  }
                }}
                className="w-full mt-6 bg-bio-green hover:bg-[#2d4a22] text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 text-[13px] transition-all active:scale-[0.98] shadow-xl shadow-bio-green/20 disabled:opacity-50"
              >
                {isBundling ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <ShoppingCart size={18} /> 
                    <span>Add Bundle to Cart — Save ₹{bundleSavings.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      case "care":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-care-content grid grid-cols-1 md:grid-cols-2 gap-6">
            {careGuides.length > 0 ? (
              careGuides.map((guide) => (
                <div key={guide.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  {guide.icon && (
                    <img
                      src={guide.icon}
                      alt={guide.title}
                      className="w-12 h-12 object-cover rounded-full bg-gray-50 border border-gray-200 p-1"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{guide.title}</h4>
                    {guide.subtitle && <p className="text-sm font-semibold text-bio-green">{guide.subtitle}</p>}
                    <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No care guides available for this product.</p>
            )}
          </motion.div>
        );
      case "box":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-box-content space-y-4">
             <div className="flex items-start gap-4 p-4 bg-sage-green/10 rounded-2xl border border-sage-green/20">
                <div className="text-2xl mt-1">📦</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">What's in the Box?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {productData?.data?.product?.whats_included || productData?.product?.whats_included || productData?.whats_included || "Standard premium nursery packaging included."}
                  </p>
                </div>
             </div>
          </motion.div>
        );
      case "video":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <LightVideo url={video} />
          </motion.div>
        );
      case "reviews":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-reviews-content">
            <RatingsAndReviews
              product_Rating={ratingData}
              total_Rating={reviewData}
              productId={productData?.data?.product?.id || productData?.product?.id}
              onWriteReview={onWriteReview}
              productDetailData={productData}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      {/* Sub-Tabs */}
      <div className="flex border-b border-gray-100 mb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: 'about', label: 'Description' },
          { id: 'bundle', label: 'Bundle & Save', show: addOnData.length > 0 },
          { id: 'care', label: 'Care Guide' },
          { id: 'box', label: "What's Included" },
          { id: 'video', label: 'Watch Video' },
          { id: 'reviews', label: `Reviews (${ratingData?.num_ratings || reviewData?.length || 0})` }
        ].filter(t => t.show !== false).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 md:px-6 py-3 text-[13px] font-bold whitespace-nowrap transition-all relative
              ${activeTab === tab.id ? 'text-bio-green' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="aboutSubTab" 
                className="absolute bottom-0 left-0 right-0 h-1 bg-bio-green rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="px-4">{renderContent()}</div>
    </div>
  );
};

export default AboutProduct;
