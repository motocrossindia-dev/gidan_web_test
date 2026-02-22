import type { Metadata } from "next";
import MobileLoginPage from '@/MobileLogin/MobileLoginPage/MobileLoginPage';


export const metadata: Metadata = {
  title: "Login | Gidan Plants",
  description: "Login to your Gidan account with your mobile number.",
  openGraph: {
    title: "Login | Gidan Plants",
    description: "Login to your Gidan account with your mobile number.",
    url: "https://www.gidan.store/mobile-login",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Gidan Plants",
    description: "Login to your Gidan account with your mobile number.",
  },
  alternates: { canonical: "https://www.gidan.store/mobile-login" },
  robots: { index: true, follow: true },
};

export default function MobileLoginPageRoute() {
  return <MobileLoginPage />;
}
