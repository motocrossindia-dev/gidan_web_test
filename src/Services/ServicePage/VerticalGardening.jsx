
import React, { useState, useEffect } from 'react';
import { FaHeart, FaLeaf, FaMagic, FaLink, FaClipboard, FaSeedling, FaTools, FaTint, FaAward, FaClock, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
const VerticalGarden = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const steps = [
    {
      id: '01',
      title: 'Initial Consultation',
      description: 'We assess your space and discuss your vertical garden goals and vision.',
      Icon: FaClipboard
    },
    {
      id: '02',
      title: 'Custom Vertical Design',
      description: 'We create a tailored vertical garden plan optimized for your specific space.',
      Icon: FaSeedling
    },
    {
      id: '03',
      title: 'Installation & Setup',
      description: 'Our team expertly installs the vertical garden system, including irrigation and plants.',
      Icon: FaTools
    },
    {
      id: '04',
      title: 'Ongoing Maintenance',
      description: 'We provide care services to ensure your vertical garden thrives year-round.',
      Icon: FaTint
    }
  ];
  const navigate = useNavigate();

  const handleConnectClick = () => {
  
  navigate('/services'); // Replace '/connect' with your actual route
};

  return (

      <>
        <Helmet>
          <title>Gidan - Vertical Garden</title>
        </Helmet>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-center">
        <div className="relative">
          <img name=" "
            src="https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Vertical Garden Wall"
            className="w-full h-64 md:h-96 lg:h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4">
            <div className="flex items-center gap-4 mb-6">
              <FaAward className="text-white w-8 h-8" />
              <span className="text-white text-sm md:text-base">Innovative Vertical Garden Solutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Transform Your Vertical Space
            </h1>
            <p className="text-xl text-white mb-6 max-w-2xl">
              Creative gardening solutions for urban spaces, interior walls, and limited outdoor areas
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <FaClock className="text-white w-5 h-5" />
                <span className="text-white">8+ Years Expertise</span>
              </div>
              <div className="hidden md:block text-white">•</div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-white w-5 h-5" />
                <span className="text-white">+91 7892078318</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2F4333] mb-4">
            Our Vertical Garden Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We specialize in creating stunning vertical gardens for homes, offices, and commercial spaces. Our solutions maximize your available space, improve air quality, and add natural beauty to any environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="Indoor Living Walls"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Indoor Living Walls</h3>
                <p className="text-gray-200 text-sm">
                  Beautiful plant installations that purify air and enhance interior spaces
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="Outdoor Vertical Gardens"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Outdoor Vertical Gardens</h3>
                <p className="text-gray-200 text-sm">
                  Space-efficient garden solutions for balconies, terraces, and small yards
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <img name=" "
              src="https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="Hydroponic Systems"
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Hydroponic Systems</h3>
                <p className="text-gray-200 text-sm">
                  Soil-free vertical growing systems for herbs, vegetables, and decorative plants
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
              <h3 className="text-lg font-semibold mb-2">Space Optimization</h3>
              <p className="text-gray-600 text-sm">
                Maximize your greenery in limited spaces with vertical solutions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaLink className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Custom Integration</h3>
              <p className="text-gray-600 text-sm">
                Seamlessly integrate vertical gardens into your existing design.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaLeaf className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Sustainable Design</h3>
              <p className="text-gray-600 text-sm">
                Eco-friendly vertical systems that conserve water and energy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaMagic className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
              <h3 className="text-lg font-semibold mb-2">Aesthetic Impact</h3>
              <p className="text-gray-600 text-sm">
                Transform plain walls into living art that enhances any environment.
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
              Our Vertical Garden Process
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A systematic approach to creating thriving vertical gardens for any space
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

export default VerticalGarden;