import type { Metadata } from "next";
import FranchiseEnquires from '@/views/utilities/FranchiseEnquires/FranchiseEnquires';


export const metadata: Metadata = {
  title: "Plant Nursery Franchise in Bangalore | Gidan Store",
  description: "Explore plant nursery franchise opportunities with Gidan Store in Bangalore. Start your own gardening store with brand support and business guidance.",
  openGraph: {
    title: "Plant Nursery Franchise in Bangalore | Gidan Store",
    description: "Explore plant nursery franchise opportunities with Gidan Store in Bangalore. Start your own gardening store with brand support and business guidance.",
    url: "https://www.gidan.store/franchise-enquiry",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Nursery Franchise in Bangalore | Gidan Store",
    description: "Explore plant nursery franchise opportunities with Gidan Store in Bangalore. Start your own gardening store with brand support and business guidance.",
  },
  alternates: { canonical: "https://www.gidan.store/franchise-enquiry" },
  robots: { index: true, follow: true },
};

export default function FranchiseEnquiryPage() {
  return <FranchiseEnquires />;
}
