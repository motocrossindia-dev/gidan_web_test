import React from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const services = [
  {
    title: "HOME GARDEN",
    description:
      "Creating the perfect garden space for your home that reflects your lifestyle and vision for your outdoor sanctuary.",
    img: "https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "PLANT SELECTION",
    description:
      "Expert guidance on selecting the perfect plants for your climate, soil, and aesthetic preferences.",
    img: "https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "HARD SCAPING",
    description:
      "Creating beautiful and functional hardscape elements like patios, walkways, and retaining walls.",
    img: "https://images.unsplash.com/photo-1528092744838-b91de0a10615?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "PUBLIC GARDEN",
    description:
      "Designing and maintaining beautiful public spaces that enhance community well-being and environmental health.",
    img: "https://images.unsplash.com/photo-1598902108854-10e335adac99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  },
];

const Service03 = () => {
  return (
    <section className="py-16 px-6 md:px-16 bg-white" id="projects">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-500 uppercase tracking-wider">03 / SERVICES</p>
        <button
          className="text-green-800 hover:text-green-900 flex items-center bg-transparent border-none cursor-pointer"
        >
          See More Services <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Desktop View - Grid Layout */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="relative group overflow-hidden rounded-xl">
            <img name=" "   
              src={service.img}
              alt={service.title}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-bold mb-2">
                {service.title}
              </h3>
              <p className="text-white text-sm mb-4">{service.description}</p>
              <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full w-10 h-10 flex items-center justify-center">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Swiper */}
      <div className="sm:hidden">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="my-6"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="relative group overflow-hidden rounded-xl">
                <img name=" "   
                  src={service.img}
                  alt={service.title}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-white text-sm mb-4">{service.description}</p>
                  <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full w-10 h-10 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Service03;
