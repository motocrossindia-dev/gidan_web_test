import StoreDetail from '@/views/Stores/StoreDetail';

export default async function StoreDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoreDetail slug={slug} />;
}
