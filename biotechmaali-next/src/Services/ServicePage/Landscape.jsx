'use client';


import { useRouter } from "next/navigation";
import React from 'react';
import { Heart, Leaf, Sparkles, Link, PencilRuler, Plane as Plant, Shovel, Droplets, Award, Clock, Phone } from 'lucide-react';
import {Helmet} from "react-helmet";
const Landscape = () => {

  const router = useRouter();

const handleConnectClick = () => {
  
  router.push('/services'); // Replace '/connect' with your actual route
};

  const steps = [
    {
      id: '01',
      title: 'Design Consultation',
      description: 'We meet to discuss your vision, assess your space, and understand your lifestyle needs.',
      Icon: PencilRuler
    },
    {
      id: '02',
      title: 'Custom Planning',
      description: 'Our experts create detailed designs incorporating sustainable and native plants.',
      Icon: Plant
    },
    {
      id: '03',
      title: 'Installation',
      description: 'Our skilled team brings your dream landscape to life with precision and care.',
      Icon: Shovel
    },
    {
      id: '04',
      title: 'Maintenance',
      description: 'We provide ongoing care to ensure your landscape thrives throughout the seasons.',
      Icon: Droplets
    }
  ];

  const isSmallScreen = window.innerWidth < 640;
  return (

      <>
        <Helmet>
          <title>Gidan - Landscape</title>
        </Helmet>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-center">
        <div className="relative">
          <img name=" "
            src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=2000"
            alt="Luxurious Garden"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4">
            <div className="flex items-center gap-4 mb-6">
              <Award className="text-white w-8 h-8" />
              {/* <span className="text-white text-sm md:text-base">Award-Winning Landscape Design</span> */}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Transform Your Outdoor Space
            </h1>
            <p className="text-xl text-white mb-6 max-w-2xl">
              Creating sustainable, beautiful landscapes that bring your vision to life
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="text-white w-5 h-5" />
                <span className="text-white">15+ Years Experience</span>
              </div>
              <div className="hidden md:block text-white">•</div>
              <div className="flex items-center gap-2">
                <Phone className="text-white w-5 h-5" />
                <span className="text-white">+91 7483316150</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
             
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2F4333] mb-4">
            Our Landscaping Expertise
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We specialize in transforming outdoor spaces into stunning, functional landscapes that blend beauty with sustainability.
            From concept to creation, our expert team brings your vision to life with innovative design solutions, eco-friendly practices, and meticulous craftsmanship.
            Whether it's a serene garden retreat, a vibrant outdoor living area, or a lush green space, we tailor every project to enhance your property's natural charm while ensuring long-lasting quality and environmental responsibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1584479898061-15742e14f50d?auto=format&fit=crop&q=80&w=1200"
              alt="Garden Design"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Garden Design</h3>
                <p className="text-gray-200 text-sm">
                  Custom garden designs that reflect your style and complement your home
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1689728318937-17d24bc0a65c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGFuZHNjYXBlJTIwZ2FyZGVuaW5nfGVufDB8fDB8fHww"
              alt="Hardscaping"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Hardscaping</h3>
                <p className="text-gray-200 text-sm">
                  Beautiful patios, walkways, and retaining walls that enhance your outdoor living
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200"
              alt="Water Features"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Water Features</h3>
                <p className="text-gray-200 text-sm">
                  Tranquil fountains and ponds that create a peaceful atmosphere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Passionate Service</h3>
              <p className="text-gray-600 text-sm">
                We pour our heart into every project, ensuring exceptional results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Link className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Collaborative Approach</h3>
              <p className="text-gray-600 text-sm">
                Working together to bring your landscape vision to life.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Leaf className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">
                Sustainable practices that protect and nurture the environment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Sparkles className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Creative solutions that make your outdoor space unique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#2F4333] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Our Landscape Design Process
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A systematic approach to creating your perfect outdoor space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {steps.map(({ id, title, description, Icon }) => (
        <div key={id} className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-white text-[#2F4333] p-3 rounded-full">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{id} | {title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Let's Connect Button */}
<div className="mt-12 flex justify-center">
  <button
    onClick={handleConnectClick}
    className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
  >
    Let’s Connect
  </button>
</div>

        </div>
      </section>
    </div>

        </>
  )
}

export default Landscape