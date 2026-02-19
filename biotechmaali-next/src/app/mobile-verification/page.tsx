import type { Metadata } from "next";
import Verification from '@/MobileLogin/MobileVerification/Verification';


export const metadata: Metadata = {
  title: "Verify OTP | Gidan Plants",
  description: "Verify your mobile number with OTP to access Gidan Plants.",
  openGraph: {
    title: "Verify OTP | Gidan Plants",
    description: "Verify your mobile number with OTP to access Gidan Plants.",
    url: "https://www.gidan.store/mobile-verification",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify OTP | Gidan Plants",
    description: "Verify your mobile number with OTP to access Gidan Plants.",
  },
  alternates: { canonical: "https://www.gidan.store/mobile-verification" },
  robots: { index: true, follow: true },
};

export default function MobileVerificationPage() {
  return <Verification />;
}
