'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../Axios/axiosInstance';

const WriteAReview = ({ onClose, productId }) => {
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
    if (rating === 0) {
      enqueueSnackbar('Please select a rating before submitting.');
      return;
    }

    const reviewData = {
      product_rating: rating, // Ensuring rating is sent as an integer
      product_review: comment,
      review_title: reviewTitle,
      recommend: recommend === 'yes' ? true : false, // Convert to boolean
      main_product_id: productId,
    };

    try {
      const response = await axiosInstance.post(
        `/product/ratingAndReviews/${productId}/`,
        reviewData,

      );
      if (response.status === 200) {
      enqueueSnackbar('Review submitted successfully!');
      onClose();
      }

    } catch (error) {
      console.error('Error submitting review:', error.response.data.message);
      enqueueSnackbar(error.response.data.message ||'Please Login ...',{variant:'info'});
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 md:mt-16 "
    >
      <div className="max-w-2xl w-full border border-gray-300 shadow-lg md:rounded-md p-3  bg-white">
        {/* Back Button */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(-1)}>
          <ArrowBack className="text-bio-green" />
          <span className="text-bio-green font-medium"></span>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center">Ratings & Reviews</h2>

        <div className="flex items-center gap-4">
          <img name=" "   
            src="https://via.placeholder.com/80"
            loading="lazy"
            alt="Peace Lily Plant"
            className="w-20 h-20 rounded"
          />
          <div>
            <h3 className="text-lg font-medium">Peace Lily Plant</h3>
            <p className="text-gray-500 text-sm">2ft / 2ft-GroPot / Ivory</p>
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
