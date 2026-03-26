'use client';

import React, { useEffect, useState } from "react";
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

const AboutProduct = ({ productDetailData }) => {
  const hasInitialData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
  const [activeTab, setActiveTab] = useState("about"); // 'about', 'box', or 'video'
  const [video, setVideo] = useState(hasInitialData ? (productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "") : "");
  const [productData, setProductData] = useState(hasInitialData ? productDetailData : {});

  useEffect(() => {
    // Check if it's a valid data object, not just an empty array
    const hasData = productDetailData && (productDetailData.data || productDetailData.product || productDetailData.id);
    if (hasData) {
      setProductData(productDetailData);
      setVideo(productDetailData?.data?.product?.vedio_link || productDetailData?.product?.vedio_link || "");
    }
  }, [productDetailData]);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div>
            <div className="text-gray-600 leading-7 justify-center text-between md:text-md whitespace-pre-line">
              {productData?.data?.product?.short_description || productData?.product?.short_description || productData?.short_description || ""}
            </div>
          </div>
        );
      case "box":
        return (
          <div>
            <div className="text-gray-600 leading-7 justify-center text-between whitespace-pre-line">
              {productData?.data?.product?.whats_included || productData?.product?.whats_included || productData?.whats_included || ""}
            </div>
          </div>
        );
      case "video":
        return (
          <div className="rounded-lg overflow-hidden">
            <LightVideo url={video} />
          </div>
        );
      default:
        return null;
    }
  };

  const getTabStyle = (tabName) => {
    return `relative w-full text-left p-4 border-b border-gray-200 transition-colors
      ${activeTab === tabName ? "text-lime-600 font-medium bg-site-bg" : "text-gray-600 hover:bg-site-bg"}`;
  };

  const getGreenLine = (tabName) => {
    if (activeTab === tabName) {
      return <div className="absolute left-0 top-0 h-full w-1 bg-lime-500" />;
    }
    return null;
  };

  return (

    <div className="w-full bg-white flex flex-col md:flex-row md:px-16 md:text-xl">
      {/* Navigation Tabs */}
      <div className="w-full flex flex-row md:w-48 md:flex-col text-xs md:text-lg border border-gray-200">
        <button
          className={`flex-1 ${getTabStyle("about")}`}
          onClick={() => setActiveTab("about")}
        >
          {getGreenLine("about")}
          About the product
        </button>
        <button
          className={`flex-1 ${getTabStyle("box")}`}
          onClick={() => setActiveTab("box")}
        >
          {getGreenLine("box")}
          What's in the Box
        </button>
        <button
          className={`flex-1 ${getTabStyle("video")}`}
          onClick={() => setActiveTab("video")}
        >
          {getGreenLine("video")}
          Video
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 border border-gray-200 border-l-0">{renderContent()}</div>
    </div>

  );
};

export default AboutProduct;
