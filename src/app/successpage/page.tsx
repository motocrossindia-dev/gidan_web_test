import type { Metadata } from "next";
import Successpage from '@/views/utilities/PaymentGateway/Successpage';


export const metadata: Metadata = {
  title: "Successpage | Gidan Plants",
  description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Successpage | Gidan Plants",
    description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/successpage",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Successpage | Gidan Plants",
    description: "Shop and explore successpage at Gidan, India trusted online plant and gardening store.",
  },
  alternates: { canonical: "https://www.gidan.store/successpage" },
  robots: { index: true, follow: true },
};

export default function SuccessPage() {
  return <Successpage />;
}
