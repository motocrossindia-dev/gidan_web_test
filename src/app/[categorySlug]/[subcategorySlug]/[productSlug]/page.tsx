import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductData from '@/views/utilities/ProductData/ProductData';
import { fetchProductDetail } from "@/utils/serverApi";
import ProductSchema from "@/views/utilities/seo/ProductSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";

type Props = {
  params: Promise<{ categorySlug: string; subcategorySlug: string; productSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Use React cache to deduplicate fetches between generateMetadata and ProductPage
const getCachedProductDetail = cache(async (productSlug: string, searchParams: any) => {
  return await fetchProductDetail(productSlug, searchParams);
});

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug, productSlug } = await params;
  const sParams = await searchParams;

  const productData = await getCachedProductDetail(productSlug, sParams);
  if (!productData || !productData.data || !productData.data.product) {
    return {
      title: 'Product Not Found | Gidan Plants',
      description: 'The requested product could not be found.'
    };
  }

  const product = productData.data.product;
  const slugName = product.slug ? product.slug.split('-').map((w: any) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : productSlug;
  const productName = product.name || slugName;
  const description = product.meta_description || product.description || `Buy ${productName} online at Gidan Plants.`;
  const title = product.meta_title || `Buy ${productName} Online | Gidan Plants`;

  // Use product images for OG if available
  const ogImages = product.images?.length
    ? product.images.map((img: any) => ({ url: img.image || img.url }))
    : [];

  const canonicalPath = `/${categorySlug}/${subcategorySlug}/${productSlug}/`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: ogImages,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: canonicalPath },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { productSlug } = await params;
  const sParams = await searchParams;

  const productData = await getCachedProductDetail(productSlug, sParams);
  if (!productData) notFound();

  const product = productData?.data?.product;
  const ratingData = productData?.data?.product_rating || productData?.product_rating || product?.product_rating || { avg_rating: 0, num_ratings: 0, stars_given: [] };
  const reviewData = productData?.data?.product_reviews || productData?.product_reviews || product?.product_reviews || [];

  return (
    <>
      <ProductSchema
        product={product}
        images={product?.images || []}
        rating={ratingData?.avg_rating || 0}
        ratingCount={ratingData?.num_ratings || 0}
        reviews={reviewData}
      />
      <StoreSchema />
      <ProductData initialProductData={productData} />
    </>
  );
}
