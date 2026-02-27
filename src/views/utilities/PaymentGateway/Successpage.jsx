'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Successpage = () => {
  const router = useRouter();

  const [countdown, setCountdown] = React.useState(5);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  useEffect(() => {
    // Check if user reached here via a successful payment
    const successFlag = sessionStorage.getItem('recent_payment_success');

    if (!successFlag) {
      // Not authorized to view success page directly
      router.replace("/");
      return;
    }

    // Is authorized!
    setIsAuthorized(true);

    window.scrollTo(0, 0); // Scroll to top on mount

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      sessionStorage.removeItem('recent_payment_success');
      router.push("/orders");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  if (!isAuthorized) {
    return null; // Don't render anything while checking authorization or redirecting
  }

  return (
    <>
      <Helmet>
        <title>Gidan - Success page</title>

        <meta
          name="description"
          content="Thank you for your order at Gidan! Your purchase of plants, pots, seeds, and gardening products has been successfully completed. Track your order in your profile."
        />

        <link
          rel="canonical"
          href="https://www.gidan.store/successpage"
        />
      </Helmet>


      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-semibold text-gray-800"
        >
          Payment Confirmed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mt-2 max-w-md"
        >
          Thank you! Your payment has been successfully processed. Your order is Processing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-gray-500 font-medium"
        >
          Redirecting to orders in <span className="text-green-600 font-bold">{countdown}</span> seconds...
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sessionStorage.removeItem('recent_payment_success');
            router.push("/orders");
          }}
          className="mt-10 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
        >
          Go to Orders Now
        </motion.button>
      </div>
    </>
  );
};

export default Successpage;
