import React from 'react'
import { Plane as Plant, Gift, Sprout,} from 'lucide-react';
import {Helmet} from "react-helmet";


const Comingsoon = () => {



    return (
      <>
          <Helmet>
            <title>Gidan - Coming soon</title>
          </Helmet>
                {/* <Header />
        <Navigation/> */}
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
          {/* Background decorative elements */}
          <div className="absolute top-10 left-10 text-green-200 animate-pulse">
            <Plant size={48} />
          </div>
          <div className="absolute bottom-10 right-10 text-green-200 animate-pulse delay-75">
            <Gift size={48} />
          </div>
          <div className="absolute top-10 right-10 text-green-200 animate-pulse delay-150">
            <Sprout size={48} />
          </div>
          <div className="absolute bottom-10 left-10 text-green-200 animate-pulse delay-200">
            <Plant size={48} />
          </div>
    
          {/* Main content */}
          <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 text-green-100">
              <Gift size={128} />
            </div>
    
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
                Plant Gifts Coming Soon
              </h1>
              
              <p className="text-lg text-green-700 mb-8">
                We're cultivating something special. Soon you'll be able to send the perfect plant gifts to your loved ones.
              </p>
    
             
    
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Curated Selection</h3>
                  <p className="text-green-600">Handpicked plants perfect for gifting</p>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Expert Care Guides</h3>
                  <p className="text-green-600">Detailed care instructions included</p>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Eco-Friendly</h3>
                  <p className="text-green-600">Sustainable packaging & practices</p>
                </div>
              </div>
            </div>
          </div>
    
          {/* Footer */}
          <p className="mt-8 text-green-600 text-center">
            © 2025 Plant Gifts. All rights reserved.
          </p>
        </div>
        </>
      );
}

export default Comingsoon