import type { Metadata } from "next";
import OrderDetailsView from '@/views/utilities/My Orders/OrderDetailsView';

export const metadata: Metadata = {
  title: "Order Details | Gidan Plants",
  description: "View your order summary, tracking details and item information.",
  robots: { index: false, follow: false },
};

export default function ProfileOrderDetailsPage() {
  return <OrderDetailsView />;
}
