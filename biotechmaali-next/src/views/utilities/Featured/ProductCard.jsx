'use client';

import React, { useState, useEffect } from "react";

import { FaStar } from "react-icons/fa";

import { Paper, Typography } from "@mui/material";

const ProductCard = ({ name, price, mrp, imageUrl, rating, product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);



  return (

    <div>
      <div className="hidden sm:block">
        <Paper
          elevation={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            width: { xs: "80%", sm: "14rem", lg: "16rem" },
            height: { xs: "20", sm: "24rem", md: "30rem", lg: "25rem" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "1rem",
            border: "1px solid transparent",
            "&:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-8px)",
              backgroundColor: "#CFFFBE",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          <div className="relative w-full flex justify-center mb-2"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <img name=" "   
              className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] object-cover mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] 
              ${isImageHovered ? "scale-105" : "scale-100"}`}
              src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
              loading="lazy"
              alt={name}
            />
          </div>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="w-4 h-4 text-navy-blue" />
            ))}
          </div>

          <h3 className="text-sm font-medium mb-2">{name}</h3>


          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-navy-blue">₹{Math.round(price)}</span>
            {mrp && <span className="text-xs text-gray-400 line-through">₹{Math.round(mrp)}</span>}
          </div>
        </Paper>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid transparent",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-5px)",
              backgroundColor: "#C2FFC7",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          <div className="relative w-full flex flex-col items-center p-2">
            <img name=" "   
              className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
              loading="lazy"
              alt={product.name}
            />

            <div className="flex flex-col p-2 w-full text-center gap-2">
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="w-3 h-3 text-navy-blue" />
                ))}
              </div>

              <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
                {product.name}
              </Typography>

              <div className="flex flex-col justify-center items-center mt-1">
                <p className="text-xs font-medium text-black">₹{Math.round(product.price)}</p>
                {product.mrp && (
                  <p className="text-xs text-gray-400 line-through">₹{Math.round(product.mrp)}</p>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ProductCard;
