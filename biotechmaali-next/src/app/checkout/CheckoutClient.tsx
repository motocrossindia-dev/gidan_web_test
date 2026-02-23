'use client';

import dynamic from 'next/dynamic';

const CheckoutPage = dynamic(() => import('@/views/utilities/CheckoutPage/CheckoutPage'), { ssr: false });

export default function CheckoutClient() {
    return <CheckoutPage />;
}
