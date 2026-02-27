'use client';

import React, { useState } from "react";
import { Star } from "lucide-react";
import { FaStarHalfAlt, FaStar } from "react-icons/fa";
import WriteAReview from "./WriteAReview";

const RatingsAndReviews = ({ product_Rating, total_Rating, productId, onWriteReview, productDetailData }) => {
  const reviews = total_Rating || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle case where product_Rating might be missing or empty
  const hasValidRatingSummary = product_Rating && (
    (product_Rating.num_ratings && Number(product_Rating.num_ratings) > 0) ||
    (product_Rating.avg_rating && Number(product_Rating.avg_rating) > 0)
  );

  const num_ratings = hasValidRatingSummary ? Number(product_Rating.num_ratings) : reviews.length;

  // Robust average calculation
  let avg_rating = 0;
  if (hasValidRatingSummary) {
    avg_rating = Number(product_Rating.avg_rating) || 0;
  } else if (reviews.length > 0) {
    const total = reviews.reduce((acc, curr) => acc + (Number(curr.latest_rating) || Number(curr.product_rating) || 0), 0);
    avg_rating = total / reviews.length;
  }

  // Robust stars_given breakdown
  let stars_given = [];
  const starLevels = [5, 4, 3, 2, 1];

  if (hasValidRatingSummary && product_Rating.stars_given && product_Rating.stars_given.length > 0) {
    const countsMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product_Rating.stars_given.forEach(item => {
      const star = Math.round(item.stars || item.rounded_rating);
      if (star >= 1 && star <= 5) {
        countsMap[star] = Number(item.count) || 0;
      }
    });

    stars_given = starLevels.map(star => ({
      stars: star,
      count: countsMap[star],
      percentage: num_ratings > 0 ? Math.round((countsMap[star] / num_ratings) * 100) : 0
    }));
  } else {
    stars_given = starLevels.map(star => {
      const count = reviews.filter(r => Math.round(Number(r.latest_rating) || Number(r.product_rating) || 0) === star).length;
      return {
        stars: star,
        count: count,
        percentage: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
      };
    });
  }

  const renderStars = (rating, size = "w-5 h-5") => {
    return Array.from({ length: 5 }).map((_, i) => {
      const filled = Math.floor(rating);
      const half = rating - filled;

      if (i < filled) {
        return <FaStar key={i} className={`text-orange-500 ${size}`} />;
      }
      if (i === filled && half >= 0.5) {
        return <FaStarHalfAlt key={i} className={`text-orange-500 ${size}`} />;
      }
      return <FaStar key={i} className={`text-gray-300 ${size}`} />;
    });
  };

  return (
    <div id="reviews" className="max-w-7xl mx-auto p-4 md:p-10 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column: Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer reviews</h2>

          <div className="flex items-center gap-3">
            <div className="flex">
              {renderStars(avg_rating, "w-6 h-6")}
            </div>
            <span className="text-xl font-bold text-gray-900">{avg_rating.toFixed(1)} out of 5</span>
          </div>

          <p className="text-gray-500 text-sm">{num_ratings} global ratings</p>

          <div className="space-y-3 pt-4">
            {stars_given.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 group cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:underline min-w-[50px]">
                  {item.stars} star
                </span>
                <div className="flex-1 bg-gray-100 rounded-sm h-6 overflow-hidden border">
                  <div
                    className="bg-orange-500 h-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-blue-600 min-w-[35px] text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-bold mb-2">Review this product</h3>
            <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
            <button
              onClick={onWriteReview || (() => setIsModalOpen(true))}
              className="w-full bg-white border border-gray-300 shadow-sm rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-all text-gray-800"
            >
              Write a customer review
            </button>
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-2 space-y-8">

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Top reviews</h3>
              <select className="bg-gray-50 border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>Top reviews</option>
                <option>Most recent</option>
              </select>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-10">
                {reviews.map((review, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {review.user_name?.charAt(0) || "C"}
                      </div>
                      <span className="text-sm font-medium">{review.user_name || "Verified Customer"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(review.latest_rating || review.product_rating || 0, "w-4 h-4")}
                      </div>
                      <span className="font-bold text-sm text-gray-900">{review.review_title}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Reviewed in India on {review.date_created || new Date(review.created_at).toLocaleDateString()}
                    </p>

                    <span className="inline-block bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-100 uppercase tracking-tight">Verified Purchase</span>

                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {review.product_review}
                    </p>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-bold text-gray-900">No reviews yet</p>
                <p className="text-gray-500">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write a Review Modal (Legacy fallback) */}
      {isModalOpen && !onWriteReview && (
        <WriteAReview
          onClose={() => setIsModalOpen(false)}
          productId={productId}
          productDetailData={productDetailData}
        />
      )}
    </div>
  );
};

export default RatingsAndReviews;