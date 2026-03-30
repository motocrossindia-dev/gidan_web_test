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
        <div className="my-8 px-4 md:px-8 lg:px-12 bg-[#faf9f6]">
            <div className="max-w-6xl mx-auto py-8">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
                        {title}
                    </h2>
                    <Link 
                        href="/featured" 
                        className="text-[11px] font-bold text-[#2d4a22] hover:underline flex items-center gap-1 group transition-all uppercase tracking-wider"
                    >
                        View all <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid gap-4 justify-items-center font-sans grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {products.slice(0, 4).map((product) => (
                        <Link
                            key={product.id}
                            href={getProductUrl(product)}
                            onClick={() => window.scrollTo(0, 0)}
                            className="w-full sm:max-w-xs cursor-pointer block group"
                        >
                            {/* Small Screens */}
                            <div className="sm:hidden">
                                <Paper
                                    elevation={0}
                                    className="group-hover:shadow-xl transition-all duration-500"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        position: "relative",
                                        overflow: "hidden",
                                        backgroundColor: "white",
                                        borderRadius: "20px",
                                        border: "1px solid #f0f0f0",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <div className="relative w-full flex flex-col items-center p-2">
                                        <div className="relative w-full flex justify-center mb-3 aspect-[4/5]">
                                            <img
                                                className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                                                alt={product.name}
                                            />
                                        </div>

                                        <div className="flex flex-col p-3 w-full text-left gap-1">
                                            <Typography style={{ fontWeight: "600", color: "#111", fontSize: "0.95rem", marginBottom: "4px" }}>
                                                {product.name}
                                            </Typography>
                                            
                                            <div className="flex items-center gap-1 mb-2">
                                                <div className="flex text-amber-400">
                                                    <ReactStars
                                                        count={5}
                                                        value={product?.product_rating?.avg_rating || product?.rating || 0}
                                                        edit={false}
                                                        size={12}
                                                        activeColor="#fbbf24"
                                                        char={<FaStar />}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-400">({product?.product_rating?.num_ratings || 0})</span>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₹{Math.round(product?.selling_price)}
                                                </p>
                                                <div className="bg-[#f3f6f1] text-[#2d4a22] px-3 py-1 rounded-lg text-xs font-bold border border-[#2d4a22]/5">
                                                    + Add
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </div>

                            {/* Desktop View (md and above) */}
                            <div className="hidden sm:block transition-all duration-500 group-hover:-translate-y-2">
                                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-0 h-full">
                                    <TrendingCard
                                        name={product?.name}
                                        price={Math.round(product?.selling_price)}
                                        mrp={Math.round(product?.mrp)}
                                        imageUrl={product?.image}
                                        rating={product?.product_rating?.avg_rating || 0}
                                        product={product}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PeopleAlsoBought;
