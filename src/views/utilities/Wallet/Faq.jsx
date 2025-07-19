import { FaChevronDown } from "react-icons/fa"; // Make sure this is imported

const faqs = [
  "What happens when I update my email address (or mobile number)?",
  "What happens when I update my email address (or mobile number)?",
  "What happens when I update my email address (or mobile number)?",
  "What happens when I update my email address (or mobile number)?",
];

export default function FAQSection() {
  return (
    <div className="mb-6 px-4">
      <h2 className="text-lg font-semibold mb-4">FAQ’s</h2>
      <div className="border border-gray-300 divide-y divide-gray-300 rounded">
        {faqs.map((question, idx) => (
          <details
            key={idx}
            className="group"
          >
            <summary className="flex justify-between items-center cursor-pointer px-4 py-3 text-sm sm:text-base font-medium text-gray-700 hover:text-black">
              <span>{question}</span>
              <FaChevronDown className="transition-transform duration-200 group-open:rotate-180 text-sm sm:text-base" />
            </summary>
            <div className="px-4 pb-4 text-gray-600 text-sm">
              When you update your email or mobile number, we’ll send a verification link or OTP to confirm it. Once verified, your new details will be updated in your account.
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
