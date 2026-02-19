import type { Metadata } from "next";
import EditProfile from '@/views/MobileUser/Edit Profile/EditProfile';


export const metadata: Metadata = {
  title: "Edit Profile | Gidan Plants",
  description: "Update your name, email and profile details on Gidan.",
  openGraph: {
    title: "Edit Profile | Gidan Plants",
    description: "Update your name, email and profile details on Gidan.",
    url: "https://www.gidan.store/mobilesidebar/editprofile",
    siteName: "Gidan Plants",
    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Profile | Gidan Plants",
    description: "Update your name, email and profile details on Gidan.",
  },
  alternates: { canonical: "https://www.gidan.store/mobilesidebar/editprofile" },
  robots: { index: true, follow: true },
};

export default function EditProfilePage() {
  return <EditProfile />;
}
