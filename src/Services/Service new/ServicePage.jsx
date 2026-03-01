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

const ServicesPage = () => {

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "https://backend.gidan.store/services/publicservice_list/"
        );

        const visibleServices = res.data.filter(item => item.Visible);
        setServices(visibleServices);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);


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
        <header className="bg-gray-100 text-black py-3 md:py-4 px-8 mt-4">
          <h1 className="text-2xl md:text-3xl  font-bold text-center">Services We Provide</h1>
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
                    src={`https://backend.gidan.store${service.Image}`}
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



          <div className="flex flex-col items-center my-6 p-3 bg-white rounded-md ">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">How it Works</h2>
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
          <div className="max-w-screen mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2 w-full">
                <img name=" "
                  src={service}
                  alt="Illustration"
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition duration-500"
                />
              </div>
              <div className="md:w-1/2 w-full md:bg-white  md:p-6 rounded-lg md:shadow-lg">
                <h2 className="text-xl text-center md:text-3xl font-semibold mb-6 text-black-600">Gidan Service</h2>

                {/* Show success/error comment */}
                {comment && (
                  <p className={`mb-4 text-center ${comment.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
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

















