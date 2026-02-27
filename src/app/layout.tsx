import type { Metadata, Viewport } from "next";
import ReactDOM from 'react-dom';
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import NavBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/GoogleAnalytics/GoogleAnalytics";

import HomepageSchema from "@/views/utilities/seo/HomepageSchema";
import Head from "next/head";
import Verify from "@/Services/Services/Verify";
import Home from '@/components/Home/Home';

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
    url: "/",
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
    canonical: "/",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ReactDOM.preconnect('https://backend.gidan.store', { crossOrigin: 'anonymous' });

  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NT2JNL5Z');`}
        </Script>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NT2JNL5Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Head>
          <HomepageSchema />
        </Head>
        <Providers>
          <GoogleAnalytics />

          <Verify />
          <ScrollToTop />
          <Script id="tawk-to" strategy="afterInteractive">
            {`
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/699cc6abfaf0a71c36d94cbd/1ji66g3s9';
                s1.charset='UTF-8';s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>
          <div className="landing-page-layout w-full min-h-screen flex flex-col overflow-x-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 left-0 w-full z-[10000]">
              <NavBar />
            </div>
            {/* Main Content */}
            <main className="main-content w-full">
              {children}
              <Footer />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
