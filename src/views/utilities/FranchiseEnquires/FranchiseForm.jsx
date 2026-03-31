'use client';

import React, { useState } from "react";
import { useSnackbar } from "notistack";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import __franchiseenquires2 from "../../../Assets/franches_banners/Banner2.webp";
import { Send, User, Phone, Mail, Map, MessageSquare, Building } from "lucide-react";

const FranchiseForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const csrfToken = Cookies.get("csrftoken");
  const _franchiseenquires2 = typeof __franchiseenquires2 === 'string' ? __franchiseenquires2 : __franchiseenquires2?.src || __franchiseenquires2;
  
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
        enqueueSnackbar("Franchise request submitted successfully!", { variant: "success" });
        setResponseMessage("Franchise request submitted successfully! ✅");
        setFormData({ name: "", mobile: "", email: "", area: "", address: "", message: "" });
      } else {
        enqueueSnackbar("" + response.data.message, { variant: "info" });
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
    <section className="w-full px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-[#173113]/5 flex flex-col lg:flex-row min-h-[700px]">
          
          {/* Left Side - Visual Showcase */}
          <div className="lg:w-1/2 relative bg-[#faf9f6] flex items-center justify-center p-8 lg:p-12">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img src="/logo.webp" alt="Gidan Logo watermark" className="w-full h-full object-contain scale-150 rotate-12" />
            </div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <img
                  src={_franchiseenquires2}
                  loading="lazy"
                  alt="Gidan Franchise"
                  className="max-w-full max-h-[550px] object-contain drop-shadow-2xl rounded-2xl scale-105"
              />
            </div>
            {/* Soft Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#faf9f6] to-transparent" />
          </div>

          {/* Right Side - Premium Form */}
          <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-10">
              <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold mb-3 block">
                Partner Registration
              </span>
              <h1 className="text-4xl md:text-5xl text-[#173113] font-serif tracking-tight !leading-tight">
                Get a <span className="italic text-[#A7D949]">Franchise</span>
              </h1>
              <p className="text-[#173113]/60 font-medium mt-4">
                Share your details and our team will get back to you with the next steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173113]/40" />
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium"
                      required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173113]/40" />
                  <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium"
                      required
                  />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173113]/40" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium"
                    required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173113]/40" />
                  <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Desired Area"
                      className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium"
                      required
                  />
                </div>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173113]/40" />
                  <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Current Address"
                      className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium"
                      required
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-[#173113]/40" />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest..."
                    className="w-full bg-[#faf9f6] border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#A7D949] outline-none text-[#173113] font-medium resize-none"
                    rows="4"
                    required
                />
              </div>

              <button
                  type="submit"
                  className="w-full bg-[#173113] hover:bg-[#1f3d19] text-white font-bold py-5 px-4 rounded-2xl transition-all duration-300 shadow-xl shadow-[#173113]/10 flex items-center justify-center gap-3 active:scale-95 text-lg group disabled:opacity-70"
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Request Call-back"}
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              {responseMessage && (
                  <p className="text-center mt-4 text-sm font-bold text-[#173113]/60">
                    {responseMessage}
                  </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseForm;