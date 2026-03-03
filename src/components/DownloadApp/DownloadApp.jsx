'use client';

import React from "react";
import Image from "next/image";

const DownloadApp = () => {
  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="text-black text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Download Our App
          </h2>
          <p className="text-black text-base md:text-lg max-w-md">
            Shop plants, gifts & more on the go. Get exclusive app-only deals,
            track your orders in real-time, and enjoy a seamless shopping
            experience.
          </p>
        </div>

        {/* App Icon + Badges */}
        <div className="flex flex-col items-center gap-4">
          {/* App Icon */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <Image
              src="/android-chrome-192x192.png"
              alt="Gidan App Icon"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            {/* Google Play Badge */}
            <a
              href="https://play.google.com/store/apps/details?id=com.biotechmaali.app&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
            >
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-14 w-auto hover:opacity-90 transition-opacity drop-shadow-md"
              />
            </a>

            {/* App Store Badge */}
            <a
              href="https://apps.apple.com/in/app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="flex items-center"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-10 w-auto hover:opacity-90 transition-opacity drop-shadow-md"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
