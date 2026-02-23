'use client';

import dynamic from 'next/dynamic';

const BTcoins = dynamic(() => import('@/views/utilities/Wallet/BTcoins'), { ssr: false });

export default function BTcoinsClient() {
    return <BTcoins />;
}
