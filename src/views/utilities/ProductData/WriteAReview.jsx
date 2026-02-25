'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../Axios/axiosInstance';

const WriteAReview = ({ onClose, productId, productDetailData }) => {
  const product = productDetailData?.data?.product;
  const imageThumbnails = productDetailData?.data?.image_thumbnails || [];
  const productImage = imageThumbnails[0]?.image || "https://via.placeholder.com/80";
  const productName = product?.main_product_name || product?.name || "Product";

  // Extract variant details if available (e.g. size/weight/color)
  const variantDetails = [
    productDetailData?.data?.product_weights?.find(w => w.isSelected)?.size_grams,
    productDetailData?.data?.product_sizes?.find(s => s.isSelected)?.size,
    productDetailData?.data?.product_colors?.find(c => c.isSelected)?.color_name
  ].filter(Boolean).join(" / ");

  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState('yes');
  const router = useRouter();

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'modal-overlay') {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

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

  if (!productDetailData || !product) {
    return (
      <div id="modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 font-sans">
        <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product information...</p>
          <button onClick={onClose} className="mt-4 text-green-700 font-medium">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div id="modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md overflow-y-auto max-h-[90vh]">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
            <ArrowBack className="text-gray-700" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
        </div>

        <div className="flex items-center gap-4">
          <img name=" "
            src={productImage}
            loading="lazy"
            alt={productName}
            className="w-20 h-20 rounded object-cover"
          />
          <div>
            <h3 className="text-lg font-medium">{productName}</h3>
            {variantDetails && <p className="text-gray-500 text-sm">{variantDetails}</p>}
          </div>
        </div>

        <div className="mt-2">
          <p className="font-medium ">Please give rating*</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <label className="font-medium block " htmlFor="review-title">
            Review Title*
          </label>
          <input
            id="review-title"
            type="text"
            maxLength="50"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Max 50 Characters"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="font-medium block " htmlFor="comment">
            Comment*
          </label>
          <textarea
            id="comment"
            maxLength="300"
            rows="4"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Max 300 Characters"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-4">
          <p className="font-medium mb-2">Will you recommend this product?*</p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="recommend"
                value="yes"
                checked={recommend === 'yes'}
                onChange={() => setRecommend('yes')}
                className="accent-bio-green"
              />
              <span className="text-bio-green font-medium">YES</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="recommend"
                value="no"
                checked={recommend === 'no'}
                onChange={() => setRecommend('no')}
                className="accent-gray-600"
              />
              <span className="text-gray-600 font-medium">No</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="border border-bio-green text-bio-green font-medium px-8 py-2 rounded-md hover:bg-green-50"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="bg-bio-green text-white font-medium px-8 py-2 rounded-md hover:bg-green-700"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteAReview;
