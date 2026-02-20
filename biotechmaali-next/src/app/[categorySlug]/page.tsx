import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string }> };

// Valid category slugs that should be handled by this dynamic route.
// Everything else should 404 instead of falling through as a "category".
const VALID_CATEGORY_SLUGS = new Set([
  "pots",
  "plants",
  "seeds",
  "plant-care",
]);

async function isValidCategorySlug(slug: string): Promise<boolean> {
  if (VALID_CATEGORY_SLUGS.has(slug)) return true;

  // Also check the API for dynamically-added categories
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?category_slug=${encodeURIComponent(slug)}&page=1&limit=1`,
      { next: { revalidate: 3600 } } // cache for 1 hour
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
  const { categorySlug } = await params;

  const valid = await isValidCategorySlug(categorySlug);
  if (!valid) return {};

  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Plants | Gidan`,
    description: `Shop ${name.toLowerCase()} plants, pots and gardening products at Gidan. Wide variety, great prices and fast delivery across India.`,
    openGraph: {
      title: `${name} Plants | Gidan`,
      description: `Shop ${name.toLowerCase()} plants and accessories at Gidan, India's trusted online plant store.`,
      url: `https://www.gidan.store/${categorySlug}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  const valid = await isValidCategorySlug(categorySlug);
  if (!valid) notFound();

  return <PlantFilter />;
}
