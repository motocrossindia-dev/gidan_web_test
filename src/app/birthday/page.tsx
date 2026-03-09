import type { Metadata } from "next";
import BirthdayGifts from '@/views/utilities/BirthdayGifts/BirthdayGifts';


export const metadata: Metadata = {
  title: "Birthday Gift Plants and Pots | Gidan",
  description: "Surprise your loved ones with beautiful plants and personalised pots as birthday gifts.",
  openGraph: {
    title: "Birthday Gift Plants and Pots | Gidan",
    description: "Surprise your loved ones with beautiful plants and personalised pots as birthday gifts.",
    url: "https://gidanbackendtest.mymotokart.in/birthday",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthday Gift Plants and Pots | Gidan",
    description: "Surprise your loved ones with beautiful plants and personalised pots as birthday gifts.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/birthday" },
  robots: { index: true, follow: true },
};

export default function BirthdayPage() {
  return <BirthdayGifts />;
}
