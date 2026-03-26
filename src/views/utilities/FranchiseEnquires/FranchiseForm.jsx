'use client';

import React, { useState } from "react";
import { useSnackbar } from "notistack";
import __franchiseenquires2 from "../../../Assets/franches_banners/Banner2.webp";
const _franchiseenquires2 = typeof __franchiseenquires2 === 'string' ? __franchiseenquires2 : __franchiseenquires2?.src || __franchiseenquires2;
const franchiseenquires2 = typeof _franchiseenquires2 === 'string' ? _franchiseenquires2 : _franchiseenquires2?.src || _franchiseenquires2;
import axios from "axios";
import Cookies from "js-cookie";

const FranchiseForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const csrfToken = Cookies.get("csrftoken");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    area: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/franchise/add_franchise/`,
          formData,
          {
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
          }
      );

      if (response.data.status === 200) {
        enqueueSnackbar("Franchise request submitted successfully!", {
          variant: "success",
        });
        setResponseMessage("Franchise request submitted successfully! ✅");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          area: "",
          address: "",
          message: "",
        });
      } else {
        enqueueSnackbar("" + response.data.message, { variant: "success" });
        setResponseMessage("" + response.data.message);
      }
    } catch (error) {
      enqueueSnackbar("Error: " + error.message, { variant: "error" });
      setResponseMessage("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      // FULL WIDTH CONTAINER
      <div className="w-full">

        {/*
           RESPONSIVE GRID:
           - grid-cols-1: Stacks vertically on Mobile
           - md:grid-cols-2: Splits into equal 50/50 columns on Desktop (6 by 6)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full  bg-white min-h-[650px]">

          {/* LEFT SIDE - IMAGE (6 columns on desktop) */}
          <div className="flex items-center justify-center  h-full relative">
            <img
                src={franchiseenquires2}
                loading="lazy"
                alt="Franchise"
                // object-contain: Ensures the ENTIRE image is visible (NO CROP)
                className="max-w-full max-h-[600px] object-contain"
            />
          </div>

          {/* RIGHT SIDE - FORM (6 columns on desktop) */}
          <div className="bg-white p-6 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Get a Franchise
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none"
                  required
              />
              <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none"
                  required
              />
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none"
                  required
              />
              <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area In Which You Want To Open"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none"
                  required
              />
              <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none"
                  required
              />
              <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#375421] outline-none resize-y"
                  rows="5"
                  required
              />

              <button
                  type="submit"
                  className="w-full bg-[#375421] hover:bg-[#375421] hover:text-white text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "SEND"}
              </button>

              {responseMessage && (
                  <p className="text-center mt-2 text-sm font-semibold text-gray-700">
                    {responseMessage}
                  </p>
              )}
            </form>
          </div>

        </div>
      </div>
  );
};

export default FranchiseForm;