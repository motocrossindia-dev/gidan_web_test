import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy"; // Lazy load only needed players instead of all 13+

const AboutProduct = ({ productDetailData }) => {
  const [activeTab, setActiveTab] = useState("about"); // 'about', 'box', or 'video'
  const [video, setVideo] = useState("");
  const [productData, setProductData] = useState({});

  useEffect(() => {
    if (productDetailData) {
      setProductData(productDetailData);
      setVideo(productDetailData?.data?.product?.vedio_link || "");
    }
  }, [productDetailData]);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div>
          <div className="text-gray-600 leading-7 justify-center text-between md:text-md whitespace-pre-line">
            {productData?.data?.product?.short_description || ""}
          </div>
          </div>
        );
      case "box":
        return (
          <div>
          <div className="text-gray-600 leading-7 justify-center text-between whitespace-pre-line">
            {productData?.data?.product?.whats_included || ""}
          </div>
          </div>
        );
      case "video":
        return (
          <div className="rounded-lg overflow-hidden">
            <ReactPlayer url={video} controls width="100%" />
          </div>
        );
      default:
        return null;
    }
  };

  const getTabStyle = (tabName) => {
    return `relative w-full text-left p-4 border-b border-gray-200 transition-colors
      ${activeTab === tabName ? "text-lime-600 font-medium bg-gray-100" : "text-gray-600 hover:bg-gray-50"}`;
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
