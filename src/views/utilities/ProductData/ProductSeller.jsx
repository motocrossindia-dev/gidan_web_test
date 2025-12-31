import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography } from "@mui/material";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import TrendingCard from '../../../Components/TrendingProducts/TrendingCard';


const ProductSeller = () => {
  const [products, setProducts] = useState([]);
  const [productsDetails, setProductsDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/product/homeProducts/`)
      .then(response => {
        if (response.data.message === 'success') {
          const filteredProducts = response.data.data.products.filter(product => product.is_best_seller === true);
          setProducts(filteredProducts.slice(0, 4)); // Show only the first 4 products
        } else {
          console.error("API response message is not 'success'");
        }
      })
      .catch(error => {
        console.error("There was an error fetching the products:", error);
      });
  }, []);

  const handleProductClick = (productId) => {
    navigate('/productdata');
  };

  return (
    <div className="my-8 p-4 bg-white rounded-md">
      <h2 className="md:text-2xl text-xl mb-4 text-left md:font font-sans">Best Seller</h2>
      <div className="max-w-7xl mx-auto px-3">
        <div className="grid gap-4 justify-items-center font-sans grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} onClick={() => handleProductClick(product.id)} className="w-full sm:max-w-xs">

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
                                  {/* <div className="relative w-full flex mb-4">
                                    <img name=" "   
                                      className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 relative z-10 mt-6"
                                      src={`${process.env.REACT_APP_API_URL}${product.image}`}
                                      loading="lazy"
                                      alt={product.name}
                                    />
                                  </div> */}
              
                                    <div className="relative w-full flex justify-center mb-3">
                                         <img
                                                                  className="w-full h-40 object-cover rounded-lg transition-transform duration-300 relative z-10"
                                                                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                                                                  alt={product.name}
                                                              />
                                      </div>
              
                                  {/* Action Icons */}
                                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 z-20 opacity-0 hover:opacity-100 hover:translate-y-0">
                                    <button className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200">
                                      <MdOutlineShoppingBag className="w-4 h-4" />
                                    </button>
                                    <button className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200">
                                      <FaRegHeart className="w-4 h-4" />
                                    </button>
                                    <button className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200">
                                      <FiEye className="w-4 h-4" />
                                    </button>
                                  </div>
              
              
              
              
              
              
              
              
              
                                  {/*  */}
              
                                  <div className="flex flex-col p-2 w-full text-center gap-2">
                                    <div className="flex justify-center">
                                      <ReactStars
                                        count={5}
                                        value={product?.rating || 0}
                                        edit={false}
                                        size={10}
                                        activeColor="#0D2164"
                                        char={<FaStar />}
                                      />
                                    </div>
              
                                    {/* <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
                                      {product?.name.slice(0, 5)}
                                    </Typography>
                                    <div className="flex flex-col justify-center items-center mt-1">
                                      <p className="text-xs font-medium text-black">₹{Math.round(product?.selling_price)}.00</p>
                                      {product?.oldPrice && (
                                        <p className="text-xs text-gray-400 line-through">₹{Math.round(product?.mrp)}.00</p>
                                      )}
                                    </div> */}
              
              
                                    {/* Product Name */}
                                                                <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }} style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
                                                                    {/* {product.name.length > 12
                                                                        ? `${product.name.slice(0, 11)}..`
                                                                        : product.name} */}
                                                                        { product.name }
                                                                </Typography>
                                    
                                                                <div className="flex items-center gap-2">
                                                                    {/* Price */}
                                                                    <p className="text-base font-semibold text-black mt-1">
                                                                        ₹{Math.round(product?.selling_price)}
                                                                    </p>
                                    
                                                                    {/* MRP */}
                                                                    {product?.mrp && (product?.mrp>product?.selling_price) && (
                                                                        <span className="text-base text-gray-400 line-through mt-1">
                                          ₹{Math.round(product?.mrp)}
                                        </span>
                                                                    )}
                                    
                                                                    {/* Discount */}
                                                                    {product?.mrp && (product?.mrp>product?.selling_price) && (
                                                                        <span className="text-sm font-semibold text-green-600 mt-1">
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
                  rating={product?.product_rating || 0}
                  product={product}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductSeller;
