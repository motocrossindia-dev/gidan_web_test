import type { Metadata } from "next";
import AddressPage from '@/views/utilities/MobileCheckout/AddressPage';


export const metadata: Metadata = {
  title: "Manage Addresses | Gidan Plants",
  description: "View and manage your saved delivery addresses at Gidan.",
  openGraph: {
    title: "Manage Addresses | Gidan Plants",
    description: "View and manage your saved delivery addresses at Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/address",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Addresses | Gidan Plants",
    description: "View and manage your saved delivery addresses at Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/address" },
  robots: { index: true, follow: true },
};

export default function AddressPageRoute() {
  return <AddressPage />;
}
