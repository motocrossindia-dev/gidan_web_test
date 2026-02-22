import type { Metadata } from "next";
import FranchiseEnquires from '@/views/utilities/FranchiseEnquires/FranchiseEnquires';


export const metadata: Metadata = {
  title: "Franchise Enquiry | Gidan Plants",
  description: "Interested in owning a Gidan franchise? Fill the enquiry form and grow with us.",
  openGraph: {
    title: "Franchise Enquiry | Gidan Plants",
    description: "Interested in owning a Gidan franchise? Fill the enquiry form and grow with us.",
    url: "https://www.gidan.store/franchise-enquiry",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franchise Enquiry | Gidan Plants",
    description: "Interested in owning a Gidan franchise? Fill the enquiry form and grow with us.",
  },
  alternates: { canonical: "https://www.gidan.store/franchise-enquiry" },
  robots: { index: true, follow: true },
};

export default function FranchiseEnquiryPage() {
  return <FranchiseEnquires />;
}
