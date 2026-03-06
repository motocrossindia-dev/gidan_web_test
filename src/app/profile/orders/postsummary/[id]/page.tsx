import type { Metadata } from "next";
import PostSummaryView from '@/views/utilities/My Orders/PostSummaryView';

export const metadata: Metadata = {
  title: "Order Summary | Gidan Plants",
  description: "View your order summary, payment details and tracking information.",
  robots: { index: false, follow: false },
};

export default function ProfilePostSummaryPage() {
  return <PostSummaryView />;
}
