'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHandPointer } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { FaScissors } from "react-icons/fa6";
import __service from "../../Assets/Serviceform.webp";
const _service = typeof __service === 'string' ? __service : __service?.src || __service;
const service = typeof _service === 'string' ? _service : _service?.src || _service;
import axiosInstance from "../../Axios/axiosInstance";
import axios from "axios";

const ServicesPage = ({ initialServices = [] }) => {
  const [services, setServices] = useState(initialServices);

  useEffect(() => {
    if (initialServices.length > 0) return; // Skip if already have data from SSR

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/services/publicservice_list/`
        );
        const visibleServices = res.data.filter(item => item.Visible);
        setServices(visibleServices);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, [initialServices]);


  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    location: "",
    services: "",
    comment: "",
  });
  const [comment, setcomment] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setcomment("");

    try {
      const response = await axiosInstance.post(`/services/service_enquiry/`,
        formData
      );

      if (response.status === 201) {
        setcomment("Your enquiry has been sent successfully!");
        setFormData({
          name: "",
          contact_no: "",
          location: "",
          services: "",
          comment: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setcomment("Failed to send enquiry. Please try again.");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);

  if (!services.length) return null;


  return (
    <>
      <div className="bg-white min-h-screen">
        <header className="py-12 md:py-20 text-center max-w-4xl mx-auto px-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#375421]/5 text-[#375421] text-[10px] font-black uppercase tracking-[0.25em] mb-4">
            Our Offerings
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#1a1f14] leading-tight ">
            Services We <span className="italic text-[#375421]">Provide</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium leading-relaxed mt-6">
            Professional gardening and landscaping solutions tailored to your unique green vision.
          </p>
        </header>

        <main className="container mx-auto px-4 py-2 md:py-8">
          {/* Service Cards */}
          {/* {loading ? ( */}
          {/* <p className="text-center text-gray-500">Loading services...</p> */}
          {/* // ) : ( */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/single/${service.Heading.replace(/\s+/g, "").toLowerCase()}`}
                className="text-center"
              >
                <div className="w-full bg-white rounded-lg p-4">
                  <img
                    className="w-full h-60 object-cover rounded-lg mb-4"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${service.Image}`}
                    alt={service.Heading}
                  />
                  <h3 className="text-xl font-semibold text-center text-gray-800">
                    {service.Heading}
                  </h3>
                  <p className="text-center text-gray-600 mt-2 line-clamp-2">
                    {service.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>



          <div className="flex flex-col items-center my-12 md:my-20 p-6 bg-[#fafafa] rounded-[40px] md:rounded-[60px] border border-gray-100/50">
            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#375421]/5 text-[#375421] text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                The Process
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1a1f14] leading-tight">
                How it <span className="italic text-[#375421]">Works</span>
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full">
              <div className="flex flex-col items-center">
                <FaHandPointer className="text-[#0e1b47]" size={24} />
                <p className="text-center text-xs md:text-base">Select the garden package that's right for you</p>
              </div>
              <div className="flex flex-col items-center">
                <RiCustomerService2Fill className="text-[#0e1b47]" size={24} />
                <p className="text-center text-xs md:text-base">Our team will reach out to you</p>
              </div>
              <div className="flex flex-col items-center">
                <SlCalender className="text-[#0e1b47]" size={24} />
                <p className="text-center text-xs md:text-base">Book your initial visit</p>
              </div>
              <div className="flex flex-col items-center">
                <FaScissors className="text-[#0e1b47]" size={24} />
                <p className="text-center text-xs md:text-base">Our garden expert will carry out the requested service</p>
              </div>
            </div>
          </div>


          {/* Form Section */}
          <div className="max-w-screen mx-auto p-6 bg-site-bg rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2 w-full">
                <img name=" "
                  src={service}
                  alt="Illustration"
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition duration-500"
                />
              </div>
              <div className="md:w-1/2 w-full md:bg-white  md:p-10 rounded-[30px] md:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <h2 className="text-2xl md:text-4xl font-serif text-[#1a1f14] mb-3 text-center">
                  Book a <span className="italic text-[#375421]">Visit</span>
                </h2>
                <p className="text-gray-500 text-center mb-8 font-medium max-w-md mx-auto text-sm">
                  Transform your space with Gidan's expert touch. Fill out the form below and we'll reach out shortly.
                </p>

                {/* Show success/error comment */}
                {comment && (
                  <p className={`mb-4 text-center ${comment.includes("successfully") ? "text-[#375421]" : "text-red-600"}`}>
                    {comment}
                  </p>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <input
                      type="number"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <select
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
                      required
                    >
                      <option value="" disabled>Select a Service</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="terrace">Terrace Garden</option>
                      <option value="maintenance">Garden Maintenance</option>
                      <option value="farm">Farm Management</option>
                      <option value="vegetable">Vegetable Gardening</option>
                      <option value="polyhouse">Poly House</option>
                    </select>
                  </div>
                  <div className="mb-5">
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      placeholder="Description"
                      rows={4}
                      className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ backgroundColor: "#A3CD39" }}
                    className="w-full text-white md:py-3 py-2 px-4 rounded-lg hover:scale-105 shadow-md"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ServicesPage;

















