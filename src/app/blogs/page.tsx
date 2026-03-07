import type { Metadata } from "next";
import BlogList from '@/views/Blog/BlogList';


export const metadata: Metadata = {
  title: "Gardening Tips & Plant Care Guides | Gidan Store Blog",
  description: "Explore gardening tips, plant care guides and growing advice from Gidan Store. Learn how to grow healthy plants at home in Bangalore.",
  openGraph: {
    title: "Gardening Tips & Plant Care Guides | Gidan Store Blog",
    description: "Explore gardening tips, plant care guides and growing advice from Gidan Store. Learn how to grow healthy plants at home in Bangalore.",
    url: "https://www.gidan.store/blogs",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gardening Tips & Plant Care Guides | Gidan Store Blog",
    description: "Explore gardening tips, plant care guides and growing advice from Gidan Store. Learn how to grow healthy plants at home in Bangalore.",
  },
  alternates: { canonical: "https://www.gidan.store/blogs" },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return <BlogList />;
}
