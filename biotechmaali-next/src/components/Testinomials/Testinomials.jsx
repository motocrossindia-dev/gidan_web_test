'use client';



import React, { useState, useEffect } from "react";
import { FaQuoteRight, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Malikjan M",
    role: "Bangalore",
    image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/3ef25463-241c-425b-93b2-816065b61ff7/9d7291de-f849-4071-917b-ff200b756194.png",
    text: "Introducing our latest client testimonial video where one of our satisfied customers shares their experience with our terrace garden setup service. Watch as they talk about how our team of experts worked closely with them to create a beautiful and sustainable garden, customized to their specific needs and preferences. From initial consultation to final setup, our client highlights how our service exceeded their expectations and transformed their terrace space into a green oasis.",
    rating: 3,
  },
    {
        name: "Anjali K",
        role: "Happy Customer",
        image:
          "https://pplx-res.cloudinary.com/image/upload/t_limit/v1724992542/ai_generated_images/weigenxgckxweaoy48tm.png", // Replace with actual image URL
          text: "Introducing our latest client testimonial video where one of our satisfied customers shares their experience with our terrace garden setup service. Watch as they talk about how our team of experts worked closely with them to create a beautiful and sustainable garden, customized to their specific needs and preferences. From initial consultation to final setup, our client highlights how our service exceeded their expectations and transformed their terrace space into a green oasis.",
          rating: 4,
      },
      {
        name: "Ravi S",
        role: "Satisfied Client",
        image:
          "https://pplx-res.cloudinary.com/image/upload/t_limit/v1724992542/ai_generated_images/weigenxgckxweaoy48tm.png", // Replace with actual image URL
          text: "Introducing our latest client testimonial video where one of our satisfied customers shares their experience with our terrace garden setup service. Watch as they talk about how our team of experts worked closely with them to create a beautiful and sustainable garden, customized to their specific needs and preferences. From initial consultation to final setup, our client highlights how our service exceeded their expectations and transformed their terrace space into a green oasis.",
          rating: 4,
      },
];

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block m-8 px-48">
        <div className="p-6 w-full mt-15">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img name=" "   
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-sm text-gray-500">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-2 rounded ${
                    index === currentTestimonial ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            <div className="flex justify-end">
              <FaQuoteRight className="text-green-600 text-4xl font-semibold" />
            </div>
          </div>

          <div className="mb-4">
            <hr className="border-t-2 border-gray-300 mb-4" />
            <div className="flex items-center">
              {[...Array(testimonials[currentTestimonial].rating)].map(
                (_, index) => (
                  <FaStar key={index} className="text-green-500" />
                )
              )}
            </div>
          </div>

          <p className="text-gray-700 text-xl leading-relaxed">
            {testimonials[currentTestimonial].text}
          </p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-gray-50 p-4">
        <div className="flex items-start gap-3 mb-4">
          <img name=" "   
            src={testimonials[currentTestimonial].image}
            alt={testimonials[currentTestimonial].name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {testimonials[currentTestimonial].name}
            </h3>
            <p className="text-sm text-gray-500">
              {testimonials[currentTestimonial].role}
            </p>
          </div>
          <div className="ml-auto">
            <FaQuoteRight className="text-bio-green text-2xl" />
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full ${
                index === currentTestimonial
                  ? "bg-bio-green w-8"
                  : "bg-gray-300 w-4"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`${
                index < testimonials[currentTestimonial].rating
                  ? "text-bio-green"
                  : "text-gray-300"
              } text-lg`}
            />
          ))}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {testimonials[currentTestimonial].text}
        </p>
      </div>
    </>
  );
};

export default Testimonial;