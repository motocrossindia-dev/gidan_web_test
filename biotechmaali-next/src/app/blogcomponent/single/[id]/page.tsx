'use client';

import { useParams } from 'next/navigation';
import SingleBlog from '@/views/utilities/Blog/SingleBlog';

export default function SingleBlogPage() {
  const params = useParams();
  return <SingleBlog />;
}
