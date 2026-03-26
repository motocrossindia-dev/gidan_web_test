'use client';

import React from "react";
import { Paper } from "@mui/material";

const ComboCard = ({ combo }) => {

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden sm:block transition-transform duration-300 hover:-translate-y-2">
        <Paper
          elevation={0}
          sx={{
            width: { xs: "80%", sm: "14rem", lg: "16rem" },
            height: "25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "1rem",
            border: "1px solid transparent",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#CFFFBE",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          {/* COMBO Ribbon */}
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
              COMBO
            </div>
          </div>

          {/* Product Image */}
          <div className="relative w-full flex justify-center mb-2">
            <img
              className="w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[260px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] hover:scale-105"
              src={`${process.env.NEXT_PUBLIC_API_URL}${combo?.image}`}
              alt={combo?.name}
              loading="lazy"
              width="400"
              height="400"
              style={{ aspectRatio: '1/1' }}
            />
          </div>

          {/* Details */}
          <div className="w-full flex flex-col items-center mt-5">
            <div className="flex gap-1 mb-2">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="text-xs text-gray-600">(0)</span>
            </div>
            <h2
              className="text-base sm:text-lg font-bold text-black mb-2 truncate max-w-full"
              title={combo?.name}
            >
              {combo?.name}
            </h2>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#375421]">
                  ₹{Math.round(combo?.selling_price)}
                </span>
                {combo?.mrp && (combo?.mrp > combo?.selling_price) && (
                  <span className="text-sm text-gray-400 line-through mt-0.5">
                    ₹{Math.round(combo?.mrp)}
                  </span>
                )}
              </div>

              {combo?.mrp && combo?.selling_price && (combo?.mrp > combo?.selling_price) && (
                <div className="bg-green-100 text-[#375421] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border border-green-200">
                  SAVE ₹{Math.round(combo?.mrp - combo?.selling_price)} ({Math.round(((combo?.mrp - combo?.selling_price) / combo?.mrp) * 100)}% OFF)
                </div>
              )}
            </div>
          </div>
        </Paper>
      </div>

      {/* Mobile */}
      <div className="sm:hidden transition-transform duration-300 hover:-translate-y-1.5">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "white",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#CFFFBE",
            },
          }}
        >
          {/* COMBO Ribbon */}
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-orange-500 text-white px-2 py-0.5 text-[10px] font-bold rounded shadow-md">
              COMBO
            </div>
          </div>

          <div className="relative w-full flex flex-col items-center p-3">
            {/* Image Section */}
            <div className="relative w-full flex justify-center mb-3">
              <img
                className="w-32 h-32 object-contain rounded-md transition-transform duration-300 relative z-50"
                src={`${process.env.NEXT_PUBLIC_API_URL}${combo?.image}`}
                alt={combo?.name}
                loading="lazy"
                width="400"
                height="400"
                style={{ aspectRatio: '1/1' }}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col items-center text-center">
              {/* Rating */}
              <div className="flex justify-center gap-1 items-center">
                <span className="text-yellow-400 text-xs">★★★★★</span>
                <p className="text-[10px] text-gray-600">(0)</p>
              </div>

              {/* Product Name */}
              <h2 className="mt-1 font-bold text-black text-[0.9rem] leading-tight">
                {combo?.name}
              </h2>

              <div className="flex flex-col items-center gap-0.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-[#375421]">
                    ₹{Math.round(combo?.selling_price)}
                  </span>
                  {combo?.mrp && (combo?.mrp > combo?.selling_price) && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{Math.round(combo?.mrp)}
                    </span>
                  )}
                </div>
                {combo?.mrp && combo?.selling_price && (combo?.mrp > combo?.selling_price) && (
                  <span className="text-[10px] font-bold text-[#375421] bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                    {Math.round(((combo?.mrp - combo?.selling_price) / combo?.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ComboCard;