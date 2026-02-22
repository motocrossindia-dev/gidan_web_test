import type { Metadata } from "next";
import SingleBlog from '@/views/utilities/Blog/SingleBlog';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} | Gidan Blog`,
    description: `Read our expert guide on ${title.toLowerCase()} - plant care tips, gardening advice and green living inspiration on the Gidan blog.`,
    openGraph: {
      title: `${title} | Gidan Blog`,
      description: `Expert plant care and gardening guide: ${title.toLowerCase()}.`,
      url: `https://www.gidan.store/blogcomponent/single/${id}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "article",
    },
    alternates: { canonical: `https://www.gidan.store/blogcomponent/single/${id}` },
  };
}

export default function SingleBlogPage() {
  return <SingleBlog />;
}
