'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { Paper, Typography } from "@mui/material";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import TrendingCard from './ProductCard';
import { getProductUrl } from "../../utils/urlHelper";
import axiosInstance from "../../Axios/axiosInstance";

const PeopleAlsoBought = ({ title = "People also bought" }) => {
    const [products, setProducts] = useState([]);
    const router = useRouter();

    const getProducts = async () => {
        try {
            const response = await axiosInstance.get(`/product/recentlyViewed/`);
            setProducts(response?.data?.data?.products || []);
        } catch (error) {
            console.error("Error fetching recently viewed products:", error);
            setProducts([]);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="my-8 p-4 bg-white rounded-md">
            <h2 className="md:text-2xl text-xl mb-4 text-center font-sans font-bold">{title}</h2>
            <div className="max-w-7xl mx-auto px-3">
                <div className="grid gap-4 justify-items-center font-sans grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {products.slice(0, 4).map((product) => (
                        <Link
                            key={product.id}
                            href={getProductUrl(product)}
                            onClick={() => window.scrollTo(0, 0)}
                            className="w-full sm:max-w-xs cursor-pointer block"
                        >
                            {/* Small Screens */}
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
                                        <div className="relative w-full flex justify-center mb-3">
                                            <img
                                                className="w-full h-40 object-cover rounded-lg transition-transform duration-300 relative z-10"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                                                alt={product.name}
                                            />
                                        </div>

                                        {/* Action Icons */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 z-20 opacity-0 hover:opacity-100 hover:translate-y-0">
                                            <button className="w-6 h-6 rounded-full bg-white hover:bg-[#375421] hover:text-white flex items-center justify-center transition-colors duration-200">
                                                <MdOutlineShoppingBag className="w-4 h-4" />
                                            </button>
                                            <button className="w-6 h-6 rounded-full bg-white hover:bg-[#375421] hover:text-white flex items-center justify-center transition-colors duration-200">
                                                <FaRegHeart className="w-4 h-4" />
                                            </button>
                                            <button className="w-6 h-6 rounded-full bg-white hover:bg-[#375421] hover:text-white flex items-center justify-center transition-colors duration-200">
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col p-2 w-full text-center gap-2">
                                            <div className="flex justify-center">
                                                <ReactStars
                                                    count={5}
                                                    value={product?.product_rating?.avg_rating || product?.rating || 0}
                                                    edit={false}
                                                    size={10}
                                                    activeColor="#0D2164"
                                                    char={<FaStar />}
                                                />
                                            </div>

                                            <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }} style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
                                                {product.name}
                                            </Typography>

                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-semibold text-black mt-1">
                                                    ₹{Math.round(product?.selling_price)}
                                                </p>

                                                {product?.mrp && (product?.mrp > product?.selling_price) && (
                                                    <span className="text-base text-gray-400 line-through mt-1">
                                                        ₹{Math.round(product?.mrp)}
                                                    </span>
                                                )}

                                                {product?.mrp && (product?.mrp > product?.selling_price) && (
                                                    <span className="text-sm font-semibold text-[#375421] mt-1">
                                                        {Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </div>

                            {/* Desktop View (md and above) */}
                            <div className="hidden sm:block">
                                <TrendingCard
                                    name={product?.name}
                                    price={Math.round(product?.selling_price)}
                                    mrp={Math.round(product?.mrp)}
                                    imageUrl={product?.image}
                                    rating={product?.product_rating?.avg_rating || 0}
                                    product={product}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PeopleAlsoBought;
