import type { Metadata } from "next";
import AddAddressPageCheckout from '@/views/utilities/MobileCheckout/AddAddressPageCheckout';


export const metadata: Metadata = {
  title: "Add Address | Gidan Plants",
  description: "Add a new delivery address to your Gidan account.",
  openGraph: {
    title: "Add Address | Gidan Plants",
    description: "Add a new delivery address to your Gidan account.",
    url: "https://gidanbackendtest.mymotokart.in/add-address",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Address | Gidan Plants",
    description: "Add a new delivery address to your Gidan account.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/add-address" },
  robots: { index: true, follow: true },
};

export default function AddAddressPage() {
  return <AddAddressPageCheckout />;
}
