import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductData from '@/views/utilities/ProductData/ProductData';

type Props = {
  params: Promise<{ categorySlug: string; subcategorySlug: string; productSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function isValidProduct(productSlug: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/defaultProduct/${encodeURIComponent(productSlug)}/`,
      { next: { revalidate: 3600 } }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug, productSlug } = await params;

  const valid = await isValidProduct(productSlug);
  if (!valid) return {};

  const productName = productSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const catName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const canonicalUrl = `https://www.gidan.store/${categorySlug}/${subcategorySlug}/${productSlug}/`;
  return {
    title: `Buy ${productName} Online | Gidan Plants`,
    description: `Buy ${productName} online at Gidan. Best quality ${catName.toLowerCase()} plants with expert care guides, fast delivery and easy returns across India.`,
    openGraph: {
      title: `Buy ${productName} Online | Gidan Plants`,
      description: `Buy ${productName} online at Gidan - India's trusted plant store. Expert care, fast delivery.`,
      url: canonicalUrl,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    // Canonical always points to the base product URL (no ?variant=) to prevent
    // duplicate content issues while keeping variant pages accessible.
    alternates: { canonical: canonicalUrl },
  };


}

import { fetchProductDetail } from "@/utils/serverApi";

export default async function ProductPage({ params, searchParams }: Props) {
  const { productSlug } = await params;
  const sParams = await searchParams;

  // Fetch full product data on server
  const productData = await fetchProductDetail(productSlug, sParams);
  if (!productData) notFound();

  return <ProductData initialProductData={productData} />;
}
