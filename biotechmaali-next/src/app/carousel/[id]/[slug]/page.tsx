import type { Metadata } from "next";
import CarouselData from '@/views/utilities/CarouselData/CarouselData';

type Props = { params: Promise<{ id: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Plants | Gidan`,
    description: `Shop ${name.toLowerCase()} plants and gardening products at Gidan. Expert quality, fast delivery across India.`,
    openGraph: {
      title: `${name} | Gidan Plants`,
      description: `Shop ${name.toLowerCase()} at Gidan, India's trusted online plant store.`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function CarouselPage() {
  return <CarouselData />;
}
