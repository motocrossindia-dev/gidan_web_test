import React from "react";
import { FaBullseye, FaBullhorn, FaCheckCircle } from "react-icons/fa"; // Example icons
import { BsMouse } from "react-icons/bs";

const features = [
  {
    title: "Target Audience",
    description:
      "We are a major attraction for youths who are spending more than 6,00,000 minutes in our outlets. In the coming years, we are targeting to reach more cities and to serve more people.",
    icon: <FaBullseye size={40} className="text-black mx-auto mb-4" />,
  },
  {
    title: "Prominence",
    description:
      "We have been covered by major media houses with our success story of becoming a 100-crore company within 6 years of the establishment without any outside investment.",
    icon: <FaBullhorn size={40} className="text-black mx-auto mb-4" />,
  },
  {
    title: "Fresh Concept",
    description:
      "We are a major attraction for youths who are spending more than 6,00,000 minutes in our outlets. In the coming years, we are targeting to reach more cities and to serve more people.",
    icon: <FaCheckCircle size={40} className="text-black mx-auto mb-4" />,
  },
  {
    title: "Brand Value",
    description:
      "We are a major attraction for youths who are spending more than 6,00,000 minutes in our outlets. In the coming years, we are targeting to reach more cities and to serve more people.",
    icon: <BsMouse size={40} className="text-black mx-auto mb-4" />,
  },
];

const FeaturesSection = () => (
  <div className="py-12 bg-gray-100 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 text-center">
      {features.map((feature, index) => (
        <div key={index}>
          {feature.icon}
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-800 text-base">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturesSection;
