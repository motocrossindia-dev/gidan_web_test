import type { Metadata } from "next";
import MobileSidebar from '@/views/utilities/MobileSidebar/MobileSidebar';


export const metadata: Metadata = {
  title: "My Account | Gidan Plants",
  description: "Access your Gidan profile, orders, wishlist and wallet.",
  openGraph: {
    title: "My Account | Gidan Plants",
    description: "Access your Gidan profile, orders, wishlist and wallet.",
    url: "https://www.gidan.store/mobilesidebar",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Account | Gidan Plants",
    description: "Access your Gidan profile, orders, wishlist and wallet.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar" },
  robots: { index: true, follow: true },
};

export default function MobileSidebarPage() {
  return <MobileSidebar />;
}
