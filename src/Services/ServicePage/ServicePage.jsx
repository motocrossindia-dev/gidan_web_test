import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Link, Leaf, Sparkles, CheckCircle, Brush, Hammer, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from 'react-responsive';
import Service03 from "./Service03";
import Service04 from "./Service04";
import axiosInstance from "../../Axios/axiosInstance";
import {Helmet} from "react-helmet";
// import { Users, Recycle, Paintbrush } from 'lucide-react';
const ServicePage = () => {

  const { id } = useParams();
  const isSmallScreen = useMediaQuery({ maxWidth: 640 }); // Adjust breakpoint as needed

  const getSetvicebyId = async () => {
    try {
      const response = await axiosInstance.get(`/services/publicservice_list/${id}/`);
      if (response.status === 200) {
        // setService(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSetvicebyId()
  }, [id, getSetvicebyId])

  const steps = [
    {
      id: "01",
      title: "Design Consultation",
      description:
        "In the initial step, we sit down with you to have a detailed discussion about your gardening vision and preferences.",
      Icon: Ruler,
    },
    {
      id: "02",
      title: "Design & Planning",
      description:
        "Our team of experts meticulously crafts a custom garden design that aligns with your desires and space characteristics.",
      Icon: Brush,
    },
    {
      id: "03",
      title: "Implement Construction",
      description:
        "We present the design to you for review. Once approved, we move forward to implement the plan with construction.",
      Icon: Hammer,
    },
    {
      id: "04",
      title: "Garden Decorating",
      description:
        "With your design finalized, we put on our gardening gloves and work, creating your garden to be as beautiful as envisioned.",
      Icon: CheckCircle,
    },
  ];
  return (
      <>
        <Helmet>
          <title>Gidan - Services Page</title>
        </Helmet>
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <section className="relative text-center my-6">
        <div className="relative">
          <img name=" "   
            src="https://images.unsplash.com/photo-1592178036775-70c41f818c13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Plants"
            className="mx-auto rounded-lg shadow-lg w-full h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg p-6">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
              CREATE YOUR DREAM GARDEN
            </h2>
            <p className="text-white text-sm sm:text-lg md:w-3/4 mt-2">
              Transform your space into a lush paradise with our expert landscaping services.
            </p>
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section className="my-6">
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">[VALUES]</div>
              <div className="space-x-4 md:space-x-8 text-sm sm:text-base">
                <span className="text-gray-700">
                  Landscape Design <span className="text-gray-400">01</span>
                </span>
                <span className="text-gray-700">
                  Indoor Garden <span className="text-gray-400">02</span>
                </span>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight">
                  <span className="text-[#2F4333]">WE ARE </span>
                  <span className="text-gray-400">DIFFERENT</span>
                  <br />
                  <span className="text-[#2F4333]">IN EVERY WAYS</span>
                </h1>
                <button className="bg-[#2F4333] text-white px-6 py-3 w-full sm:w-auto">
                  Get Started
                </button>

                {/* Side Image (Responsive) */}
                <div className="mt-4 md:mt-8">
                  <img name=" "   
                    src="https://images.unsplash.com/photo-1613715690507-07434f67183f?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[600px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Cards & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="col-span-2">
                  <img name=" "   
                    src="https://images.unsplash.com/photo-1625582598943-2445bb7b8253?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Garden workspace"
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-[300px] object-cover rounded-lg"
                  />
                </div>

                {/* Feature Cards */}
                {/* <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <Heart className="text-[#2F4333] mb-2 sm:mb-4" size={isSmallScreen ? 20 : 24} />
                <h3 className="text-md sm:text-lg font-medium mb-1 sm:mb-2">Passion in every work</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    We are deeply passionate about creating beautiful, sustainable green landscapes for our clients.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <Link className="text-[#2F4333] mb-2 sm:mb-4" size={isSmallScreen ? 20 : 24} />
                  <h3 className="text-md sm:text-lg font-medium mb-1 sm:mb-2">Collaboration on top</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    We make your dream design come true by combining your ideas with our 10+ years of garden design expertise.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <Leaf className="text-[#2F4333] mb-2 sm:mb-4" size={isSmallScreen ? 20 : 24} />
                  <h3 className="text-md sm:text-lg font-medium mb-1 sm:mb-2">Sustainability in check</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    We love nurturing nature, one garden at a time, so that you can enjoy the beautiful landscape even longer.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <Sparkles className="text-[#2F4333] mb-2 sm:mb-4" size={isSmallScreen ? 20 : 24} />
                  <h3 className="text-md sm:text-lg font-medium mb-1 sm:mb-2">Creativity unleashed</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    We make sure to only give you our innovative designs that stand out to make sure your garden is not like the others.
                  </p>
                </div> */}

                <section className=" md:py-16 py-6">
                  <div className="max-w-7xl mx-auto px-0 md:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Heart className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
                        <h3 className="text-lg font-semibold mb-2">Passion in every work</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          We are deeply passionate about creating beautiful, sustainable green landscapes for our clients.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Link className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
                        <h3 className="text-lg font-semibold mb-2">Collaboration on top</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          We make your dream design come true by combining your ideas with our 10+ years of garden design expertise.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Leaf className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
                        <h3 className="text-lg font-semibold mb-2">Sustainability in check</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          We love nurturing nature, one garden at a time, so that you can enjoy the beautiful landscape even longer.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Sparkles className="text-[#2F4333] mb-4" size={isSmallScreen ? 20 : 24} />
                        <h3 className="text-lg font-semibold mb-2">Creativity unleashed</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          We make sure to only give you our innovative designs that stand out to make sure your garden is not like the others.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>


            </div>
          </main>
        </div>
      </section>
      <div className="w-full min-h-[300px] bg-[#2F4333] text-white py-12 px-6 md:px-16 lg:px-32 overflow-hidden">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-semibold"
          >
            SIMPLE STEPS FOR OUR <span className="text-gray-300">LANDSCAPE</span> WORK
          </motion.h2>
        </div>

        <div className="relative flex flex-col md:grid md:grid-cols-2 gap-12 max-w-none">
          {steps.map(({ id, title, description, Icon }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative flex items-center gap-6"
            >
              <div className="flex-shrink-0 p-3 bg-white text-[#2F4333] rounded-full">
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{id} | {title}</h3>
                <p className="text-gray-300 mt-2 text-sm">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Service03 />
      <Service04 />
    </div>
        </>
  );
};

export default ServicePage;
