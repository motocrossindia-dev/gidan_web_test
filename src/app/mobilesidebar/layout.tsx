import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function MobileSidebarLayout({ children }: { children: ReactNode }) {
  redirect('/profile');
}
