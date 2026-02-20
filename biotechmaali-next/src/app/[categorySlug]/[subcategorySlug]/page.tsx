import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string }> };

async function isValidSubcategory(categorySlug: string, subcategorySlug: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?category_slug=${encodeURIComponent(categorySlug)}&subcategory_slug=${encodeURIComponent(subcategorySlug)}&page=1&limit=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return false;
    const data = await res.json();
    const count = data?.count ?? data?.data?.products?.length ?? 0;
    return count > 0;
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;

  const valid = await isValidSubcategory(categorySlug, subcategorySlug);
  if (!valid) return {};

  const catName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const subName = subcategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${subName} - ${catName} | Gidan`,
    description: `Buy ${subName.toLowerCase()} in ${catName.toLowerCase()} category at Gidan. Browse our collection of plants, pots and garden accessories.`,
    openGraph: {
      title: `${subName} - ${catName} | Gidan`,
      description: `Shop ${subName.toLowerCase()} ${catName.toLowerCase()} at Gidan Plants India.`,
      url: `https://www.gidan.store/${categorySlug}/${subcategorySlug}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}/${subcategorySlug}` },
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;

  const valid = await isValidSubcategory(categorySlug, subcategorySlug);
  if (!valid) notFound();

  return <PlantFilter />;
}
