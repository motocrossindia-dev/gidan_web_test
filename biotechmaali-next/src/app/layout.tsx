import type { Metadata } from "next";
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

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Biotechmaali - Plants & Gardening Store",
  description:
    "Shop plants, seeds, pots, gardening tools and services at Biotechmaali. Landscaping, terrace gardening, vertical gardens and more.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <Providers>
          <GoogleAnalytics />
          <OrganizationSchema />
          <Verify />
          <ScrollToTop />
          <div className="landing-page-layout w-full min-h-screen flex flex-col overflow-x-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 left-0 w-full z-50">
              <Header />
              <NavBar />
            </div>
            {/* Main Content */}
            <main className="main-content w-full overflow-x-hidden">
              {children}
              <Footer />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
