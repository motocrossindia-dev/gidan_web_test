'use client';

import { useRouter } from "next/navigation";
import React from 'react';
import { Droplet, Settings, Sun, Zap, Leaf, Clock, Phone } from 'lucide-react';
import {Helmet} from "react-helmet-async";
const DripIrrigation = () => {
  const router = useRouter();


  const steps = [
    {
      id: '01',
      title: 'Consultation & Assessment',
      description: 'We evaluate your land, water source, and crop requirements to design an efficient drip irrigation system.',
      Icon: Settings,
    },
    {
      id: '02',
      title: 'Custom System Design',
      description: 'Our experts create a tailored drip irrigation plan to maximize water efficiency and crop yield.',
      Icon: Sun,
    },
    {
      id: '03',
      title: 'Installation',
      description: 'Our skilled team installs the system with precision, ensuring optimal performance and durability.',
      Icon: Zap,
    },
    {
      id: '04',
      title: 'Maintenance & Support',
      description: 'We provide ongoing maintenance and support to keep your system running smoothly.',
      Icon: Leaf,
    },
  ];

  const isSmallScreen = window.innerWidth < 640;
const handleConnectClick = () => {
  
  router.push('/services'); // Replace '/connect' with your actual route
};
  return (

      <>
        <Helmet>
          <title>Gidan - Drip Irrigation</title>
        </Helmet>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-center">
        <div className="relative">
          <img name=" "   
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2000"
            alt="Drip Irrigation System"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4">
            <div className="flex items-center gap-4 mb-6">
              <Droplet className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Efficient Drip Irrigation Solutions
            </h1>
            <p className="text-xl text-white mb-6 max-w-2xl">
              Save water, increase crop yield, and optimize your farming with our advanced drip irrigation systems.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="text-white w-5 h-5" />
                <span className="text-white">10+ Years Experience</span>
              </div>
              <div className="hidden md:block text-white">•</div>
              <div className="flex items-center gap-2">
                <Phone className="text-white w-5 h-5" />
                <span className="text-white">+91 7483316150</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2F4333] mb-4">
            Our Drip Irrigation Expertise
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We specialize in designing and installing drip irrigation systems that conserve water, reduce costs, and improve crop health. Our solutions are tailored to meet the unique needs of your farm or garden, ensuring maximum efficiency and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "   
              src="https://images.unsplash.com/photo-1584479898061-15742e14f50d?auto=format&fit=crop&q=80&w=1200"
              alt="Farm Irrigation"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Farm Irrigation</h3>
                <p className="text-gray-200 text-sm">
                  Custom drip systems for large-scale farming, ensuring water efficiency and high yields.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "   
              src="https://images.unsplash.com/photo-1689728318937-17d24bc0a65c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGFuZHNjYXBlJTIwZ2FyZGVuaW5nfGVufDB8fDB8fHww"
              alt="Garden Irrigation"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Garden Irrigation</h3>
                <p className="text-gray-200 text-sm">
                  Efficient drip systems for home gardens, ensuring healthy plants and water conservation.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "   
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200"
              alt="Greenhouse Irrigation"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Greenhouse Irrigation</h3>
                <p className="text-gray-200 text-sm">
                  Precision drip systems for greenhouses, optimizing water usage and plant growth.
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
              <Droplet className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Water Efficiency</h3>
              <p className="text-gray-600 text-sm">
                Save up to 60% water compared to traditional irrigation methods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Settings className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Custom Solutions</h3>
              <p className="text-gray-600 text-sm">
                Tailored systems to meet the specific needs of your farm or garden.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Sun className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Increased Yield</h3>
              <p className="text-gray-600 text-sm">
                Optimize plant growth and maximize crop production.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">
                Sustainable solutions that protect the environment.
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
              Our Drip Irrigation Process
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A step-by-step approach to designing and installing your drip irrigation system.
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
  );
};

export default DripIrrigation;