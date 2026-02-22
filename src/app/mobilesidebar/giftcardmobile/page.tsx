import type { Metadata } from "next";
import Comingsoon from '@/views/utilities/Gifts/Comingsoon';


export const metadata: Metadata = {
  title: "Gift Card | Gidan Plants",
  description: "Manage your Gidan gift cards and view balance.",
  openGraph: {
    title: "Gift Card | Gidan Plants",
    description: "Manage your Gidan gift cards and view balance.",
    url: "https://www.gidan.store/mobilesidebar/giftcardmobile",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Card | Gidan Plants",
    description: "Manage your Gidan gift cards and view balance.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/giftcardmobile" },
  robots: { index: true, follow: true },
};

export default function GiftCardMobilePage() {
  return <Comingsoon />;
}
