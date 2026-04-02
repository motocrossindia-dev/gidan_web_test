'use client';

import React from 'react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    isLoading = false,
    loadingPage = null 
}) => {
    if (totalPages <= 1) return null;

    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return (
        <div className="flex flex-col items-center gap-8 mt-4 mb-4 w-full">
            <div className="flex items-center gap-1.5 md:gap-2">
                {/* Previous Button - Amazon Style */}
                <button
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1, true)}
                    disabled={currentPage === 1 || isLoading}
                    className={`h-9 px-3 md:px-4 flex items-center gap-2 rounded-md border text-sm font-bold transition-all duration-200 ${
                        currentPage === 1 || isLoading
                        ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50/50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                    }`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5 md:gap-2 mx-1">
                    {pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && onPageChange(page, false)}
                            disabled={page === '...' || page === currentPage || isLoading}
                            className={`h-9 min-w-[36px] md:min-w-[40px] flex items-center justify-center rounded-md border text-sm font-bold transition-all duration-200 ${
                                page === currentPage
                                ? "bg-[#375421] text-white border-[#375421] shadow-sm"
                                : page === '...'
                                    ? "border-transparent text-gray-400 cursor-default"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                        >
                            {isLoading && loadingPage === page ? (
                                <div className={`w-3.5 h-3.5 border-2 ${page === currentPage ? 'border-white' : 'border-[#375421]'} border-t-transparent rounded-full animate-spin`}></div>
                            ) : (
                                page
                            )}
                        </button>
                    ))}
                </div>

                {/* Next Button - Amazon Style */}
                <button
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1, true)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`h-9 px-3 md:px-4 flex items-center gap-2 rounded-md border text-sm font-bold transition-all duration-200 ${
                        currentPage === totalPages || isLoading
                        ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50/50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                    }`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
