'use client';

import { useParams } from 'next/navigation';
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

export default function CategoryPage() {
  const params = useParams();
  return <PlantFilter />;
}
