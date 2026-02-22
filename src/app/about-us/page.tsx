import type { Metadata } from "next";
import AboutUs from '@/views/utilities/AboutUs/About-Us';


export const metadata: Metadata = {
  title: "About Us | Gidan Plants and Gardening",
  description: "Learn about Gidan mission to bring greenery into every home. Trusted plant and gardening brand in India.",
  openGraph: {
    title: "About Us | Gidan Plants and Gardening",
    description: "Learn about Gidan mission to bring greenery into every home. Trusted plant and gardening brand in India.",
    url: "https://www.gidan.store/about-us",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Gidan Plants and Gardening",
    description: "Learn about Gidan mission to bring greenery into every home. Trusted plant and gardening brand in India.",
  },
  alternates: { canonical: "https://www.gidan.store/about-us" },
  robots: { index: true, follow: true },
};

export default function AboutUsPage() {
  return <AboutUs />;
}
