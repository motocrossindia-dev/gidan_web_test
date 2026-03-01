'use client';

import React, { useEffect } from 'react';
import { Truck, Package, RefreshCw, MessageCircle, Mail, Phone, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import HomepageSchema from "../../views/utilities/seo/HomepageSchema";
import StoreSchema from "../../views/utilities/seo/StoreSchema";

const ShippingPolicy = () => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);
  return (

    <>
      

      <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800 font-sans">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-4 flex items-center justify-center gap-3">
            <Truck className="w-8 h-8" />
            Shipping and Return Policy
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Gidan ensures quality products and packaging to our customers. We have partnered with reputed courier agencies for a safe and timely delivery. There is free shipping on orders above Rs.2000.
          </p>
        </div>

        <div className="space-y-8">
          {/* Shipping Information */}
          <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              How long does it take for an order to arrive?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>All the orders are dispatched from our warehouse within <strong>1 working days</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Most orders are delivered to your address within <strong>2-6 working days</strong> from the date when the order is placed</span>
              </p>
              <p className="flex items-start gap-2">
                <Package className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>You can track your order by clicking on the tracking link provided</span>
              </p>
            </div>
          </section>

          {/* Plant Returns */}
          <section className="bg-red-50 rounded-lg p-6 border-l-4 border-red-400">
            <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Can you return plants? No.
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-medium text-red-800">
                Gidan does not accept returns on plants as the poor plants will perish due to both way transit stress. But we do guarantee every plant will arrive at your doorstep in great condition.
              </p>
              <div className="bg-yellow-100 p-4 rounded-md">
                <p className="text-yellow-800">
                  <strong>Please note:</strong> The plant might look a little dull due to transit stress. But be assured that exposure to sunlight and proper watering will revive the plant to its natural healthy state.
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-md">
                <p className="text-green-800 font-medium mb-3">
                  If you are worried about the plant health, we have your back. Just contact our support team:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span><strong>Email Us:</strong> support@www.gidan.store</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span><strong>WhatsApp us</strong> at7483316150</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Plant Returns */}
          <section className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Can you return non-plant products? Yes.
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-medium">If any non-plant product reaches you in a damaged state.</p>
              <p>We take great care selecting the best products for our customers that will help support and enhance your plant life. If you are not happy with your purchase, we will accept returns and exchanges on unused or unopened products within <strong>3 days of purchase</strong>. Simply reach out to our customer support team to start the process.</p>
            </div>
          </section>

          {/* Self Return Process */}
          {/* <section className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6" />
            What if you are not happy with the product? You can Self Return
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="font-medium">If you dislike the product received, you can follow below steps to send the product to us:</p>
            <div className="bg-white p-4 rounded-md border space-y-3">
              <div className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <p>You can Self Return the item to us within <strong>seven days</strong> from the delivery date</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <p>We will send a replacement or initiate refund for the products to your source account once we receive the product</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <p><strong>You will bear the shipping charges</strong> to return the products</p>
              </div>
            </div>
          </div>
        </section> */}

          {/* Return Address */}
          <section className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-400">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Return Address
            </h2>
            <div className="bg-white p-4 rounded-md border">
              <div className="space-y-2">
                <p className="font-bold text-lg text-gray-800">FARM AMMINO AGRITECH PRIVATE LIMITED</p>
                <p className="text-gray-700">
                  <strong>Address:</strong>1st floor, 282/C, 10th Main Rd, 5th Block,<br />
                  Jayanagar, Bengaluru, Karnataka 560041,
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span><strong>Telephone:</strong>+91 7483316150</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Summary */}
          <section className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Quick Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Free shipping on orders above Rs.2000</li>
                  <li>• Dispatch within 1 working days</li>
                  <li>• Delivery in 2-6 working days</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Returns
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Plants: No returns accepted</li>
                  <li>• Non-plants: 3 days return policy</li>
                  <li>• Self-return within 7 days</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        {/* <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-8">
        <p>© 2024 Gidan - FARM AMMINO AGRITECH PRIVATE LIMITED. All rights reserved.</p>
      </footer> */}
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default ShippingPolicy;