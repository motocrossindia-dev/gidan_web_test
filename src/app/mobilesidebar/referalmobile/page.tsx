import type { Metadata } from "next";
import ReferAFriend from '@/views/Users/ReferAFriend/ReferAFriend';


export const metadata: Metadata = {
  title: "Referral Program | Gidan Plants",
  description: "Refer friends and earn rewards with the Gidan referral program.",
  openGraph: {
    title: "Referral Program | Gidan Plants",
    description: "Refer friends and earn rewards with the Gidan referral program.",
    url: "https://www.gidan.store/mobilesidebar/referalmobile",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Referral Program | Gidan Plants",
    description: "Refer friends and earn rewards with the Gidan referral program.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/referalmobile" },
  robots: { index: true, follow: true },
};

export default function ReferalMobilePage() {
  return <ReferAFriend />;
}
