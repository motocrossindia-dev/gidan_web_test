import type { Metadata } from "next";
import TermsofServices from '@/components/Footer/TermsofServices';


export const metadata: Metadata = {
  title: "Terms | Gidan Plants",
  description: "Shop and explore terms at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Terms | Gidan Plants",
    description: "Shop and explore terms at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/terms",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms | Gidan Plants",
    description: "Shop and explore terms at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsofServices />;
}
