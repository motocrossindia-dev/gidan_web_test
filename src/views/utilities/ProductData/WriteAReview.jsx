'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../Axios/axiosInstance';

const WriteAReview = ({ onClose, productId, productDetailData, isInline = false }) => {
  const product = productDetailData?.data?.product || productDetailData?.product || productDetailData;


  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState('yes');
  const router = useRouter();

  // Close modal when clicking outside (only if not inline)
  useEffect(() => {
    if (isInline) return;
    const handleOutsideClick = (event) => {
      if (event.target.id === 'modal-overlay') {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose, isInline]);

  // Submit review function
  const handleSubmit = async () => {
    if (!productId || isNaN(productId)) {
      enqueueSnackbar('Invalid product ID. Please refresh the page.', { variant: 'error' });
      return;
    }

    if (rating === 0) {
      enqueueSnackbar('Please select a rating before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('product_rating', rating);
    formData.append('product_review', comment);
    formData.append('review_title', reviewTitle);
    formData.append('recommend', recommend === 'yes' ? 'true' : 'false');
    formData.append('main_product_id', productId);

    try {
      const response = await axiosInstance.post(
        `/product/ratingAndReviews/${productId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        enqueueSnackbar('Review submitted successfully!');
        onClose();
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit review. Please try again or login.';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  if (!product) {
    return (
      <div className={isInline ? "w-full p-4 border rounded-xl mt-4" : "fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 font-sans"}>
        <div className={isInline ? "" : "bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md text-center"}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product information...</p>
          <button onClick={onClose} className="mt-4 text-green-700 font-medium">Cancel</button>
        </div>
      </div>
    );
  }

  const containerClasses = isInline
    ? "w-full bg-white border border-gray-100 rounded-2xl p-6 mt-4 shadow-sm"
    : "bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md overflow-y-auto max-h-[90vh]";

  const wrapperClasses = isInline
    ? "font-sans"
    : "fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 font-sans";

  return (
    <div id={isInline ? "" : "modal-overlay"} className={wrapperClasses}>
      <div className={containerClasses}>
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
            <ArrowBack className="text-gray-700" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
        </div>



        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">Please give rating*</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-4xl transition-all ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-gray-400'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700 block mb-2" htmlFor="review-title">
            Review Title*
          </label>
          <input
            id="review-title"
            type="text"
            maxLength="50"
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="Summarize your experience (max 50 chars)"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700 block mb-2" htmlFor="comment">
            Comment*
          </label>
          <textarea
            id="comment"
            maxLength="300"
            rows="4"
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="Tell us what you liked or disliked (max 300 chars)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">Will you recommend this product?*</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="recommend"
                value="yes"
                checked={recommend === 'yes'}
                onChange={() => setRecommend('yes')}
                className="w-4 h-4 accent-green-600"
              />
              <span className={`font-medium ${recommend === 'yes' ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'}`}>YES</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="recommend"
                value="no"
                checked={recommend === 'no'}
                onChange={() => setRecommend('no')}
                className="w-4 h-4 accent-red-600"
              />
              <span className={`font-medium ${recommend === 'no' ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`}>No</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !reviewTitle || !comment}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-100 transition-all"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteAReview;
