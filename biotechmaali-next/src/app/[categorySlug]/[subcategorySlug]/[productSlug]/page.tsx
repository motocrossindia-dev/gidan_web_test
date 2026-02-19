import type { Metadata } from "next";
import ProductData from '@/views/utilities/ProductData/ProductData';

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string; productSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug, productSlug } = await params;
  const productName = productSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const catName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Buy ${productName} Online | Gidan Plants`,
    description: `Buy ${productName} online at Gidan. Best quality ${catName.toLowerCase()} plants with expert care guides, fast delivery and easy returns across India.`,
    openGraph: {
      title: `Buy ${productName} Online | Gidan Plants`,
      description: `Buy ${productName} online at Gidan - India's trusted plant store. Expert care, fast delivery.`,
      url: `https://www.gidan.store/${categorySlug}/${subcategorySlug}/${productSlug}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}/${subcategorySlug}/${productSlug}` },
  };
}

export default function ProductPage() {
  return <ProductData />;
}
