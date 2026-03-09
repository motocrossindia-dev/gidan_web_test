import type { Metadata } from "next";
import PrivacyPolicy from '@/components/Footer/PrivacyPolicy';


export const metadata: Metadata = {
  title: "Privacy Policy | Gidan Store Bangalore",
  description: "Read the privacy policy of Gidan Store. Learn how we collect, use and protect your personal information when shopping on our website.",
  openGraph: {
    title: "Privacy Policy | Gidan Store Bangalore",
    description: "Read the privacy policy of Gidan Store. Learn how we collect, use and protect your personal information when shopping on our website.",
    url: "https://gidanbackendtest.mymotokart.in/privacy-policy",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Gidan Store Bangalore",
    description: "Read the privacy policy of Gidan Store. Learn how we collect, use and protect your personal information when shopping on our website.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
