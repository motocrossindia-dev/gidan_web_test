import type { Metadata } from "next";
import AddNewAddressMobile from '@/views/MobileUser/AddNewAddressMobile/AddNewAddressMobile';


export const metadata: Metadata = {
  title: "My Addresses | Gidan Plants",
  description: "Manage your saved delivery addresses on Gidan.",
  openGraph: {
    title: "My Addresses | Gidan Plants",
    description: "Manage your saved delivery addresses on Gidan.",
    url: "https://www.gidan.store/mobilesidebar/address",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Addresses | Gidan Plants",
    description: "Manage your saved delivery addresses on Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/address" },
  robots: { index: true, follow: true },
};

export default function MobileSidebarAddressPage() {
  return <AddNewAddressMobile />;
}
