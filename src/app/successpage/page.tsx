import type { Metadata } from "next";
import Successpage from '@/views/utilities/Successpage/Successpage';


export const metadata: Metadata = {
  title: "Successpage | Gidan Plants",
  description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Successpage | Gidan Plants",
    description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
    url: "https://gidanbackendtest.mymotokart.in/successpage",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Successpage | Gidan Plants",
    description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/successpage" },
  robots: { index: true, follow: true },
};

export default function SuccessPage() {
  return <Successpage />;
}
