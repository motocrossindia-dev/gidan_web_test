import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string }> };

// Fetch valid category slugs from the backend
async function getValidCategorySlugs(): Promise<Set<string>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set();
    const data = await res.json();
    const categories = data?.data?.categories || [];
    return new Set(categories.map((c: any) => c.slug));
  } catch (err) {
    console.error("Error fetching category slugs", err);
    return new Set();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;

  const validSlugs = await getValidCategorySlugs();
  if (validSlugs.size > 0 && !validSlugs.has(categorySlug)) return {};

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

import { fetchCategoryBySlug, fetchProductsByFilters } from "@/utils/serverApi";

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  // 1. Fetch category data on server
  const category = await fetchCategoryBySlug(categorySlug);
  if (!category) notFound();

  // 2. Fetch initial products for this category
  // Map category names to internal types if necessary
  const categoryToTypeMap: Record<string, string> = {
    'plants': 'plant',
    'pots': 'pot',
    'seeds': 'seed',
    'plant-care': 'plantcare'
  };
  const typeKey = categoryToTypeMap[categorySlug.toLowerCase()] || "plant";

  const initialResults = await fetchProductsByFilters({
    type: typeKey,
    // Note: API seems to use case-sensitive names or IDs in some places, 
    // but PlantFilter usually waits for ID resolution. 
    // For hydration, we pre-fetch the main list.
  });

  return <PlantFilter initialResults={initialResults} initialCategoryData={category} />;
}
