import React, { useState } from 'react';

const FAQSection = () => {
  const faqs = [
    { question: "What is the return policy?", answer: "You can return within 30 days." },
    { question: "How do I care for indoor plants?", answer: "Water regularly and provide sufficient sunlight." },
    { question: "Do you provide custom pots?", answer: "Yes, we do provide custom pots." },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">FAQs</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <button
              className="w-full text-left text-sm font-medium"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <p className="text-sm text-gray-500 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
