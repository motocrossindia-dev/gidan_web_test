import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";


const ServiceCard = ({ image, title, heading }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/services");
  };

  return (
    <div 
      className="w-full max-w-[500px] mx-auto h-auto rounded-lg overflow-hidden font-sans flex flex-col items-center cursor-pointer"
      onClick={handleClick} // Redirect on click
    >
      <div className="w-full h-[250px] flex items-center justify-center bg-gray-100 rounded-lg">
        <img name=" "   
          className="w-full h-full object-cover rounded-lg"
          src={image}
          alt={title}
        />
      </div>
      <div className="flex flex-col items-center text-center mt-4">
        <h3 className="text-gray-500 text-xs md:text-lg mt-1 max-w-[90%]">{title}</h3>
        <p className="text-gray-700 text-sm md:text-2xl font-bold">{heading}</p>
      </div>
    </div>
  );
};

const Services = () => {
  const swiperRef = useRef(null);

  const [services, setServices] = useState([]);

useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "https://backend.biotechmaali.com/services/publicservice_list/"
      );

      // show only visible services
      const visibleServices = res.data.filter(item => item.Visible);

      setServices(visibleServices);
    } catch (error) {
      console.error(error);
    }
  };

  fetchServices();
}, []);


  // const services = [
  //   { title: "Landscape Design", Heading: "Transform Your Outdoor Space", Image: "https://images.unsplash.com/photo-1584479898061-15742e14f50d?auto=format&fit=crop&q=80&w=1200" },
  //   { title: "Terrace & Kitchen Gardens", Heading: "Grow Your Own Urban Oasis", Image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=1200" },
  //   { title: "Vertical Gardens", Heading: "Living Walls & Green Facades", Image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200" },
  //   { title: "Drip Irrigation", Heading: "Efficient Watering Solutions", Image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?auto=format&fit=crop&q=80&w=1200" },
  //   { title: "Garden Maintenance", Heading: "Keep Your Garden Thriving", Image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1200" }
  // ];


  if (!services.length) return null;

  return (
    <div className="w-full bg-gray-100">
      <section className="bg-white-100 py-6 m-10 font-sans sm:mt-[-2rem] md:mt-[-2rem] lg:mt-[-2rem]">
        <div className="mx-auto px-0">
          <h2 className="md:text-2xl text-xl font-bold text-gray-800 mb-6 text-center">
            Services
          </h2>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Swiper
              modules={[Navigation]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              spaceBetween={16}
              slidesPerView={4}
              centeredSlides={false}
              loop={true}
              navigation={{ prevEl: ".prev-button", nextEl: ".next-button" }}
              className="my-6"
            >
             {services.map((service) => (
  <SwiperSlide key={service.id}>
    <ServiceCard
      image={`https://backend.biotechmaali.com${service.Image}`}
      title={service.title}
      heading={service.Heading}
    />
  </SwiperSlide>
))}

            </Swiper>

            <div className="flex justify-center mt-4">
              <button className="prev-button bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
                <FaChevronLeft className="text-bio-green" />
              </button>
              <Link to="/services" className="bg-bio-green text-white px-6 py-1 rounded">
                View All
              </Link>
              <button className="next-button bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
                <FaChevronRight className="text-bio-green" />
              </button>
            </div>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              spaceBetween={16}
              slidesPerView={1.0}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{ prevEl: ".prev-button", nextEl: ".next-button" }}
              className="my-6"
            >
            {services.map((service) => (
  <SwiperSlide key={service.id}>
    <ServiceCard
      image={`https://backend.biotechmaali.com${service.Image}`}
      title={service.title}
      heading={service.Heading}
    />
  </SwiperSlide>
))}

            </Swiper>

            <div className="flex justify-center items-center mt-6 space-x-4">
              <button className="prev-button bg-white w-[36px] md:w-[40px] md:h-[40px] h-[36px] flex items-center justify-center rounded-full border">
                <FaChevronLeft className="text-bio-green" />
              </button>

              <Link to="/services" className="bg-bio-green text-white px-6 py-1 md:py-2 rounded">
                View All
              </Link>

              <button className="next-button bg-white w-[36px] md:w-[40px] md:h-[40px] h-[36px] flex items-center justify-center rounded-full border">
                <FaChevronRight className="text-bio-green" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
