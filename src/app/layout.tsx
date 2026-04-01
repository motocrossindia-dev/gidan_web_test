import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import NavBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import DownloadAppPopup from "@/components/DownloadApp/DownloadAppPopup";
import ScrollToTop from "@/components/ScrollToTop";
import StaticBreadcrumb from "@/components/Shared/StaticBreadcrumb";
import MobileBottomNav from "@/components/Shared/MobileBottomNav";
import TawkChat from "@/components/Shared/TawkChat";
import CartWishlistSidebar from "@/components/Shared/CartWishlistSidebar";
import TopLoader from "@/components/Shared/TopLoader";
import React, { Suspense } from "react";

import Verify from "@/Services/Services/Verify";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
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
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://www.gidan.store",
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
  manifest: "/manifest.json",
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for LCP image origin — crossOrigin required for next/image CORS requests */}
        <link rel="preconnect" href="https://backend.gidan.store" crossOrigin="anonymous" />
        {/* DNS prefetch for 3rd-party origins — zero-cost hint to unblock connections */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* 1. Critical Header: Unregister any legacy Service Workers to prevent stale HTML/CSS caching which causes "Application Errors" on mobile */}
        <Script id="sw-cleanup" strategy="beforeInteractive">
          {`if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){regs.forEach(function(reg){reg.unregister();});});}`}
        </Script>

        {/* 2. Theme Management: Ensure favicon and logo match browser color scheme immediately */}
        <Script id="theme-logo" strategy="beforeInteractive">
          {`(function(){function u(d){var f=document.querySelector('link[rel="icon"]'),a=document.querySelector('link[rel="apple-touch-icon"]'),o=location.origin;if(f)f.href=o+(d?'/logo-white.webp':'/logo.webp');if(a)a.href=o+(d?'/logo-white.webp':'/logo.webp');}var m=window.matchMedia('(prefers-color-scheme: dark)');u(m.matches);m.addEventListener('change',function(e){u(e.matches);});})();`}
        </Script>

        {/* 3. DOM Guard: Prevents external trackers from modifying the DOM which breaks React hydration */}
        <Script id="dom-guard" strategy="afterInteractive">
          {`(function(){
              function bad(t){return t&&(t.includes("fbq('track'")||t.includes('ViewContent'));}
              function clean(n){if(n&&n.nodeType===3&&bad(n.textContent))n.parentNode.removeChild(n);}
              if(window.MutationObserver){new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='childList')m.addedNodes.forEach(clean);});}).observe(document.documentElement,{childList:true,subtree:true});}
            })();`}
        </Script>
      </head>
      <body className={`${nunitoSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager - GA4 is managed via GTM container */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NT2JNL5Z');
          `}
        </Script>
        {/* Noscript fallbacks */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NT2JNL5Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Providers>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <Verify />
          <CartWishlistSidebar />
          <ScrollToTop />
          <DownloadAppPopup />
          <TawkChat />
          
          <div className="sticky top-0 left-0 w-full z-[1000] bg-white">
            <Header />
            <NavBar />
          </div>

          <div className="landing-page-layout w-full min-h-screen flex flex-col relative">
            <main className="main-content w-full">
              <div className="hidden md:block">
                <Suspense fallback={null}>
                  <StaticBreadcrumb />
                </Suspense>
              </div>
              {children}
              <Footer />
            </main>
          </div>
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
