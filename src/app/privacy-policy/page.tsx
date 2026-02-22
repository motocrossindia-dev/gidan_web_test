import type { Metadata } from "next";
import PrivacyPolicy from '@/components/Footer/PrivacyPolicy';


export const metadata: Metadata = {
  title: "Privacy Policy | Gidan Plants",
  description: "Read Gidan privacy policy to understand how we collect and use your data.",
  openGraph: {
    title: "Privacy Policy | Gidan Plants",
    description: "Read Gidan privacy policy to understand how we collect and use your data.",
    url: "https://www.gidan.store/privacy-policy",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Gidan Plants",
    description: "Read Gidan privacy policy to understand how we collect and use your data.",
  },
  alternates: { canonical: "https://www.gidan.store/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
