'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const PATH_LABELS: Record<string, string> = {
  'about-us': 'About Us',
  'careers': 'Careers',
  'contact-us': 'Contact Us',
  'faq': 'FAQ',
  'franchise-enquiry': 'Franchise Enquiry',
  'privacy-policy': 'Privacy Policy',
  'return': 'Return & Refund Policy',
  'shipping': 'Shipping Policy',
  'terms': 'Terms of Service',
  'stores': 'Our Stores',
  'ourwork': 'Our Work',
  'services': 'Services',
  'corporate': 'Corporate Gifting',
  'blog': 'Blog',
  'blogs': 'Blogs',
  'wishlist': 'Wishlist',
  'cart': 'Cart',
  'search': 'Search',
  'bestseller': 'Best Sellers',
  'featured': 'Featured',
  'trending': 'Trending',
  'seasonal': 'Seasonal Collection',
  'latest': 'Latest',
  'flower': 'Flowers',
  'gifts': 'Gifts',
  'outdoor': 'Outdoor Plants',
  'birthday': 'Birthday',
  'anniversary': 'Anniversary',
  'housewarming': 'Housewarming',
  'rakshabhandan': 'Raksha Bandhan',
  'combooffer': 'Combo Offers',
  'dealofweek': 'Deal of the Week',
  'giftcard': 'Gift Cards',
  'feature': 'Features',
};

// Parent paths that have dynamic sub-pages
const DYNAMIC_PARENTS: Record<string, string> = {
  'blogs': 'Blogs',
  'blog': 'Blog',
  'stores': 'Our Stores',
};

// Format a URL slug into a readable label: "my-blog-post" → "My Blog Post"
function formatSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Paths where breadcrumb should NOT appear
const HIDDEN_PREFIXES = [
  '/',
  '/profile',
  '/checkout',
  '/payment',
  '/paymentgateway',
  '/order-success',
  '/order-summary',
  '/successpage',
  '/thankyou',
  '/mobile-login',
  '/mobile-signin',
  '/mobile-verification',
  '/mobilesidebar',
  '/add-address',
  '/address',
  '/btcoins',
  '/wallet',
  '/wallethistory',
  '/history',
  '/side',
  '/hamburger',
  '/carousel',
  '/productdata',
];

export default function StaticBreadcrumb() {
  const pathname = usePathname();

  // Hide on home
  if (pathname === '/') return null;

  // Hide on hidden prefixes
  for (const prefix of HIDDEN_PREFIXES) {
    if (prefix === '/' ? pathname === '/' : pathname.startsWith(prefix)) return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  // Only show for known static pages or dynamic-sub pages
  const isKnownStatic = !!PATH_LABELS[segments[0]];
  const isDynamicSub = !!DYNAMIC_PARENTS[segments[0]];
  if (!isKnownStatic && !isDynamicSub) return null;

  const crumbs: { label: string; href: string }[] = [];
  let currentHref = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentHref += `/${segment}`;
    const staticLabel = PATH_LABELS[segment] || DYNAMIC_PARENTS[segment];
    if (staticLabel) {
      crumbs.push({ label: staticLabel, href: currentHref });
    } else if (i > 0 && DYNAMIC_PARENTS[segments[0]]) {
      // Dynamic slug segment under a known parent
      crumbs.push({ label: formatSlug(segment), href: currentHref });
    }
  }

  if (crumbs.length === 0) return null;

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);

  return (
    <div className="bg-site-bg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="flex items-center gap-1 hover:text-bio-green transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>

        {parentCrumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            <Link href={crumb.href} className="hover:text-bio-green transition-colors">
              {crumb.label}
            </Link>
          </span>
        ))}

        <span className="flex items-center gap-1">
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-800 font-medium">{lastCrumb.label}</span>
        </span>
      </div>
    </div>
  );
}
