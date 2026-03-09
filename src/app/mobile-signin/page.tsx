import type { Metadata } from "next";
import MobileSignIn from '@/MobileLogin/MobileSignIn/MobileSignIn';


export const metadata: Metadata = {
  title: "Sign In | Gidan Plants",
  description: "Sign in to your Gidan Plants account.",
  openGraph: {
    title: "Sign In | Gidan Plants",
    description: "Sign in to your Gidan Plants account.",
    url: "https://gidanbackendtest.mymotokart.in/mobile-signin",
    siteName: "Gidan Plants",
    images: [{ url: "https://gidanbackendtest.mymotokart.in/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Gidan Plants",
    description: "Sign in to your Gidan Plants account.",
  },
  alternates: { canonical: "https://gidanbackendtest.mymotokart.in/mobile-signin" },
  robots: { index: true, follow: true },
};

export default function MobileSignInPage() {
  return <MobileSignIn />;
}
