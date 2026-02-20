import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string }> };

// Only these slugs are valid category routes.
// The backend API ignores invalid category_slug and returns all products,
// so we MUST use a strict allowlist — no API fallback.
const VALID_CATEGORY_SLUGS = new Set([
  "pots",
  "plants",
  "seeds",
  "plant-care",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;

  if (!VALID_CATEGORY_SLUGS.has(categorySlug)) return {};

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

  if (!VALID_CATEGORY_SLUGS.has(categorySlug)) notFound();

  return <PlantFilter />;
}
