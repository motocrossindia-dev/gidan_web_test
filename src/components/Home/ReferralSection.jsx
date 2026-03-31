'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../Axios/axiosInstance';
import WalletImg from '../../Assets/Wallet.webp';
import ReferImg from '../../Assets/ReferAFriend.webp';

const ReferralSection = () => {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [referralCode, setReferralCode] = useState('GIDAAN150');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReferralCode = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const response = await axiosInstance.get("/btcoins/btcoinswallet/");
                    if (response.status === 200 && response.data?.referral_code) {
                        setReferralCode(response.data.referral_code);
                    }
                } catch (error) {
                    console.error('Error fetching referral code:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setReferralCode('GIDAAN150'); // Masked or default placeholder for guests
            }
        };

        fetchReferralCode();
    }, [isAuthenticated]);

    const handleCopy = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign in to view and copy your referral code", { variant: "info" });
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn");
            return;
        }

        navigator.clipboard.writeText(referralCode);
        setIsCopied(true);
        enqueueSnackbar("Referral code copied successfully!", { variant: "success" });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const displayCode = isAuthenticated ? referralCode : 'GIDA****';

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Left Card: How it works */}
                <div className="flex-1 bg-[#fff8ef] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                    {/* Subtle Money Bag Background */}
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                        <img 
                            src={WalletImg?.src || WalletImg} 
                            alt="" 
                            className="w-64 h-64 object-contain translate-x-20 translate-y-20"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center text-center mb-10">
                            <h3 className="text-[#a66a3d] text-4xl md:text-5xl font-serif font-bold mb-2">₹150</h3>
                            <p className="text-[#a66a3d]/70 font-medium tracking-tight">earned per successful referral</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { step: 1, text: "Share your referral code with friends and family" },
                                { step: 2, text: "They place their first order on Gidan.store" },
                                { step: 3, text: "You both earn ₹150 credit — automatically!" }
                            ].map((item) => (
                                <div key={item.step} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#a66a3d]/5">
                                    <div className="w-8 h-8 rounded-full bg-[#d0854d] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                        {item.step}
                                    </div>
                                    <p className="text-[#1a1f14]/70 text-sm md:text-base font-medium">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Call to action */}
                <div className="flex-1 flex flex-col justify-center py-4">
                    <div className="mb-8">
                        <span className="text-[#375421] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block">
                            REFER & EARN
                        </span>
                        <h2 className="text-[36px] md:text-[48px] font-serif text-[#1a1f14] leading-tight mb-4">
                            Share plants. <br />
                            <span className="italic font-normal text-[#375421]">Earn rewards.</span>
                        </h2>
                        <p className="text-[15px] text-[#1a1f14]/60 font-medium max-w-lg leading-relaxed">
                            Turn your love for plants into cash. Every friend you refer earns you both ₹150 store credit — no limit.
                        </p>
                    </div>

                    <div className="max-w-md">
                        <span className="text-[10px] font-bold text-[#1a1f14]/40 uppercase tracking-wider mb-3 block">
                            Your referral code
                        </span>
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 border-2 border-dashed border-[#d0854d]/30 rounded-2xl flex items-center justify-center bg-white min-w-0 p-1">
                                <div className="w-full flex items-center justify-center overflow-hidden">
                                    <span className={`text-[15px] sm:text-[18px] font-serif tracking-[0.15em] sm:tracking-[0.25em] text-[#d0854d] whitespace-nowrap text-center leading-none px-2 py-3.5 truncate uppercase font-black ${loading ? 'opacity-50' : ''}`}>
                                        {displayCode}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="bg-[#d0854d] hover:bg-[#b06f40] text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap shadow-md shadow-[#d0854d]/20 active:scale-95"
                            >
                                {isCopied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                                {isCopied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <p className="text-[12px] text-[#1a1f14]/40 font-medium mt-8 leading-relaxed max-w-md">
                        Share via WhatsApp, Instagram, or email. When your friend makes their first purchase, you both get credited automatically. Valid for unlimited referrals.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ReferralSection;
