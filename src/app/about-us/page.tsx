import type { Metadata } from "next";
import AboutUs from '@/views/utilities/AboutUs/About-Us';


export const metadata: Metadata = {
  title: "About Gidan Store | Plant Store in Bangalore",
  description: "Learn about Gidan Store, your trusted plant store in Bangalore. Discover our passion for indoor plants, outdoor plants and gardening essentials.",
  openGraph: {
    title: "About Gidan Store | Plant Store in Bangalore",
    description: "Learn about Gidan Store, your trusted plant store in Bangalore. Discover our passion for indoor plants, outdoor plants and gardening essentials.",
    url: "https://gidanbackendtest.mymotokart.in/about-us",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Gidan Store | Plant Store in Bangalore",
    description: "Learn about Gidan Store, your trusted plant store in Bangalore. Discover our passion for indoor plants, outdoor plants and gardening essentials.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/about-us" },
  robots: { index: true, follow: true },
};

export default function AboutUsPage() {
  return <AboutUs />;
}
