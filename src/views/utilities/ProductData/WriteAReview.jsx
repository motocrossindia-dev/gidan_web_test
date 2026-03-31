import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../Axios/axiosInstance';
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Check, ArrowLeft, Send, Sparkles } from "lucide-react";

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
        enqueueSnackbar(hasExistingReview ? 'Quality Registry updated!' : 'Quality Registry submitted!', { variant: 'success' });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      let errorMsg = error.response?.data?.message || "Protocol Failure. Please try again.";
      setSubmissionError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExisting) {
    return (
      <div className={isInline ? "w-full p-12 text-center" : "fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"}>
        <div className="p-12 rounded-[32px] bg-white shadow-2xl flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#375421]/10 border-t-[#375421] rounded-full animate-spin mb-6" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Cultivating Registry</p>
        </div>
      </div>
    );
  }

  const containerClasses = isInline
    ? "w-full bg-white border border-gray-100 rounded-[32px] p-6 mt-4 shadow-sm"
    : "bg-white p-6 sm:p-10 rounded-[30px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] w-11/12 max-w-lg overflow-y-auto max-h-[85vh] relative z-20";

  const wrapperClasses = isInline
    ? "font-sans"
    : "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] font-sans px-4";

  return (
    <div id={isInline ? "" : "modal-overlay"} className={wrapperClasses}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={containerClasses}
      >
        {/* Boutique Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {!isInline && (
                <button onClick={onClose} className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90">
                <ArrowLeft className="w-3.5 h-3.5 text-gray-400" />
                </button>
            )}
            <div>
                <span className="text-[8px] font-black text-[#375421] uppercase tracking-[0.3em] block mb-1">Quality Protocol</span>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                {isEditing ? 'Update Review' : 'Write a Review'}
                </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notice */}
        {hasExistingReview && (
          <div className="mb-6 p-3 bg-site-bg border border-[#375421]/10 rounded-2xl flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#375421] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-[#375421] text-[9px] font-black uppercase tracking-widest leading-normal flex-1">
              Registry verified. Synchronize updated attributes.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Star Selection */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Quality Rating*</label>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`transition-all duration-300 ${ (hoverRating || rating) >= star ? 'text-[#375421]' : 'text-gray-200 hover:text-gray-300'}`}
                    >
                        <Star className={`w-7 h-7 ${ (hoverRating || rating) >= star ? 'fill-current' : ''}`} strokeWidth={1.5} />
                    </motion.button>
                ))}
                </div>
                <div className="text-[10px] font-black text-[#375421] uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                    {rating || 0} / 5
                </div>
            </div>
          </div>

          {/* Title Input */}
          <div className="group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#375421]" htmlFor="review-title">
              {hasExistingReview ? 'Update Title*' : 'Review Title*'}
            </label>
            <input
              id="review-title"
              type="text"
              maxLength="50"
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] outline-none transition-all placeholder:text-gray-300"
              placeholder="Primary experience summary..."
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
            />
          </div>

          {/* Comment Input */}
          <div className="group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#375421]" htmlFor="comment">
              {hasExistingReview ? 'Update Attributes*' : 'Quality Attributes*'}
            </label>
            <textarea
              id="comment"
              maxLength="300"
              rows="5"
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] outline-none transition-all placeholder:text-gray-300 resize-none"
              placeholder="Describe your botanical journey with this selection..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-2 ml-1">{comment.length} / 300 characters</p>
          </div>

          {/* Recommendation Toggle */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Botanical Recommendation*</label>
            <div className="flex gap-3">
               <button 
                 onClick={() => setRecommend('yes')}
                 className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2.5 active:scale-95
                   ${recommend === 'yes' 
                     ? 'bg-[#375421] border-[#375421] text-white shadow-lg shadow-[#375421]/20' 
                     : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
               >
                 <Sparkles className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Highly Advise</span>
               </button>
               <button 
                 onClick={() => setRecommend('no')}
                 className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2.5 active:scale-95
                   ${recommend === 'no' 
                     ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100' 
                     : 'bg-white border-gray-100 text-gray-400 hover:border-red-100/50'}`}
               >
                 <X className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Not Advised</span>
               </button>
            </div>
          </div>

          {submissionError && (
            <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Protocol Synchronization Failed: {submissionError}
            </motion.div>
          )}

          {/* Boutique Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={onClose}
              className="flex-1 h-14 text-gray-300 hover:text-gray-900 text-[11px] font-black uppercase tracking-[0.2em] transition-colors bg-white sm:bg-transparent"
            >
              Protocol Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !reviewTitle || !comment || isSubmitting}
              className="flex-1 h-14 bg-[#375421] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none shadow-xl shadow-[#375421]/15 transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synchronizing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {hasExistingReview ? 'Update Registry' : 'Commit Registry'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WriteAReview;
