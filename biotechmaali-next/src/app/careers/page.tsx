import type { Metadata } from "next";
import Carriers from '@/views/utilities/Carriers/Carriers';


export const metadata: Metadata = {
  title: "Careers at Gidan | Join Our Green Team",
  description: "Explore exciting job opportunities at Gidan - India growing plants and gardening brand.",
  openGraph: {
    title: "Careers at Gidan | Join Our Green Team",
    description: "Explore exciting job opportunities at Gidan - India growing plants and gardening brand.",
    url: "https://www.gidan.store/careers",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Gidan | Join Our Green Team",
    description: "Explore exciting job opportunities at Gidan - India growing plants and gardening brand.",
  },
  alternates: { canonical: "https://www.gidan.store/careers" },
  robots: { index: true, follow: true },
};

export default function CareersPage() {
  return <Carriers />;
}
