import type { Metadata } from "next";
import Offer from '@/views/utilities/Offer/Offer';
import { fetchOfferProducts } from "@/utils/serverApi";
import CollectionSchema from "@/views/utilities/seo/CollectionSchema";
import StoreSchema from "@/views/utilities/seo/StoreSchema";



export const metadata: Metadata = {
  title: "Plant Offers & Deals in Bangalore | Gidan Store",
  description: "Explore plant offers and deals in Bangalore at Gidan Store. Shop plants, planters and gardening essentials at special discounted prices.",
  openGraph: {
    title: "Plant Offers & Deals in Bangalore | Gidan Store",
    description: "Explore plant offers and deals in Bangalore at Gidan Store. Shop plants, planters and gardening essentials at special discounted prices.",
    url: "https://www.gidan.store/offer",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Offers & Deals in Bangalore | Gidan Store",
    description: "Explore plant offers and deals in Bangalore at Gidan Store. Shop plants, planters and gardening essentials at special discounted prices.",
  },
  alternates: { canonical: "https://www.gidan.store/offer" },
  robots: { index: true, follow: true },
};

export default async function OfferPage() {
  const products = await fetchOfferProducts();

  return (
    <>
      <CollectionSchema
        category={{ name: "Special Offers", slug: "offer" }}
        products={products}
      />
      <StoreSchema />
      <Offer initialOffers={products} />
    </>
  );
}

