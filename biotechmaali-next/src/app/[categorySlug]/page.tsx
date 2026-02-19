import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const name = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Plants | Gidan`,
    description: `Shop ${name.toLowerCase()} plants, pots and gardening products at Gidan. Wide variety, great prices and fast delivery across India.`,
    openGraph: {
      title: `${name} Plants | Gidan`,
      description: `Shop ${name.toLowerCase()} plants and accessories at Gidan, India's trusted online plant store.`,
      url: `https://www.gidan.store/${categorySlug}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}` },
  };
}

export default function CategoryPage() {
  return <PlantFilter />;
}
