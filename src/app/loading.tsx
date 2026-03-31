import React from 'react';
import PageSkeleton from '../components/Shared/PageSkeleton';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white">
      <PageSkeleton />
    </div>
  );
}
