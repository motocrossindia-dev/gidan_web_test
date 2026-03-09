import type { Metadata } from "next";
import OurWork from '@/views/utilities/OurWork/OurWork';


export const metadata: Metadata = {
  title: "Our Work | Gidan Landscaping Portfolio",
  description: "See portfolio of landscaping, terrace gardens and vertical garden installations by Gidan.",
  openGraph: {
    title: "Our Work | Gidan Landscaping Portfolio",
    description: "See portfolio of landscaping, terrace gardens and vertical garden installations by Gidan.",
    url: "https://gidanbackendtest.mymotokart.in/ourwork",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Gidan Landscaping Portfolio",
    description: "See portfolio of landscaping, terrace gardens and vertical garden installations by Gidan.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/ourwork" },
  robots: { index: true, follow: true },
};

export default function OurWorkPage() {
  return <OurWork />;
}
