// import { FaChevronDown } from "react-icons/fa"; // Make sure this is imported

// const faqs = [
//   "What happens when I update my email address (or mobile number)?",
//   "What happens when I update my email address (or mobile number)?",
//   "What happens when I update my email address (or mobile number)?",
//   "What happens when I update my email address (or mobile number)?",
// ];

// export default function FAQSection() {
//   return (
//     <div className="mb-6 px-4">
//       <h2 className="text-lg font-semibold mb-4">FAQ’s</h2>
//       <div className="border border-gray-300 divide-y divide-gray-300 rounded">
//         {faqs.map((question, idx) => (
//           <details
//             key={idx}
//             className="group"
//           >
//             <summary className="flex justify-between items-center cursor-pointer px-4 py-3 text-sm sm:text-base font-medium text-gray-700 hover:text-black">
//               <span>{question}</span>
//               <FaChevronDown className="transition-transform duration-200 group-open:rotate-180 text-sm sm:text-base" />
//             </summary>
//             <div className="px-4 pb-4 text-gray-600 text-sm">
//               When you update your email or mobile number, we’ll send a verification link or OTP to confirm it. Once verified, your new details will be updated in your account.
//             </div>
//           </details>
//         ))}
//       </div>
//     </div>
//   );
// }


import React,{useEffect} from "react";

const Faq = () => {
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

export default Faq;


