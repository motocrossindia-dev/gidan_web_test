import type { Metadata } from "next";
import Home from '@/components/Home/Home';

// Server-side fetching for LCP optimization
async function getInitialBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotion/banner/`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.banners || null;
  } catch (err) {
    console.error("Failed to fetch banners on server", err);
    return null;
  }
}

// Pre-fetch categories for SEO/Crawlability
async function getInitialCategories() {
  try {
    // 1. Fetch main categories
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const categories = data?.data?.categories || [];

    // 2. Fetch subcategories for each category to hydrate the full tree
    const categoriesWithSubs = await Promise.all(
      categories.map(async (cat: any) => {
        try {
          const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/categoryWiseSubCategory/${cat.slug}/`, { next: { revalidate: 300 } });
          const subData = await subRes.json();
          return { ...cat, subCategory: subData?.data?.subCategorys || [] };
        } catch (e) {
          return { ...cat, subCategory: [] };
        }
      })
    );
    return categoriesWithSubs;
  } catch (err) {
    console.error("Failed to fetch categories on server", err);
    return [];
  }
}


export const metadata: Metadata = {
  title: "Gidan - Plants, Seeds & Gardening Store Online India",
  description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  openGraph: {
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
    url: "https://www.gidan.store",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  },
  alternates: { canonical: "https://www.gidan.store" },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const [initialBanners, initialCategories] = await Promise.all([
    getInitialBanners(),
    getInitialCategories()
  ]);

  return <Home initialBanners={initialBanners} initialCategories={initialCategories} />;
}
