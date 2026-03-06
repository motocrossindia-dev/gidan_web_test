'use client';



import React from "react";
import { FaChevronLeft, FaChevronRight,FaChevronDown } from "react-icons/fa";
import __Gift1 from "../../../Assets/Gift/Gift1.webp";
const _Gift1 = typeof __Gift1 === 'string' ? __Gift1 : __Gift1?.src || __Gift1;
const Gift1 = typeof _Gift1 === 'string' ? _Gift1 : _Gift1?.src || _Gift1;
import __Gift2 from "../../../Assets/Gift/Gift2.webp";
const _Gift2 = typeof __Gift2 === 'string' ? __Gift2 : __Gift2?.src || __Gift2;
const Gift2 = typeof _Gift2 === 'string' ? _Gift2 : _Gift2?.src || _Gift2;
import __Gift3 from "../../../Assets/Gift/Gift3.webp";
const _Gift3 = typeof __Gift3 === 'string' ? __Gift3 : __Gift3?.src || __Gift3;
const Gift3 = typeof _Gift3 === 'string' ? _Gift3 : _Gift3?.src || _Gift3;

// Header Component
const Header = () => (
  <header className="bg-gray-200">
    <img name=" "    className="w-full h-[450px] object-cover" src={Gift1} alt="Header" loading="lazy"/>
  </header>
);

// Shop By Section Component
const ShopBySection = () => (
  <section className="w-full my-8 px-4">
    <h2 className="text-3xl font-semibold mb-6 text-center">Shop By</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { src: Gift2, alt: "Birthday Gifts", label: "Birthday Gifts" },
        { src: Gift2, alt: "Anniversary Gifts", label: "Anniversary Gifts" },
        { src: Gift2, alt: "Thank You Gifts", label: "Thank You Gifts" },
        { src: Gift2, alt: "House Warming Plants", label: "House Warming Plants" },
      ].map((item, index) => (
        <div key={index} className="text-center bg-white rounded-lg shadow-lg p-4">
          <img name=" "    className="w-[290px] h-[350px] object-cover rounded-md" src={item.src} loading="lazy" alt={item.alt} />
          <p className="mt-4 text-lg font-medium text-gray-700">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);

// Product Card Component
const ProductCard = ({ product }) => (
  <div className="bg-white shadow-md rounded-lg p-4 min-w-[200px] text-center">
    <img name=" "    src={Gift3} loading="lazy" alt={product.name} className="w-[145px] h-[198px] object-cover rounded-md mx-auto" />
    <h3 className="mt-4 text-sm font-medium">{product.name}</h3>
    <p className="text-gray-500">{product.price}</p>
    <div className="flex justify-center items-center mt-4 text-yellow-500">
      {"★".repeat(Math.round(product.rating))}
      {"☆".repeat(5 - Math.round(product.rating))}
    </div>
  </div>
);

// Products Section Component
const ProductsSection = ({ title, products }) => (
  <section className="p-6 bg-white-100 w-full">
    <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
    <div className="flex gap-6 overflow-x-auto">
      {products.map((product) => (
        
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    <div className="flex justify-center mt-6">
      <button className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-full mx-2 border">
        <FaChevronLeft className="text-gray-500" />
      </button>
      <button className="bg-green-600 text-white w-[120px] h-[40px] rounded-full mx-2 font-semibold">
        View All
      </button>
      <button className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-full mx-2 border">
        <FaChevronRight className="text-gray-500" />
      </button>
    </div>
  </section>
);

// FAQ Accordion Component
const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = React.useState(null);

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
    <div className="container mx-auto p-6">
      {faqItems.map((item, index) => (
        <div key={index} className="border-b">
          <button
            className="w-full text-left p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-gray-700">{item}</span>
            <span className="text-gray-700">
              {activeIndex === index ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
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

// Main Gifts Component
const Gifts = () => {
  const products = [
    {
      id: 1,
      name: "Peace Lily Plant",
      price: "₹420.00",
      OldPrice: "₹500.00",
      imageUrl: "https://via.placeholder.com/150",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Peace Lily Plant",
      price: "₹420.00",
      OldPrice: "₹500.00",
      imageUrl: "https://via.placeholder.com/150",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Peace Lily Plant",
      price: "₹420.00",
      OldPrice: "₹500.00",
      imageUrl: "https://via.placeholder.com/150",
      rating: 4.5,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="text-sm text-gray-500 mb-4">
        Home / <span className="text-green-500">gifts</span>
      </div>
      <Header />
      <ShopBySection />
      <ProductsSection title="Raksha Bandhan Special" products={products} />
      <ProductsSection title="Best Seller" products={products} />
      <ProductsSection title="Recently Viewed" products={products} />
      <FaqAccordion />
    </div>
  );
};

export default Gifts;
