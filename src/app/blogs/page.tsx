import type { Metadata } from "next";
import BlogList from '@/views/Blog/BlogList';


export const metadata: Metadata = {
  title: "Blog | Plant Care and Gardening Guides | Gidan",
  description: "Expert plant care articles, gardening how-tos and seasonal tips on the Gidan blog.",
  openGraph: {
    title: "Blog | Plant Care and Gardening Guides | Gidan",
    description: "Expert plant care articles, gardening how-tos and seasonal tips on the Gidan blog.",
    url: "https://www.gidan.store/blogs",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Plant Care and Gardening Guides | Gidan",
    description: "Expert plant care articles, gardening how-tos and seasonal tips on the Gidan blog.",
  },
  alternates: { canonical: "https://www.gidan.store/blogs" },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return <BlogList />;
}
