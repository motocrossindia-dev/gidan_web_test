import type { Metadata } from "next";
import PlantFilter from '@/views/utilities/PlantFilter/PlantFilter';

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const catName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const subName = subcategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${subName} - ${catName} | Gidan`,
    description: `Buy ${subName.toLowerCase()} in ${catName.toLowerCase()} category at Gidan. Browse our collection of plants, pots and garden accessories.`,
    openGraph: {
      title: `${subName} - ${catName} | Gidan`,
      description: `Shop ${subName.toLowerCase()} ${catName.toLowerCase()} at Gidan Plants India.`,
      url: `https://www.gidan.store/${categorySlug}/${subcategorySlug}`,
      siteName: "Gidan Plants",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://www.gidan.store/${categorySlug}/${subcategorySlug}` },
  };
}

export default function SubcategoryPage() {
  return <PlantFilter />;
}
