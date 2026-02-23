import type { Metadata } from "next";
import { Suspense } from "react"; // 1. Added Suspense import
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import NavBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/GoogleAnalytics/GoogleAnalytics";
import OrganizationSchema from "@/views/utilities/seo/OrganizationSchema";
import Verify from "@/Services/Services/Verify";
import TawkToWidget from "@/tawkto/tawkto";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gidan.store"),
  title: {
    default: "Gidan - Plants, Seeds & Gardening Store Online India",
    template: "%s | Gidan Plants",
  },
  description:
    "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India.",
  keywords: [
    "buy plants online India",
    "indoor plants",
    "outdoor plants",
    "pots and planters",
    "gardening tools",
    "seeds online",
    "landscaping services",
    "terrace garden",
    "vertical garden",
    "plant gifts",
    "Gidan plants",
  ],
  authors: [{ name: "Gidan Plants", url: "https://www.gidan.store" }],
  creator: "Gidan Plants",
  publisher: "Gidan Plants",
  openGraph: {
    title: "Gidan - Plants, Seeds & Gardening Store Online India",
    description:
      "Buy plants, seeds, pots and gardening tools online at Gidan. Landscaping, terrace gardening and vertical garden services across India.",
    url: "https://www.gidan.store",
    siteName: "Gidan Plants",
    images: [
      {
        url: "https://www.gidan.store/gidan-og.jpg",
        width: 1200,
        height: 630,
        alt: "Gidan Plants - Online Plant Store India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gidan - Plants & Gardening Store",
    description:
      "Buy plants, seeds, pots and gardening tools online at Gidan. Expert garden services across India.",
    images: ["https://www.gidan.store/gidan-og.jpg"],
  },
  alternates: {
    canonical: "https://www.gidan.store",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.ico",
  },
  verification: {
    google: "your-google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. Removed: ReactDOM.preconnect(...) - This is invalid in Next.js Server Components

  return (
    <html lang="en">
      {/* 3. Added standard <head> block for preconnect */}
      <head>
        <link rel="preconnect" href="https://backend.gidan.store" crossOrigin="anonymous" />
      </head>
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <Providers>
          <GoogleAnalytics />
          <OrganizationSchema />
          <Verify />
          <ScrollToTop />
          <TawkToWidget />
          <div className="landing-page-layout w-full min-h-screen flex flex-col overflow-x-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 left-0 w-full z-50">
              <Header />
              <NavBar />
            </div>
            {/* Main Content */}
            <main className="main-content w-full">
              {/* 4. Wrapped children in Suspense to prevent useSearchParams errors */}
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
              <Footer />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}