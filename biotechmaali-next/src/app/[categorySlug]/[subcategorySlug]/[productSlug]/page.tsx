'use client';

import { useParams } from 'next/navigation';
import ProductData from '@/views/utilities/ProductData/ProductData';

export default function ProductPage() {
  const params = useParams();
  return <ProductData />;
}
