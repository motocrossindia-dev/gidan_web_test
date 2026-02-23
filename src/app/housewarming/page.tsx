import type { Metadata } from "next";
import HouseWarming from '@/views/utilities/HouseWarming/HouseWarming';


export const metadata: Metadata = {
  title: "Housewarming Gift Plants and Decor | Gidan",
  description: "Bring greenery and good luck to a new home. Shop housewarming plant gifts at Gidan.",
  openGraph: {
    title: "Housewarming Gift Plants and Decor | Gidan",
    description: "Bring greenery and good luck to a new home. Shop housewarming plant gifts at Gidan.",
    url: "https://www.gidan.store/housewarming",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Housewarming Gift Plants and Decor | Gidan",
    description: "Bring greenery and good luck to a new home. Shop housewarming plant gifts at Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/housewarming" },
  robots: { index: true, follow: true },
};

export default function HousewarmingPage() {
  return <HouseWarming />;
}
