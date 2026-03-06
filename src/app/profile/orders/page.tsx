import type { Metadata } from "next";
import MyOrders from '@/views/utilities/My Orders/MyOrders';

export const metadata: Metadata = {
  title: "My Orders | Gidan Plants",
  description: "View and manage your orders at Gidan.",
  alternates: { canonical: "https://www.gidan.store/profile/orders" },
  robots: { index: false, follow: false },
};

export default function ProfileOrdersPage() {
  return <MyOrders />;
}
