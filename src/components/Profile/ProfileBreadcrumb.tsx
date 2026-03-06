'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const PATH_LABELS: Record<string, string> = {
  profile: 'My Account',
  orders: 'My Orders',
  postsummary: 'Order Summary',
  wallet: 'Wallet',
  wallethistory: 'Wallet History',
  btcoins: 'GD Coins',
  giftcard: 'Gift Card',
  referal: 'Refer & Earn',
  trackorder: 'Track Order',
  history: 'Coin History',
};

export default function ProfileBreadcrumb() {
  const pathname = usePathname();

  // Split path into segments, filter empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Build crumbs: each has a label and href
  // Skip dynamic [id] segments (order IDs like BMO..., numeric IDs)
  const crumbs: { label: string; href: string }[] = [];
  let currentHref = '';

  for (const segment of segments) {
    currentHref += `/${segment}`;
    const label = PATH_LABELS[segment];
    if (label) {
      crumbs.push({ label, href: currentHref });
    } else if (/^\d+$/.test(segment) || segment.length > 8) {
      // Dynamic order ID — label as "Details"
      crumbs.push({ label: 'Details', href: currentHref });
    }
  }

  if (crumbs.length === 0) return null;

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);

  return (
    <div className="hidden md:flex items-center gap-1 px-2 pb-3 text-sm text-gray-500 flex-wrap">
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
  );
}
