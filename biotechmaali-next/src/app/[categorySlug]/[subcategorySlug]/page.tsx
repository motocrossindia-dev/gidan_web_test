'use client';

import { useParams } from 'next/navigation';
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

export default function SubcategoryPage() {
  const params = useParams();
  return <PlantFilter />;
}
