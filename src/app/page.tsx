import type { Metadata } from "next";
import Home from '@/components/Home/Home';
import DownloadApp from "@/components/DownloadApp/DownloadApp";
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

// Pre-fetch homepage sections data
async function getHomepageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/`, { cache: 'no-store' });
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/public-flags/`, { cache: 'no-store' });
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/globalReviews/`, { cache: 'no-store' });
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
    const res = await fetch(url, { cache: 'no-store' });
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
    initialTrending,
    initialFeatured,
    initialBestseller,
    initialSeasonal,
    initialSeasonalTrending,
    initialSeasonalFeatured,
    initialSeasonalBestseller,
    initialLatest,
    initialGlobalReviews
  ] = await Promise.all([
    getInitialBanners(),
    getInitialCategories(),
    getHomepageData(),
    getProductsByFilter(trendingQuery),
    getProductsByFilter(featuredQuery),
    getProductsByFilter(bestsellerQuery),
    getProductsByFilter(seasonalQuery),
    getProductsByFilter(`${seasonalQuery}&${trendingQuery}`),
    getProductsByFilter(`${seasonalQuery}&${featuredQuery}`),
    getProductsByFilter(`${seasonalQuery}&${bestsellerQuery}`),
    getProductsByFilter(latestQuery),
    getGlobalReviews()
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
        initialTrending={initialTrending}
        initialFeatured={initialFeatured}
        initialBestseller={initialBestseller}
        initialSeasonal={initialSeasonal}
        initialSeasonalTrending={initialSeasonalTrending}
        initialSeasonalFeatured={initialSeasonalFeatured}
        initialSeasonalBestseller={initialSeasonalBestseller}
        initialLatest={initialLatest}
        initialGlobalReviews={initialGlobalReviews}
        publicFlags={flags}
      />
      <DownloadApp />
    </>
  );
}

