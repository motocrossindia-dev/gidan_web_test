import type { Metadata } from "next";
import Comingsoon from '@/views/utilities/Gifts/Comingsoon';


export const metadata: Metadata = {
  title: "Plant Gifts Online in Bangalore | Gidan Store",
  description: "Buy plant gifts online in Bangalore from Gidan Store. Discover indoor plants and planters perfect for birthdays, housewarming and special occasions.",
  openGraph: {
    title: "Plant Gifts Online in Bangalore | Gidan Store",
    description: "Buy plant gifts online in Bangalore from Gidan Store. Discover indoor plants and planters perfect for birthdays, housewarming and special occasions.",
    url: "https://www.gidan.store/gifts",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Gifts Online in Bangalore | Gidan Store",
    description: "Buy plant gifts online in Bangalore from Gidan Store. Discover indoor plants and planters perfect for birthdays, housewarming and special occasions.",
  },
  alternates: { canonical: "https://www.gidan.store/gifts" },
  robots: { index: true, follow: true },
};

export default function GiftsPage() {
  return <Comingsoon />;
}
