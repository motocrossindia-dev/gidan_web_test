// import React, { useState } from "react";

// const FaqAccordion = () => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleAccordion = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const faqItems = [
//     "How tall does the Peace Lily Plant grow?",
//     "What are the common names of Peace Lily Plant?",
//     "What are the common names of Bamboo Palm Plant?",
//     "How much sunlight does a Bamboo Palm Plant need?",
//   ];

//   return (
//     <div className="container mx-auto p-1 md:px-20">
//       {" "}
//       {/* Wrap everything in a single div */}
//       <h2 className="md:text-2xl text-xl mb-4 text-left md:font font-sans">FAQ'S</h2>{" "}
//       {/* Heading for the FAQ section */}
//       <div className="border border-gray-500 rounded-lg w-full ">
//         {" "}
//         {/* Added border here */}
//         {faqItems.map((item, index) => (
//           <div key={index} className="border-b last:border-b-0">
//             {" "}
//             {/* Removed bottom border for the last item */}
//             <button
//               className="w-full text-left p-4 flex justify-between rounded-lg items-center bg-white hover:bg-gray-200 focus:outline-none"
//               onClick={() => toggleAccordion(index)}
//             >
//               <span className="text-gray-700">{item}</span>
//               <span className="text-gray-700">
//                 {activeIndex === index ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5 10a1 1 0 011.707 0L10 13.293 13.293 10a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 015 10z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 5a1 1 0 00-.707.293l-4 4a1 1 0 001.414 1.414L10 7.414l3.293 3.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 5z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 )}
//               </span>
//             </button>
//             {activeIndex === index && (
//               <div className="p-4 text-gray-600">
//                 This is the answer or more details about "{item}".
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FaqAccordion;


import React,{useEffect} from "react";


const FaqAccordion = () => {
      useEffect(() => {
      window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);
  return (
      <>
          
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions (FAQs)</h1>

      {/* Question 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. How are the plants packaged for shipping?</h2>
        <p>
          We use eco-friendly, sturdy packaging designed to keep your plant safe and secure during transit. Each plant is carefully wrapped and supported to prevent movement or damage.
        </p>
      </section>

      {/* Question 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Will my plant look exactly like the picture?</h2>
        <p>
          While we do our best to match the product image, each plant is unique. Variations in size, shape, and color are natural. Rest assured, you’ll receive a healthy plant of the same species.
        </p>
      </section>

      {/* Question 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. What if my plant arrives damaged?</h2>
        <p>
          If your plant arrives damaged, please contact us within 24 hours with photos of the package and plant. We’ll evaluate the issue and offer a replacement or refund as appropriate.
        </p>
      </section>

      {/* Question 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. How do I care for my plant once it arrives?</h2>
        <p>
          Each plant comes with a basic care guide. You’ll also find detailed care instructions on our website under the product page. If you need help, feel free to reach out to our support team.
        </p>
      </section>

      {/* Question 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Do you ship all over India?</h2>
        <p>
          Yes, we ship to most pin codes across India. However, delivery might not be possible in remote locations due to courier limitations. If you're unsure, contact us to confirm service availability.
        </p>
      </section>

      {/* Question 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Can I cancel or modify my order?</h2>
        <p>
          Orders can be canceled or modified only before they are shipped. Please contact us immediately if you need to make changes. Once dispatched, modifications aren’t possible.
        </p>
      </section>

      {/* Question 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. What types of plants do you sell?</h2>
        <p>
          We offer a wide variety of indoor plants, outdoor plants, succulents, flowering plants, and air-purifying plants. Each product listing includes details about ideal conditions and maintenance.
        </p>
      </section>

      {/* Question 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Can I gift plants to someone?</h2>
        <p>
          Absolutely! During checkout, you can mark your order as a gift and include a personalized message. We’ll ensure your gift is packed beautifully and delivered on time.
        </p>
      </section>
    </div>
          </>
  );
};

export default FaqAccordion;

