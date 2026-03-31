import React from 'react';
import Skeleton from './Skeleton';

const PageSkeleton: React.FC = () => {
    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12 py-8 animate-pulse">
            {/* 1. Hero Banner Skeleton */}
            <div className="w-full aspect-[21/9] rounded-[40px] overflow-hidden bg-gray-100 relative">
                <Skeleton className="w-full h-full rounded-[40px]" />
                <div className="absolute inset-0 flex flex-col justify-center px-12 space-y-6">
                    <Skeleton className="w-[300px] h-12" />
                    <Skeleton className="w-[450px] h-6" />
                    <Skeleton className="w-[150px] h-10 rounded-full" />
                </div>
            </div>

            {/* 2. Category Icons Skeleton */}
            <div className="flex justify-between items-center px-4 overflow-x-hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col items-center space-y-3">
                        <Skeleton className="w-16 h-16 md:w-24 md:h-24 rounded-full" />
                        <Skeleton className="w-16 h-4" />
                    </div>
                ))}
            </div>

            {/* 3. Section Title */}
            <div className="space-y-3">
                <Skeleton className="w-[200px] h-10" />
                <Skeleton className="w-[400px] h-4" />
            </div>

            {/* 4. Product Grid Skeleton (2x2 or 4x1) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-4 p-4 border border-gray-100 rounded-[32px]">
                        <Skeleton className="w-full aspect-square rounded-[24px]" />
                        <div className="space-y-2">
                            <Skeleton className="w-1/2 h-4" />
                            <Skeleton className="w-full h-6" />
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="w-1/3 h-6" />
                                <Skeleton className="w-10 h-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 5. Second Hero Section */}
            <div className="flex flex-col lg:flex-row gap-12 items-center py-12">
                <Skeleton className="w-full lg:w-1/2 aspect-[4/3] rounded-[40px]" />
                <div className="w-full lg:w-1/2 space-y-6">
                    <Skeleton className="w-3/4 h-12" />
                    <Skeleton className="w-full h-24" />
                    <Skeleton className="w-[180px] h-12 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default PageSkeleton;
