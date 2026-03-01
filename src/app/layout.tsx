import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";
import NavBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";

import Verify from "@/Services/Services/Verify";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: 'swap',
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
  manifest: (process.env.NEXT_PUBLIC_BASE_URL || "https://www.gidan.store") + "/manifest.json",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://backend.gidan.store" />


        {/* Razorpay Checkout */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-T4GR7HMTN6" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T4GR7HMTN6');
          `}
        </Script>

        {/* Theme-based Logo and Service Worker Cleanup */}
        <Script id="theme-logo-sw-cleanup" strategy="beforeInteractive">
          {`
            (function() {
              // Logo/Favicon helper
              function updateLogoByTheme(isDark) {
                  const favicon = document.querySelector('link[rel="icon"]');
                  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
                  const baseUrl = window.location.origin;
                  const ts = new Date().getTime();
                  const logo = isDark 
                      ? baseUrl + "/logo-white.webp?v=" + ts 
                      : baseUrl + "/logo.webp?v=" + ts;
                  if (favicon) favicon.href = logo;
                  if (appleIcon) appleIcon.href = logo;
              }
              const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
              updateLogoByTheme(darkModeQuery.matches);
              darkModeQuery.addEventListener("change", function(e) { updateLogoByTheme(e.matches); });

              // SW Cleanup
              if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for(let registration of registrations) { registration.unregister(); }
                  });
              }

              // Rogue GTM text cleanup (Ultra-Aggressive)
              // Root Cause: GTM Custom HTML tag missing <script> tags.
              (function() {
                const clean = (node) => {
                  if (!node) return;
                  if (node.nodeType === 3) { // Text Node
                    const text = node.textContent || "";
                    if (text.includes("fbq('track'") || (text.includes("ViewContent") && text.includes("[object Object]"))) {
                      if (node.parentNode && !['SCRIPT', 'STYLE', 'HEAD'].includes(node.parentNode.tagName)) {
                        node.textContent = "";
                      }
                    }
                  } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'HEAD'].includes(node.tagName)) {
                    // Quick check on element text
                    const text = node.textContent || "";
                    if (text.includes("fbq('track'") || text.includes("[object Object]")) {
                      const walker = document.createTreeWalker(node, 4, null, false);
                      let n;
                      while(n = walker.nextNode()) {
                        const t = n.textContent || "";
                        if (t.includes("fbq('track'") || (t.includes("ViewContent") && t.includes("[object Object]"))) {
                           if (n.parentNode && !['SCRIPT', 'STYLE', 'HEAD'].includes(n.parentNode.tagName)) {
                             n.textContent = "";
                           }
                        }
                      }
                    }
                  }
                };

                if (typeof window !== 'undefined') {
                  // Initial scan
                  if (document.documentElement) clean(document.documentElement);

                  const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                      if (m.type === 'childList') {
                        m.addedNodes.forEach(clean);
                      } else if (m.type === 'characterData') {
                        clean(m.target);
                      }
                    }
                  });

                  observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    characterData: true
                  });
                  
                  // Secondary cleanup on window load (GTM sometimes injects late)
                  window.addEventListener('load', () => clean(document.body));
                }
              })();
            })();
          `}
        </Script>
      </head>
      <body className={`${nunitoSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NT2JNL5Z');`}
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
          <Verify />
          <ScrollToTop />
          <Script id="tawk-to" strategy="lazyOnload">
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
            <div className="sticky top-0 left-0 w-full z-[10000]">
              <NavBar />
            </div>
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
