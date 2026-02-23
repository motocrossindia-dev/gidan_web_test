'use client';

import React, { useState, useEffect } from "react";
import __combooffer from "../../../Assets/ComboOffer/combooffer.png";
const _combooffer = typeof __combooffer === 'string' ? __combooffer : __combooffer?.src || __combooffer;
const combooffer = typeof _combooffer === 'string' ? _combooffer : _combooffer?.src || _combooffer;
import ComboImage from './ComboImage.jsx';
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import { Helmet } from "react-helmet-async";

const ComboOffer = () => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  return (
    <>
      <Helmet>
        <title>Gidan - Combo Offers</title>

        <meta
          name="description"
          content="Explore combo offers at Gidan and save more on plants, pots, seeds, and plant care products. Grab the best gardening deals in one place."
        />

        <link
          rel="canonical"
          href="https://www.gidan.store/combooffer"
        />
      </Helmet>

      <div>
        {/* Combo Offer Section */}
        <div className="container mx-auto p-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            Home / <span className="text-blue-500">Combo Offers</span>
          </div>

          {/* Image and Heading Section */}
          <div className="bg-gray-200  rounded-md ">
            {/* Container for Image and Text */}
            <div className="flex justify-between items-center">
              {/* Heading */}
              <h2 className="text-2xl md:text-4xl font-normal text-green-600 text-center md:px-36">
                Explore the combo Below
              </h2>
              {/* Dummy Image */}
              <img name=" "
                src={combooffer}
                loading="lazy"
                alt="combo offer"
                className="md:w-[230px] h-[200px] w-[150px] object-cover "
              />
            </div>
          </div>

          {/* Combo Image Section */}
          <ComboImage />
          <RecentlyViewedProducts />
          {/* <FaqAccordion /> */}
        </div>
      </div>
    </>
  );
};

export default ComboOffer;

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    "How tall does the Peace Lily Plant grow?",
    "What are the common names of the Peace Lily Plant?",
    "What are the common names of the Bamboo Palm Plant?",
    "What are the common names of the Bamboo Palm Plant?",
  ];

  return (
    <div className="container mx-auto p-4">
      {faqItems.map((item, index) => (
        <div key={index} className="border-b">
          <button
            className="w-full text-left p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-gray-700">{item}</span>
            <span className="text-gray-700">
              {activeIndex === index ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10a1 1 0 011.707 0L10 13.293 13.293 10a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 015 10z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 00-.707.293l-4 4a1 1 0 001.414 1.414L10 7.414l3.293 3.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </button>
          {activeIndex === index && (
            <div className="p-4 text-gray-600">
              This is the answer or more details about "{item}".
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ComboOffer Component

