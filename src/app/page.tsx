import type { Metadata } from "next";
import Home from '@/components/Home/Home';
import HomepageSchema from "@/views/utilities/seo/HomepageSchema";
import GlobalIdentitySchema from "@/views/utilities/seo/GlobalIdentitySchema";
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


// Pre-fetch Trending Products for better SEO/Hydration
async function getInitialTrendingProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?is_trending=true&page_size=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || [];
  } catch (err) {
    console.error("Failed to fetch trending products on server", err);
    return [];
  }
}

async function getInitialFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?is_featured=true&page_size=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || [];
  } catch (err) {
    console.error("Failed to fetch featured products on server", err);
    return [];
  }
}

async function getInitialBestsellerProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?is_best_seller=true&page_size=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || [];
  } catch (err) {
    console.error("Failed to fetch best seller products on server", err);
    return [];
  }
}

async function getInitialSeasonalProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?is_seasonal_collection=true&page_size=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || [];
  } catch (err) {
    console.error("Failed to fetch seasonal products on server", err);
    return [];
  }
}


export const metadata: Metadata = {
  title: "Gidan - Plants, Seeds & Gardening Store Online India",
  description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  openGraph: {
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
    url: "https://gidanbackendtest.mymotokart.in",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description: "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in" },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const [
    initialBanners,
    initialCategories,
    initialTrendingProducts,
    initialFeaturedProducts,
    initialBestsellerProducts,
    initialSeasonalProducts
  ] = await Promise.all([
    getInitialBanners(),
    getInitialCategories(),
    getInitialTrendingProducts(),
    getInitialFeaturedProducts(),
    getInitialBestsellerProducts(),
    getInitialSeasonalProducts()
  ]);

  // Generate preload link for LCP banner image server-side
  // This tells the browser to fetch the image immediately from HTML, before JS runs
  const firstHomeBanner = initialBanners?.find(
    (b: any) => b.type === 'Home' && b.is_visible
  );
  const lcpBannerPath = firstHomeBanner?.mobile_banner || firstHomeBanner?.web_banner;
  const lcpPreloadUrl = lcpBannerPath
    ? `/_next/image?url=${encodeURIComponent(`https://backend.gidan.store${lcpBannerPath}`)}&w=828&q=75`
    : null;

  return (
    <>
      {lcpPreloadUrl && (
        <link
          rel="preload"
          as="image"
          href={lcpPreloadUrl}
          fetchPriority="high"
        />
      )}
      <GlobalIdentitySchema />
      <HomepageSchema />
      <Home
        initialBanners={initialBanners}
        initialCategories={initialCategories}
        initialTrendingProducts={initialTrendingProducts}
        initialFeaturedProducts={initialFeaturedProducts}
        initialBestsellerProducts={initialBestsellerProducts}
        initialSeasonalProducts={initialSeasonalProducts}
      />
    </>
  );
}
