import React, { useEffect } from 'react';
import { Mail, Phone, } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (


      <>
        <Helmet>
  <title>Gidan - Refund Policy</title>

  <meta
    name="description"
    content="Read Gidan's refund and return policy. Understand how to return products, request refunds, and ensure a smooth shopping experience for plants and gardening items."
  />

  <link
    rel="canonical"
    href="https://gidan.store/return"
  />
</Helmet>

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
          <h1 className="text-4xl font-bold text-center mb-4">Refund Policy</h1>
          <p className="text-center text-green-100 text-lg">
            Your satisfaction is our priority at Gidan
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          {/* Introduction */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              At <span className="font-semibold text-green-700">Gidan</span>, we take great care in delivering healthy and thriving plants.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, due to the nature of live plants, it is common for them to show minor signs of stress (such as slight drooping or yellowing leaves) during transit. Rest assured, with proper care, your plant will quickly recover and flourish in its new environment.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Natural variations occur in plants, and factors like size, shape, and color may differ slightly from the images shown on our website. These differences reflect each plant's unique growth pattern and do not affect its quality or health.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Thank you for your understanding and for choosing <span className="font-semibold text-green-700">Farm Amino Agritech Private Limited</span> to bring greenery into your space!
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4 text-center">Get in Touch</h3>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Mail className="w-5 h-5" />
                <a href="mailto:info@gidan.store" className="hover:text-emerald-900 transition-colors">
                  info@gidan.store
                </a>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700">
                <Phone className="w-5 h-5" />
                <a href="tel:+917892078318" className="hover:text-emerald-900 transition-colors">
                  +91 7483316150
                </a>
              </div>
            </div>
          </div>

          {/* Replacement Policy */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Gidan Replacement Policy
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                  Eligibility for Replacement
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">The product is damaged or not in usable condition upon arrival</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">The wrong item was delivered</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                  How to Request a Replacement
                </h3>
                <div className="ml-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <p className="text-gray-700 mb-2">
                      Contact us on <span className="font-semibold text-blue-700">+91 7483316150</span> within 24 hours of delivery with:
                    </p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">Clear images/short video of the damaged product and packaging</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">Your order number and details of the issue</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-3 ml-4">Our team will review the request and confirm the replacement.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                  Replacement Process
                </h3>
                <ul className="space-y-3 ml-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Once approved, a new product will be dispatched at no additional cost</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <div className="text-gray-700">
                      If the desired product is unavailable, you can:
                      <ul className="mt-2 space-y-1 ml-4">
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">◦</span>
                          <span>Choose an alternative of similar value</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">◦</span>
                          <span>Receive a coupon code</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">◦</span>
                          <span>Opt for the amount to be credited back to your original payment method</span>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">4</span>
                  Exceptions
                </h3>
                <div className="ml-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Minor transit stress in live plants (e.g., slight drooping or yellowing) is not considered damage. The plant will recover with proper care.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Missing Item Policy */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Missing Item in Order
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We generally ship orders in multiple consignments to ensure the products reach you safely without any damage. If you believe any item from your order is missing, we're here to help!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 font-medium mb-3">
                  Kindly follow these steps within 24 hours of delivery:
                </p>
                <p className="text-gray-700 mb-2">
                  Contact us at <span className="font-semibold text-blue-700">+91 7483316150</span> with:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Clear images of the products received</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Pictures of the packaging and the shipping label on the package</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Your order number and a brief description of the missing item</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Order Cancellation Policy
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed italic">
                  "We've nurtured your plant with love and care, watching it grow, knowing it was meant for you. It was chosen just for you, and now, we're carefully packing it—wrapping it with the same warmth and attention it received while growing."
                </p>
                <p className="text-gray-700 leading-relaxed italic mt-3">
                  "Somewhere, a little green life is waiting to become part of your world, to brighten your space, to grow with you. It's more than just a plant—it's a living, breathing promise of fresh beginnings."
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                  Cancellation Window
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Orders can be canceled within 2 hours of order placement for free</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Once your order has been shipped, cancellations will no longer be possible</span>
                  </li>
                </ul>
                <div className="ml-8 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    For any assistance or queries, please feel free to reach out to our Customer Service team at <span className="font-semibold text-blue-700">+91 7483316150</span> – we're here to help!
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                  How to Cancel
                </h3>
                <div className="ml-8 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Contact us at <span className="font-semibold text-emerald-700">+91 7483316150</span> or email us at <a href="mailto:info@gidan.store" className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">info@gidan.store</a> for assistance
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Gidan Refund Policy
            </h2>
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-700 font-medium">
                  Refunds will be processed at the company's discretion on a case-by-case basis, considering the specific details of each request.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                  Eligibility for Refunds
                </h3>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">The item delivered was incorrect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">The product was damaged or lost in transit</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                  How to Request a Refund
                </h3>
                <div className="ml-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <p className="text-gray-700 mb-2">
                      Contact us at <span className="font-semibold text-blue-700">+91 7483316150</span> within 24 hours of delivery with:
                    </p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">Clear images/short video of the damaged product and packaging</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">Your order number and details of the issue</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-3 ml-4">Our team will review the request and confirm the refund.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Contact */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <a href="tel:+917892078318" className="hover:text-green-200 transition-colors">
                  +91 7483316150
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:info@gidan.store" className="hover:text-green-200 transition-colors">
                  info@gidan.store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export default RefundPolicy;