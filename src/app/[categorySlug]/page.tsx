import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';
import { Suspense } from "react";
import CategoryProductGridServer from "../sections/CategoryProductGridServer";

type Props = { params: Promise<{ categorySlug: string }> };

/**
 * PRODUCTION OPTIMIZATION: Dynamically pre-render all published categories at build time.
 * This ensures that even new categories added to the backend are high-performance and SEO-ready instantly.
 */
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    
    const data = await res.json();
    const categories = data?.data?.categories || [];
    
    // Create static params for all published category slugs
    return categories
      .filter((c: any) => c.is_published && c.slug)
      .map((c: any) => ({
        categorySlug: c.slug,
      }));
  } catch (err) {
    console.error("Error generating static params for categories:", err);
    // Fallback to essential categories if API is down during build
    return [
      { categorySlug: 'plants' },
      { categorySlug: 'pots' },
      { categorySlug: 'seeds' },
      { categorySlug: 'plant-care' },
      { categorySlug: 'gifts' }
    ];
  }
}

// Fetch valid category slugs from the backend
async function getValidCategorySlugs(): Promise<Set<string>> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store";
    const res = await fetch(`${apiUrl}/category/`, { next: { revalidate: 300 } });
    if (!res.ok) return new Set<string>();
    const data = await res.json();
    const categories = data?.data?.categories || [];
    const slugs = new Set<string>(categories.map((c: any) => c.slug));
    // Manually add 'gifts' or 'gift' to support the gifts route
    slugs.add('gifts');
    slugs.add('gift');
    return slugs;
  } catch (err) {
    console.error("Error fetching category slugs", err);
    return new Set<string>(['gifts', 'gift']); // Fallback to at least supporting gifts
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;

  const validSlugs = await getValidCategorySlugs();
  if (validSlugs.size > 0 && !validSlugs.has(categorySlug)) return {};

  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Buy ${name} Online India | Best Collection | Gidan`,
    description: `Shop the best ${name.toLowerCase()} for your home and garden at Gidan. Wide variety of ${name.toLowerCase()} available online with fast delivery across India.`,
    openGraph: {
      title: `Buy ${name} Online India | Gidan`,
      description: `Browse our extensive collection of ${name.toLowerCase()} at Gidan. Quality products, competitive prices, and fast shipping in India.`,
      url: `/${categorySlug}/`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `/${categorySlug}/` },
  };
}

import { fetchCategoryBySlug, fetchSubcategoryBySlug, fetchProductsByFilters, fetchSubcategories, fetchFilters, fetchPublicFlags } from "@/utils/serverApi";
import CategoryStaticSEO from "@/views/utilities/Info/CategoryStaticSEO";
import RecentlyViewedProducts from "@/components/Shared/RecentlyViewedProducts";
import Blog from "@/components/Blog/Blog";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import CategoryHero from "@/components/Shared/CategoryHero";
import TrustBadges from "@/components/Shared/TrustBadges";

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  // 2. Fetch primary category data to resolve dynamic metadata
  const category = await fetchCategoryBySlug(categorySlug);
  const categorySlugLower = categorySlug.toLowerCase();

  // Handle 'gifts' specially if not in standard category API, otherwise use official 'type'
  const isGiftCategory = categorySlugLower === 'gifts' || categorySlugLower === 'gift';
  const effectiveCategory = category || (isGiftCategory ? { id: null, name: "Gifts", slug: categorySlug, type: "gift" } : null);

  if (!effectiveCategory) notFound();

  // Dynamically resolve typeKey from backend category object, fallback to 'plant'
  const typeKey = (effectiveCategory as any).type || "plant";
  const effectiveId = effectiveCategory.id ? effectiveCategory.id.toString() : null;

  // 3. Fetch remaining data in parallel using resolved metadata
  const [subcategories, publicFlags] = await Promise.all([
    fetchSubcategories(categorySlug),
    fetchPublicFlags()
  ]);

  // Attach subCategory to category object for the Shell
  const categoryWithSubs = { ...effectiveCategory, subCategory: subcategories || [] };

  // Prepare initial SEO data for server-side rendering
  const catInfo = (effectiveCategory as any).category_info?.category_info || (effectiveCategory as any).category_info;
  const initialSEOData = catInfo ? {
    heading_before: catInfo.heading_before || "",
    italic_text: catInfo.italic_text || "",
    heading_after: catInfo.heading_after || "",
    description: catInfo.description || catInfo.intro_text || "",
    title: catInfo.title || effectiveCategory.name,
    subtitle: catInfo.subtitle || `${effectiveCategory.name} - Buy Online in India from Gidan.store`,
    tags: catInfo.tags || [],
    stats: catInfo.stats || [],
    info_cards: catInfo.info_cards || catInfo.category_info?.info_cards || [],
    category_info_green_text: catInfo.category_info_green_text || "",
    category_info_description: catInfo.category_info_description || ""
  } : {
    title: effectiveCategory.name,
    subtitle: `${effectiveCategory.name} - Buy Online in India from Gidan.store`,
    description: "",
    info_cards: []
  };

  return (
    <>
      <CollectionSchema
        category={{ name: effectiveCategory.name, slug: effectiveCategory.slug }}
        products={[]} 
      />


      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[32px]" />
                ))}
            </div>
        </div>
      }>
        <CategoryProductGridServer 
          categorySlug={categorySlug}
          typeKey={typeKey}
          categoryId={effectiveId}
          categoryWithSubs={categoryWithSubs}
          publicFlags={publicFlags}
          initialSEOData={initialSEOData}
        />
      </Suspense>


      <div className="space-y-12 mt-12 mb-8">
        <RecentlyViewedProducts />
        {/* @ts-ignore */}
        <Blog categoryId={2} />
      </div>
    </>
  );
}
