import React, { useState } from "react";


const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    "How tall does the Peace Lily Plant grow?",
    "What are the common names of Peace Lily Plant?",
    "What are the common names of Bamboo Palm Plant?",
    "How much sunlight does a Bamboo Palm Plant need?",
  ];

  return (
    <div className="container mx-auto p-4 rounded-lg"> {/* Wrap everything in a single div */}
      <h2 className="text-2xl font-bold text-center mb-4">FAQ'S</h2>
      {/* Heading for the FAQ section */}
      <div className="border border-gray-500 rounded-lg"> {/* Added border here */}
        {faqItems.map((item, index) => (
          <div key={index} className="border-b last:border-b-0 "> {/* Removed bottom border for the last item */}
            <button
              className="w-full text-left p-4 flex justify-between items-center rounded-lg bg-white hover:bg-gray-200 focus:outline-none"
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
    </div>
  );
};

export default FAQSection;
