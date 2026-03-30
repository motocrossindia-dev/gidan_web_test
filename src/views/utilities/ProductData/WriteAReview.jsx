import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../Axios/axiosInstance';
import { motion, AnimatePresence } from "framer-motion";

const WriteAReview = ({ onClose, onSuccess, productId, productDetailData, isInline = false }) => {
  const product = productDetailData?.data?.product || productDetailData?.product || productDetailData;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState('yes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isInline) return;
    const handleOutsideClick = (event) => {
      if (event.target.id === 'modal-overlay') onClose();
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose, isInline]);

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!productId) {
        setIsLoadingExisting(false);
        return;
      }
      
      try {
        const response = await axiosInstance.get(`/product/ratingAndReviews/${productId}/`);
        const reviewData = response.data?.data || response.data;
        
        const userReview = reviewData?.user_review || 
                          reviewData?.current_user_review ||
                          reviewData?.reviews?.find(review => review.is_current_user) ||
                          (reviewData?.has_user_review ? reviewData : null);

        if (userReview && (userReview.product_rating || userReview.rating)) {
          setRating(Number(userReview.product_rating || userReview.rating) || 0);
          setReviewTitle(userReview.review_title || userReview.title || '');
          setComment(userReview.product_review || userReview.comment || userReview.review || '');
          setRecommend(userReview.recommend === true || userReview.recommend === 'true' ? 'yes' : 'no');
          setIsEditing(true);
          setHasExistingReview(true);
        }
      } catch (error) {
        if (error?.response?.status !== 404) console.error("Error fetching existing review:", error);
      } finally {
        setIsLoadingExisting(false);
      }
    };
    fetchExistingReview();
  }, [productId]);

  const handleSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);
    
    if (rating === 0) {
      enqueueSnackbar('Please select a rating before submitting.', { variant: 'warning' });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('product_rating', rating);
    formData.append('product_review', comment);
    formData.append('review_title', reviewTitle);
    formData.append('recommend', recommend === 'yes' ? 'true' : 'false');
    formData.append('main_product_id', productId);

    try {
      const response = await axiosInstance.post(`/product/ratingAndReviews/${productId}/`, formData);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(hasExistingReview ? 'Review updated successfully!' : 'Review submitted successfully!', { variant: 'success' });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      let errorMsg = error.response?.data?.message || "Failed to submit review. Please try again.";
      setSubmissionError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExisting) {
    return (
      <div className={isInline ? "w-full p-12 text-center" : "fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"}>
        <div className="pdp-wrapper p-8 rounded-3xl bg-white shadow-xl">
          <div className="w-12 h-12 border-4 border-bio-green/20 border-t-bio-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-500">Cultivating your review...</p>
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
          <button onClick={onClose} className="hover:bg-site-bg p-1 rounded-full transition-colors">
            <ArrowBack className="text-gray-700" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit your review' : 'Write a Review'}
          </h2>
        </div>

        {/* Show existing review notice */}
        {hasExistingReview && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-[#051d18] text-sm font-medium">
              ✓ You have already reviewed this product. You can edit your review below.
            </p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">
            {hasExistingReview ? 'Update your rating*' : 'Please give rating*'}
          </p>
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
            {hasExistingReview ? 'Update Review Title*' : 'Review Title*'}
          </label>
          <input
            id="review-title"
            type="text"
            maxLength="50"
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#375421] outline-none transition-all"
            placeholder="Summarize your experience (max 50 chars)"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold text-gray-700 block mb-2" htmlFor="comment">
            {hasExistingReview ? 'Update Comment*' : 'Comment*'}
          </label>
          <textarea
            id="comment"
            maxLength="300"
            rows="4"
            className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#375421] outline-none transition-all"
            placeholder="Tell us what you liked or disliked (max 300 chars)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">
            {hasExistingReview ? 'Update recommendation*' : 'Will you recommend this product?*'}
          </p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="recommend"
                value="yes"
                checked={recommend === 'yes'}
                onChange={() => setRecommend('yes')}
                className="w-4 h-4 accent-[#375421]"
              />
              <span className={`font-medium ${recommend === 'yes' ? 'text-[#375421]' : 'text-gray-500 group-hover:text-gray-700'}`}>YES</span>
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

          {submissionError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <span className="font-bold">Error:</span> {submissionError}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-site-bg transition-all"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !reviewTitle || !comment || isSubmitting}
              className="flex-1 bg-[#375421] text-white font-bold py-3 rounded-xl hover:bg-[#375421] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  SUBMITTING...
                </>
              ) : (
                hasExistingReview ? 'UPDATE REVIEW' : 'SUBMIT REVIEW'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WriteAReview;
