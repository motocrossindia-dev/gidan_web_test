import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string }> };

// Valid category slugs (must also pass parent check)
const VALID_CATEGORY_SLUGS = new Set([
  "pots",
  "plants",
  "seeds",
  "plant-care",
]);

// Valid subcategory slugs from the API
const VALID_SUBCATEGORY_SLUGS = new Set([
  // plants
  "indoor-plant-26",
  "outdoor-plant-27",
  "flowering-plants-40",
  // pots
  "rotomolded-pots-28",
  "plastic-pots-29",
  "hanging-pots-30",
  "table-top-pots-35",
  "eco-planters-39",
  // seeds
  "vegetable-seeds-31",
  // plant-care
  "growing-media-36",
  "garden-essenials-37",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;

  if (!VALID_CATEGORY_SLUGS.has(categorySlug) || !VALID_SUBCATEGORY_SLUGS.has(subcategorySlug)) return {};

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

  if (!VALID_CATEGORY_SLUGS.has(categorySlug) || !VALID_SUBCATEGORY_SLUGS.has(subcategorySlug)) notFound();

  return <PlantFilter />;
}
