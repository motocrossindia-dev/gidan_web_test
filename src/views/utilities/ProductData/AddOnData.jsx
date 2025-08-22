import React, { useState } from "react";
import { Paper, Typography, } from "@mui/material";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";


const AddOnData = ({
  name,
  price,
  oldPrice,
  imageUrl,
  product,
  inCart,
}) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate()
  const accessToken = useSelector(selectAccessToken);
  
 
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = async () => {
    // e.stopPropagation();
    if (!isAuthenticated) {
      navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      if (inCart) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/order/cart/?main_product_id=${product.id}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            // data: { main_prod_id: product.id }, // <-- Pass data inside `data`
          }
        );

        if (response.status === 200||response.status === 201) {
          enqueueSnackbar("Product Removed from cart", { variant: "success" });
          setIsAdded(!isAdded);
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/order/cart/`,
          { main_prod_id: product.id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Added to cart", { variant: "success" });
          setIsAdded(!isAdded);
        }
      }
    
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  return (
    <>
      {/* Desktop & Tablet View */}
      <div className="hidden sm:block">
      <Paper
  elevation={0}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  sx={{
    width: { xs: "70%", sm: "12rem", lg: "14rem" },
    height: { xs: "18rem", sm: "22rem", md: "28rem", lg: "22rem" },
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
  <div
    className="relative w-full flex justify-center mb-2"
    onMouseEnter={() => setIsImageHovered(true)}
    onMouseLeave={() => setIsImageHovered(false)}
  >
    <img name=" "   
      className={`w-30 h-28 sm:w-44 sm:h-40 lg:h-[200px] object-cover mt-4 lg:w-[200px] object-contain transition-transform duration-300 rounded-[2rem] 
          ${isImageHovered ? "scale-105" : "scale-100"}`}
      src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
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

  <div className="flex items-center gap-2 mb-4">
    <span className="text-sm font-semibold text-navy-blue">
      ₹{Math.round(price)}.00
    </span>
    {oldPrice && (
      <span className="text-xs text-gray-400 line-through">
        ₹{Math.round(oldPrice)}.00
      </span>
    )}
  </div>

  <button
    className="mt-auto mb-2 px-4 py-2 bg-bio-green text-white rounded-full text-sm font-medium"
    onClick={handleAddToCart}
  >
    Add to Cart
  </button>
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
          {/* <Checkbox
            size="medium"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
              backgroundColor: "white", 
              color: "#000", 
            }}
          /> */}

          <div className="relative w-full flex flex-col items-center p-2">
            <img name=" "   
              className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
              src={`${process.env.REACT_APP_API_URL}${product.image}`}
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
  {product.name.length > 10 ? `${product.name.slice(0, 10)}...` : product.name}
</Typography>


              <div className="flex flex-col justify-center items-center mt-1">
                <p className="text-xs font-medium text-black">
                  ₹{Math.round(product.selling_price)}.00
                </p>
                {product.mrp && (
                  <p className="text-xs text-gray-400 line-through">
                    ₹{Math.round(product.mrp)}.00
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
    className="mt-auto mb-2 px-4 py-2 bg-bio-green text-white rounded-full text-sm font-medium"
    onClick={handleAddToCart}
  >
    Add to Cart
  </button>
        </Paper>
      </div>
    </>
  );
};

export default AddOnData;
