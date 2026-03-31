'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import __contactus from "../../../Assets/contactus.webp";
const _contactus = typeof __contactus === 'string' ? __contactus : __contactus?.src || __contactus;
const contactus = typeof _contactus === 'string' ? _contactus : _contactus?.src || _contactus;
import { useSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import StoreSection from "../../../components/Home/StoreSection";
import ContactUsSchema from "../seo/ContactUsSchema";
import PageHeader from "@/components/Shared/PageHeader";
import { Mail, Phone, MapPin, Send, MessageSquare, User, Smartphone, Globe, ArrowRight } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, mobile, email, message } = formData;
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      enqueueSnackbar("Name should contain only alphabets.", { variant: "error" });
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      enqueueSnackbar("Phone number should be 10 digits.", { variant: "error" });
      return false;
    }
    if (!name || !mobile || !email || !message) {
      enqueueSnackbar("All fields are required.", { variant: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post('/promotion/contactUs/', formData);
      if (response?.status === 201) {
        enqueueSnackbar("Message sent successfully! We'll get back to you soon.", { variant: "success" });
        setFormData({ name: "", mobile: "", email: "", message: "" });
      } else {
        enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to connect to the server. Please try again.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFranchiseClick = () => {
    router.push('/franchise-enquiry');
  };

  return (
    <main className="bg-[#faf9f6] min-h-screen font-sans text-[#173113]">
      <PageHeader 
        title="Let's Talk" 
        subtitle="Have a question? We're here to help your garden thrive."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Main Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Visual & Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#173113] mb-6 leading-tight">We're just a message away.</h2>
              <p className="text-[#173113]/70 font-medium text-lg leading-relaxed">
                Whether you're looking for plant care advice, tracking an order, or exploring business opportunities, our team is ready to assist.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#173113]/5 group hover:bg-[#173113] transition-all duration-500">
                <div className="w-12 h-12 bg-[#A7D949]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#A7D949]/20 group-hover:bg-[#A7D949] transition-colors">
                  <MapPin className="w-6 h-6 text-[#173113]" />
                </div>
                <h3 className="text-xl font-serif mb-2 group-hover:text-white transition-colors">Head Office</h3>
                <p className="text-[#173113]/60 text-sm font-medium leading-relaxed group-hover:text-white/60 transition-colors">Jaynagar, Bengaluru, KA</p>
                <p className="text-[#173113] font-bold mt-4 group-hover:text-[#A7D949] transition-colors">+91 7483316150</p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#173113]/5 group hover:bg-[#173113] transition-all duration-500">
                 <div className="w-12 h-12 bg-[#A7D949]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#A7D949]/20 group-hover:bg-[#A7D949] transition-colors">
                  <Globe className="w-6 h-6 text-[#173113]" />
                </div>
                <h3 className="text-xl font-serif mb-2 group-hover:text-white transition-colors">Nursery Store</h3>
                <p className="text-[#173113]/60 text-sm font-medium leading-relaxed group-hover:text-white/60 transition-colors">Kanakapura Road, Bengaluru</p>
                <p className="text-[#173113] font-bold mt-4 group-hover:text-[#A7D949] transition-colors">+91 8971710854</p>
              </div>
            </div>

            <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl h-[400px]">
               <img src={contactus} alt="Contact Gidan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#173113]/80 via-transparent to-transparent flex items-end p-10">
                  <p className="text-white font-serif text-2xl italic">Creating green spaces, one home at a time.</p>
               </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-[#173113]/5">
            <div className="mb-10">
              <h2 className="text-3xl font-serif text-[#173113] mb-2">Send a Message</h2>
              <p className="text-[#173113]/50 font-medium">Expected response time: within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-[#173113]/20" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-6 py-4 bg-[#faf9f6] border border-transparent rounded-2xl focus:border-[#A7D949] focus:bg-white transition-all outline-none text-[#173113] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-4 w-5 h-5 text-[#173113]/20" />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Phone Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-[#faf9f6] border border-transparent rounded-2xl focus:border-[#A7D949] focus:bg-white transition-all outline-none text-[#173113] font-medium"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-[#173113]/20" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-6 py-4 bg-[#faf9f6] border border-transparent rounded-2xl focus:border-[#A7D949] focus:bg-white transition-all outline-none text-[#173113] font-medium"
                  />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#173113]/20" />
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-[#faf9f6] border border-transparent rounded-2xl focus:border-[#A7D949] focus:bg-white transition-all outline-none text-[#173113] font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#173113] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#173113]/90 hover:scale-[1.02] active:scale-100 transition-all shadow-xl shadow-[#173113]/20 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Franchise CTA */}
        <div className="mt-24 md:mt-32">
           <div className="bg-[#A7D949] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 text-[#173113]/5 -mr-20 -mt-20">
                 <Globe className="w-full h-full" />
              </div>
              <div className="relative z-10 max-w-xl">
                 <h2 className="text-3xl md:text-4xl font-serif text-[#173113] mb-4">Interested in Partnering?</h2>
                 <p className="text-[#173113]/70 font-bold">Request a free Franchise Consultation and join India's fastest growing gardening brand.</p>
              </div>
              <button 
                onClick={handleFranchiseClick}
                className="relative z-10 bg-[#173113] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform group"
              >
                Apply for Franchise
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {/* Local Stores */}
        <div className="mt-32">
           <div className="text-center mb-16">
              <span className="text-[10px] text-[#A7D949] font-black uppercase tracking-[0.3em] mb-4 block">Visit Us</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#173113]">Our Store Locations</h2>
           </div>
           <StoreSection />
        </div>
      </div>
      <ContactUsSchema />
    </main>
  );
};

export default ContactUs;
