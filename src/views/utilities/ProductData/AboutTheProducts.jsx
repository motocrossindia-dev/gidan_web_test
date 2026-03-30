'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddOnProduct from "./AddOnProduct";
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
  const hasInitialData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
  const [activeTab, setActiveTab] = useState("about"); // 'about', 'bundle', 'care', 'box', or 'video'
  const [video, setVideo] = useState(hasInitialData ? (productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "") : "");
  const [productData, setProductData] = useState(hasInitialData ? productDetailData : {});
  const [careGuides, setCareGuides] = useState(productDetailData?.data?.care_guides || []);
  const [addOnData, setAddOnData] = useState(productDetailData?.data?.product_add_ons || []);

  useEffect(() => {
    // Check if it's a valid data object, not just an empty array
    const hasData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
    if (hasData) {
      setProductData(productDetailData);
      setVideo(productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "");
      setCareGuides(productDetailData?.data?.care_guides || []);
      setAddOnData(productDetailData?.data?.product_add_ons || []);
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
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pdp-bundle-content">
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-serif text-gray-900 mb-1">Frequently Bought Together</h3>
              <p className="text-xs text-gray-500 mb-6">Customers who bought this also added these items. Save ₹{Math.round((productData?.data?.product?.mrp || 0) + addOnData.reduce((acc, curr) => acc + (curr.mrp || 0), 0) - ((productData?.data?.product?.selling_price || 0) + addOnData.reduce((acc, curr) => acc + (curr.selling_price || 0), 0)))} as a bundle.</p>
              
              <div className="flex flex-wrap md:flex-nowrap items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {/* Main Product */}
                <div className="flex flex-col items-center min-w-[140px] p-3 bg-[#f3f6f1] rounded-xl border border-bio-green/20">
                  <div className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-white">
                    <img 
                      src={(() => {
                        const img = productData?.data?.product?.images?.[0];
                        const path = img?.image || img?.url || "";
                        return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${path}`;
                      })()} 
                      alt="" 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-gray-800 text-center line-clamp-1">
                    {productData?.data?.product?.name || productData?.product?.name || "Current Product"}
                  </p>
                  <p className="text-sm font-bold text-gray-900">₹{Math.round(productData?.data?.product?.selling_price || productData?.product?.selling_price || 0)}</p>
                </div>

                {/* Add-ons */}
                {addOnData.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    <div className="text-gray-400 text-sm font-light">+</div>
                    <div className="flex flex-col items-center min-w-[140px] p-3 bg-[#faf9f6] rounded-xl border border-gray-100">
                      <div className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-white">
                        <img 
                          src={item.image.startsWith("http") ? item.image : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${item.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-gray-800 text-center line-clamp-1">{item.name}</p>
                      <p className="text-sm font-bold text-gray-900">₹{Math.round(item.selling_price)}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Summary Bar */}
              <div className="mt-4 bg-[#f3f6f1] rounded-xl p-4 flex justify-between items-center border border-bio-green/5">
                <div>
                  <p className="text-sm font-medium text-gray-900">Total for {addOnData.length + 1} items</p>
                  <p className="text-[10px] text-gray-500">Includes free shipping on this bundle</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 line-through text-xs">₹{Math.round((productData?.data?.product?.mrp || 0) + addOnData.reduce((acc, curr) => acc + (curr.mrp || 0), 0))}</span>
                  <span className="text-xl font-serif text-gray-900">₹{Math.round((productData?.data?.product?.selling_price || 0) + addOnData.reduce((acc, curr) => acc + (curr.selling_price || 0), 0))}</span>
                  <div className="bg-[#ffe8e8] text-[#ff4d4d] px-2 py-0.5 rounded text-[10px] font-bold">
                    Save ₹{Math.round((productData?.data?.product?.mrp || 0) + addOnData.reduce((acc, curr) => acc + (curr.mrp || 0), 0) - ((productData?.data?.product?.selling_price || 0) + addOnData.reduce((acc, curr) => acc + (curr.selling_price || 0), 0)))}
                  </div>
                </div>
              </div>

              <button className="w-full mt-3 bg-[#2d4a22] hover:bg-[#1e3316] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-colors">
                <span>🛒</span> Add Bundle to Cart — Save ₹{Math.round((productData?.data?.product?.mrp || 0) + addOnData.reduce((acc, curr) => acc + (curr.mrp || 0), 0) - ((productData?.data?.product?.selling_price || 0) + addOnData.reduce((acc, curr) => acc + (curr.selling_price || 0), 0)))}
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
