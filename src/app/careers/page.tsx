import type { Metadata } from "next";
import Carriers from '@/views/utilities/Carriers/Carriers';


export const metadata: Metadata = {
  title: "Careers at Gidan Store | Gardening Jobs in Bangalore",
  description: "Explore career opportunities at Gidan Store in Bangalore. Join our team and grow your career in gardening, plants and ecommerce.",
  openGraph: {
    title: "Careers at Gidan Store | Gardening Jobs in Bangalore",
    description: "Explore career opportunities at Gidan Store in Bangalore. Join our team and grow your career in gardening, plants and ecommerce.",
    url: "https://www.gidan.store/careers",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Gidan Store | Gardening Jobs in Bangalore",
    description: "Explore career opportunities at Gidan Store in Bangalore. Join our team and grow your career in gardening, plants and ecommerce.",
  },
  alternates: { canonical: "https://www.gidan.store/careers" },
  robots: { index: true, follow: true },
};

export default function CareersPage() {
  return <Carriers />;
}
