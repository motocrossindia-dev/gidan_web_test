'use client';

import { useParams } from 'next/navigation';
import CarouselData from '@/views/utilities/CarouselData/CarouselData';

export default function CarouselPage() {
  const params = useParams();
  return <CarouselData />;
}
