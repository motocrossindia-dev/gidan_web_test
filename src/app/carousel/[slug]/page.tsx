import type { Metadata } from "next";
import CarouselTypeFilter from '@/views/utilities/CarouselData/CarouselTypeFilter';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | Gidan Plants`,
    description: `Shop ${name.toLowerCase()} online at best prices. Wide range of premium varieties. Fast delivery & easy returns – Gidan.`,
    openGraph: {
      title: `${name} | Gidan Plants`,
      description: `Shop ${name.toLowerCase()} at Gidan, India's trusted online plant store.`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/carousel/${slug}` },
  };
}

export default function CarouselSlugPage() {
  return <CarouselTypeFilter />;
}
