import type { Metadata } from "next";
import Home from '@/components/Home/Home';
import DownloadApp from "@/components/DownloadApp/DownloadApp";
import HomepageSchema from "@/views/utilities/seo/HomepageSchema";
import GlobalIdentitySchema from "@/views/utilities/seo/GlobalIdentitySchema";
import { Suspense } from "react";
import PageSkeleton from "@/components/Shared/PageSkeleton";

// Streaming Sections
import TrendingSectionServer from "./sections/TrendingSectionServer";
import SeasonalSectionServer from "./sections/SeasonalSectionServer";
import ReviewsSectionServer from "./sections/ReviewsSectionServer";
// Server-side fetching for LCP optimization
async function getInitialBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotion/banner/`, { next: { revalidate: 60 } });
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
    // 1. Fetch main categories ONLY on the server to keep navigation fast
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    const categories = data?.data?.categories || [];
    
    // We return these without subcategories. The client-side useCategories hook 
    // will hydrate the full tree including subcategories without blocking the initial page paint.
    return categories;
  } catch (err) {
    console.error("Failed to fetch categories on server", err);
    return [];
  }
}

// Pre-fetch homepage sections data
async function getHomepageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch homepage data on server", err);
    return null;
  }
}

// Pre-fetch public flags
async function getPublicFlags() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/public-flags/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.flags || [];
  } catch (err) {
    console.error("Failed to fetch public flags on server", err);
    return [];
  }
}

// Pre-fetch global reviews
async function getGlobalReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/globalReviews/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null; // Returns { avg_rating, total_ratings, reviews: [...] }
  } catch (err) {
    console.error("Failed to fetch global reviews on server", err);
    return null;
  }
}

// Pre-fetch product collections
async function getProductsByFilter(filterQuery: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?${filterQuery}&page_size=20&limit=20&page=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || data?.products || data?.data?.results || data?.data?.products || [];
  } catch (err) {
    console.error(`Failed to fetch products for ${filterQuery} on server`, err);
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
  // Pre-fetch flags to construct dynamic flag-based queries
  const flags = await getPublicFlags();
  
  const getFlagQuery = (name: string, fallback: string) => {
    const flag = flags.find((f: any) => f.name.toLowerCase().includes(name.toLowerCase()));
    return flag ? `flag=${flag.id}` : fallback;
  };

  const seasonalQuery = getFlagQuery('seasonal', 'is_seasonal_collection=true');
  const trendingQuery = getFlagQuery('trending', 'is_trending=true');
  const featuredQuery = getFlagQuery('featured', 'is_featured=true');
  const bestsellerQuery = getFlagQuery('best_seller', 'is_best_seller=true');
  const latestQuery = getFlagQuery('latest', 'is_latest=true');

  const [
    initialBanners,
    initialCategories,
    initialHomeData,
  ] = await Promise.all([
    getInitialBanners(),
    getInitialCategories(),
    getHomepageData(),
  ]);


  // Generate preload link for LCP banner image server-side
  // This tells the browser to fetch the image immediately from HTML, before JS runs
  const firstHomeBanner = initialBanners?.find(
    (b: any) => b.type === 'Home' && b.is_visible
  );
  const lcpBannerPath = firstHomeBanner?.mobile_banner || firstHomeBanner?.web_banner;
  const lcpPreloadUrl = lcpBannerPath
    ? `/_next/image?url=${encodeURIComponent(lcpBannerPath.startsWith('http') ? lcpBannerPath : `https://backend.gidan.store${lcpBannerPath}`)}&w=828&q=75`
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
        initialHomeData={initialHomeData}
        publicFlags={flags}
        trendingSection={
          <Suspense key="trending-suspense-root" fallback={<div className="h-96 w-full animate-pulse bg-gray-50 rounded-3xl mt-8" />}>
            <TrendingSectionServer 
              trendingQuery={trendingQuery}
              featuredQuery={featuredQuery}
              bestsellerQuery={bestsellerQuery}
              latestQuery={latestQuery}
              publicFlags={flags}
            />
          </Suspense>
        }
        seasonalSection={
          <Suspense key="seasonal-suspense-root" fallback={<div className="h-96 w-full animate-pulse bg-gray-50 rounded-3xl mt-8" />}>
            <SeasonalSectionServer 
              seasonalQuery={seasonalQuery}
              trendingQuery={trendingQuery}
              featuredQuery={featuredQuery}
              bestsellerQuery={bestsellerQuery}
              publicFlags={flags}
            />
          </Suspense>
        }
        reviewsSection={
          <Suspense key="reviews-suspense-root" fallback={<div className="h-48 w-full animate-pulse bg-gray-50 rounded-3xl mt-8" />}>
            <ReviewsSectionServer />
          </Suspense>
        }
      />
      <DownloadApp />
    </>
  );
}

