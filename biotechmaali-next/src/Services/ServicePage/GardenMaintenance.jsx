'use client';

import React from 'react';
import { FaHeart, FaLeaf, FaMagic, FaLink, FaClipboard, FaSeedling, FaTools, FaTint, FaAward, FaClock, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
const GardenMaintenance = () => {
  const navigate = useNavigate();
const handleConnectClick = () => {
  
  navigate('/services'); // Replace '/connect' with your actual route
};
  const steps = [
    {
      id: '01',
      title: 'Initial Assessment',
      description: 'We evaluate your garden’s current condition and discuss your maintenance goals.',
      Icon: FaClipboard
    },
    {
      id: '02',
      title: 'Custom Maintenance Plan',
      description: 'We create a tailored plan to keep your garden healthy and vibrant year-round.',
      Icon: FaSeedling
    },
    {
      id: '03',
      title: 'Regular Upkeep',
      description: 'Our team provides consistent care, including pruning, weeding, and fertilizing.',
      Icon: FaTools // Replaced FaShovel with FaTools
    },
    {
      id: '04',
      title: 'Seasonal Care',
      description: 'We adapt our services to meet your garden’s needs through every season.',
      Icon: FaTint
    }
  ];

  const isSmallScreen = window.innerWidth < 640;

  return (

      <>
        <Helmet>
          <title>Gidan - Garden Maintenance</title>
        </Helmet>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-center">
        <div className="relative">
          <img name=" "
            src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=2000"
            alt="Well-Maintained Garden"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4">
            <div className="flex items-center gap-4 mb-6">
              <FaAward className="text-white w-8 h-8" />
              <span className="text-white text-sm md:text-base">Award-Winning Garden Maintenance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Keep Your Garden Thriving
            </h1>
            <p className="text-xl text-white mb-6 max-w-2xl">
              Professional garden care services to maintain the beauty and health of your outdoor space
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <FaClock className="text-white w-5 h-5" />
                <span className="text-white">10+ Years Experience</span>
              </div>
              <div className="hidden md:block text-white">•</div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-white w-5 h-5" />
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
            Our Garden Maintenance Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive garden care to ensure your outdoor space remains lush, healthy, and beautiful. From routine upkeep to seasonal adjustments, our expert team provides tailored solutions to meet your garden’s unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1599598177991-ec67b5c37318?auto=format&fit=crop&q=80&w=1200"
              alt="Lawn Care"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Lawn Care</h3>
                <p className="text-gray-200 text-sm">
                  Regular mowing, edging, and fertilization for a pristine lawn
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1599598177991-ec67b5c37318?auto=format&fit=crop&q=80&w=1200"
              alt="Pruning & Trimming"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Pruning & Trimming</h3>
                <p className="text-gray-200 text-sm">
                  Expert pruning to promote healthy growth and maintain plant shape
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1599598177991-ec67b5c37318?auto=format&fit=crop&q=80&w=1200"
              alt="Weed Control"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Weed Control</h3>
                <p className="text-gray-200 text-sm">
                  Effective weed management to keep your garden looking its best
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
              <FaHeart className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Passionate Care</h3>
              <p className="text-gray-600 text-sm">
                We treat every garden with the love and attention it deserves.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaLink className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Collaborative Approach</h3>
              <p className="text-gray-600 text-sm">
                We work closely with you to meet your garden’s specific needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaLeaf className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly Practices</h3>
              <p className="text-gray-600 text-sm">
                Sustainable methods to protect your garden and the environment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaMagic className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Attention to Detail</h3>
              <p className="text-gray-600 text-sm">
                Meticulous care to ensure every aspect of your garden thrives.
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
              Our Garden Maintenance Process
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A structured approach to keeping your garden healthy and beautiful
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

export default GardenMaintenance;