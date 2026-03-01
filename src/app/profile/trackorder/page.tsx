import type { Metadata } from "next";
import TrackOrder from '@/views/Users/TrackOrder/TrackOrder';


export const metadata: Metadata = {
  title: "Profile - Trackorder | Gidan Plants",
  description: "Shop and explore profile - trackorder at Gidan, India trusted online plant and gardening store.",
  openGraph: {
    title: "Profile - Trackorder | Gidan Plants",
    description: "Shop and explore profile - trackorder at Gidan, India trusted online plant and gardening store.",
    url: "https://www.gidan.store/profile/trackorder",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - Trackorder | Gidan Plants",
    description: "Shop and explore profile - trackorder at Gidan, India trusted online plant and gardening store.",
  },
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return <TrackOrder />;
}
