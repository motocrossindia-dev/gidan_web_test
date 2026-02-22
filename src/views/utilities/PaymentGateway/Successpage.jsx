'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Successpage = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

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
    href="https://gidan.store/successpage"
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/orders")}
        className="mt-10 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
      >
        Go to Orders
      </motion.button>
    </div>
      </>
  );
};

export default Successpage;
