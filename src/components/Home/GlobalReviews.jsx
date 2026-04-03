'use client';

import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getProductUrl } from '@/utils/urlHelper';

export const GlobalReviews = ({ initialGlobalReviews }) => {
  if (!initialGlobalReviews || !initialGlobalReviews.reviews || initialGlobalReviews.reviews.length === 0) {
    return null;
  }

  const { avg_rating, total_reviews, reviews } = initialGlobalReviews;

  const shouldScroll = reviews.length >= 4;

  // Duplicate for seamless infinite marquee loop if we have enough items
  const displayReviews = shouldScroll
    ? [...reviews, ...reviews, ...reviews, ...reviews, ...reviews].slice(0, Math.max(12, reviews.length * 4))
    : reviews;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#faf9f6] to-[#f3fceb]/30 overflow-hidden relative">
      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); } 
        }
        .animate-scroll {
          /* Adjust timing dynamically based on content but cap minimum speed */
          animation: scroll-left 50s linear infinite;
        }
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f3fceb] text-[#375421] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#375421]/10 shadow-sm">
              Community
            </span>
            <h2 className="text-[32px] md:text-[42px] font-serif text-[#1a1f14] leading-tight flex items-baseline gap-2">
              Customer <span className="italic text-[#375421]">Love</span>
            </h2>
            <p className="text-[#1a1f14]/60 text-sm md:text-base font-medium mt-2 max-w-sm">
              Discover why over {total_reviews?.toLocaleString() || 0}+ plant parents trust Gidan for their green spaces.
            </p>
          </div>
          
          <div className="flex items-center gap-5 bg-white px-6 py-4 rounded-3xl shadow-sm border border-[#1a1f14]/5 animate-fade-in-up delay-100">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#1a1f14] leading-none mb-1">{avg_rating > 0 ? avg_rating.toFixed(1) : "5.0"}</span>
              <div className="flex text-yellow-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#1a1f14]/60 uppercase tracking-widest">Global Reviews</span>
              <span className="text-sm text-[#375421] font-black">{total_reviews?.toLocaleString() || 0} Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-scrolling marquee or static centered cards */}
      <div className="relative w-full overflow-hidden group pb-8">
        {/* Soft edge masks (only show if auto-sliding) */}
        {shouldScroll && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-r from-[#faf9f6] md:from-[#faf9f6] via-[#faf9f6]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-64 bg-gradient-to-l from-[#f3fceb]/30 via-transparent to-transparent md:from-[#faf9f6] md:via-[#faf9f6]/80 md:to-transparent z-10 pointer-events-none" />
          </>
        )}
        
        {/* Content container */}
        <div className={`flex gap-4 px-4 ${shouldScroll ? 'w-max animate-scroll' : 'justify-start md:justify-center overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full'}`}>
          {displayReviews.map((review, idx) => (
            <div 
              key={`${review.id}-${idx}`} 
              className={`w-[280px] md:w-[350px] shrink-0 bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-[#1a1f14]/5 block hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default flex flex-col h-full min-h-[180px] ${!shouldScroll && 'snap-center'}`}
            >
              <div className="flex justify-between items-start mb-4 gap-2 w-full">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#f3fceb] text-[#375421] flex items-center justify-center font-serif text-lg font-bold border border-[#375421]/10 shrink-0">
                    {review.user_initial || review.user_name?.[0] || 'G'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 mb-1 w-full">
                      <span className="text-sm font-bold text-[#1a1f14] leading-none truncate block">
                        {review.user_name || "Verified Buyer"}
                      </span>
                    </h3>
                    <p className="text-[10px] text-[#1a1f14]/40 font-semibold uppercase tracking-wider">{review.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex text-yellow-400 gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < (review.rating || 5) ? "currentColor" : "none"} strokeWidth={i < (review.rating || 5) ? 0 : 2} className={i >= (review.rating || 5) ? "text-gray-200" : ""} />
                    ))}
                  </div>
                  {review.recommend && (
                    <span className="flex items-center gap-0.5 bg-[#f3fceb] text-[#375421] px-1.5 py-[3px] rounded-full border border-[#375421]/20 text-[8px] uppercase tracking-widest font-black">
                      <CheckCircle2 size={8} strokeWidth={3} />
                      Recommends
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 grow flex flex-col justify-center">
                <h4 className="font-bold text-[#1a1f14] text-sm mb-1.5 line-clamp-1">{review.title}</h4>
                <p className="text-[13px] text-[#1a1f14]/70 line-clamp-3 leading-relaxed">
                  {review.review}
                </p>
              </div>

              {review.product_name && review.product_slug && (
                <div className="mt-auto pt-4 border-t border-dashed border-gray-100 pb-1">
                  <Link href={getProductUrl(review)} className="group/link flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1a1f14]/50 uppercase tracking-widest shrink-0">Purchased</span>
                    <span className="text-[11px] font-semibold text-[#375421] line-clamp-1 group-hover/link:underline">{review.product_name}</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalReviews;
