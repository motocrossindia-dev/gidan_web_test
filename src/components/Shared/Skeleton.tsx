import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
    >
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
        style={{
          animation: 'shimmer 2s infinite linear',
          backgroundSize: '200% 100%'
        }}
      />
    </div>
  );
};

export default Skeleton;
