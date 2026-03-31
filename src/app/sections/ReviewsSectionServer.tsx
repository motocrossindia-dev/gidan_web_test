import React from 'react';
import GlobalReviews from '@/components/Home/GlobalReviews';

async function getGlobalReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/globalReviews/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.error("Failed to fetch global reviews", err);
    return null;
  }
}

export default async function ReviewsSectionServer() {
  const initialGlobalReviews = await getGlobalReviews();

  return (
    <div className="mt-8">
      <GlobalReviews initialGlobalReviews={initialGlobalReviews} />
    </div>
  );
}
