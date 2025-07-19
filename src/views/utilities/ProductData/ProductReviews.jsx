import React, { useState } from "react";
import { Star } from "lucide-react";
import { FaStarHalfAlt, FaStar } from "react-icons/fa";
import WriteAReview from "./WriteAReview";

function RatingsAndReviews({ product_Rating, total_Rating, productId }) {
  const {
    avg_rating = 0,
    num_ratings = 0,
    stars_given = [],
  } = product_Rating || {};
  
  const totalReviewsIncludingAll = stars_given.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Pagination = ({
    totalPages = 10,
    currentPage = 1,
    onPageChange = () => {},
  }) => {
    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center font-sans gap-2 mt-6">
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 hover:bg-gray-50"
            } ${page === "..." ? "cursor-default hover:bg-white" : ""}`}
            onClick={() => (page !== "..." ? onPageChange(page) : null)}
          >
            {page}
          </button>
        ))}
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const filled = Math.floor(rating);
      const half = rating - filled;
      
      if (i < filled) {
        return <FaStar key={i} className="text-blue-900 w-5 h-5" />;
      }
      if (i === filled && half >= 0.5) {
        return <FaStarHalfAlt key={i} className="text-blue-900 w-5 h-5" />;
      }
      return <FaStar key={i} className="text-gray-300 w-5 h-5" />;
    });
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 px-4 md:px-20 md:mt-10">
      {/* Header Section */}
      <div className="flex flex-col justify-between mb-6 gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl md:text-3xl  text-gray-800">
          Ratings 
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white border-2 text-green-700 font-medium border-green-600 rounded-lg px-6 py-3 hover:bg-green-50 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Main Rating Display */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Overall Rating */}
          <div className="w-[9-rem]">
            <div className="text-center md:text-left">
              <div className="text-3xl  text-gray-900 mb-2">
                {avg_rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start mb-2">
                {renderStars(avg_rating)}
              </div>
              <div className="text-sm text-gray-600">
                Based on {num_ratings} {num_ratings === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="w-[300px]">
            {stars_given.length > 0 ? (
              <div className="space-y-3">
                {stars_given
                  .sort((a, b) => b.stars - a.stars)
                  .map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium text-gray-700">
                          {item.stars}
                        </span>
                        <FaStar className="text-blue-900 w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 bg-gray-300 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              totalReviewsIncludingAll > 0
                                ? (item.count / totalReviewsIncludingAll) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      
                      <div className="w-12 text-sm font-medium text-gray-700 text-right">
                        {item.count}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No rating  yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List would go here */}
      {/* Modal */}
      {isModalOpen && (
        <WriteAReview
          onClose={() => setIsModalOpen(false)}
          productId={productId}
        />
      )}
    </div>
  );
}

export default RatingsAndReviews;