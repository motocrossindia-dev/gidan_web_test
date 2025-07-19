import React from 'react'
import { ChevronLeft,ChevronRight } from 'lucide-react';

const Service04 = () => {
  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50">
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-gray-500 uppercase tracking-wider mb-6">04 / TESTIMONIAL</p>
      <p className="text-xl md:text-2xl text-gray-700 mb-8">
        LeafLife's dedication to bringing our <span className="text-green-700 font-semibold">vision</span> to life was exceptional. They turned our <span className="text-green-700 font-semibold">backyard</span> into a haven of tranquility. Their attention to detail and sustainable practices on their design impressed us.
      </p>
      {/* <p className="text-gray-800 font-semibold">JESSE PARKER</p> */}
      <div className="flex justify-center mt-8 space-x-4">
        <button className="bg-white border border-gray-300 rounded-full p-2">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <button className="bg-green-800 rounded-full p-2">
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  </section>
  )
}

export default Service04
