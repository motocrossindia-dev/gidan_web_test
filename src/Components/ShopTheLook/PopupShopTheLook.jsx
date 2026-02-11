
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

// import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/axiosInstance";


const PopupShopTheLook = ({ onClose }) => {

    const accessToken = useSelector(selectAccessToken);
    const [productss,setProducts] = useState([])
    const [shopid,setShopid] = useState()
    const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

const getshpthelookproducts=async()=>{
  try {
    
    const response = await axiosInstance.get(`/combo/combo-offers/`); 
     
    if (response.status === 200) {
      const data = response.data.data.shop_the_look
      
      const productsArray = data[0]?.products;
      const shop_id = data[0]?.id
      setShopid(shop_id)
      
      setProducts(productsArray)
    }
  
  } catch (error) {
    console.log(error);
    
  }
}

useEffect(()=>{
  getshpthelookproducts();
},[])

const handleBuyItNowSubmit = async () => {

  // navigate(`/feature`);

  if (isAuthenticated) {

    const product_data = {
      order_source: "combo",
      combo_id: shopid,

    };

    try {
      const response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/order/placeOrder/`,
          product_data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
      );


      if (response.status === 200) {
        enqueueSnackbar("Order placed successfully!", {variant: "success"});

        if (window.innerWidth <= 768) {
          navigate("/checkout", {state: {ordersummary: response.data.data}}); // Navigate to mobile checkout
        } else {
          navigate("/checkout", {state: {ordersummary: response.data.data}}); // Navigate to regular checkout
        }
      }

    } catch (error) {
      console.error("Error placing order:", error);
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, {variant: "error"});
      } else {
        enqueueSnackbar("Failed to place order. Please try again.", {variant: "error"});
      }
    }
  } else {
    // If not authenticated, redirect based on device type
    enqueueSnackbar("Please Login or Signup to Buy Our Products.");
    if (isMobile) {
      navigate("/mobile-signin", {replace: true});
    } else {
      navigate("/?modal=signIn", {replace: true});
    }
  }
};

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white relative w-[90%] max-w-lg md:h-[85%] max-h-[85vh] overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="bg-blue-800 text-white text-center py-3 sticky top-0 z-10">
          <h2 className="text-lg md:text-2xl font-bold">Shop The Look</h2>
          <p className="text-xs md:text-sm">Add the shop look to your cart</p>
        </div>
        <Box
          className="overflow-y-auto flex-1 max-h-[calc(100%-4rem)] shadow-lg"
          sx={{
            boxShadow: 3,
          }}
        >
          <div className="p-4">
            {productss.map((product) => (
              <div
                key={product.id}
                className="flex items-center p-2 md:p-4 border-b last:border-b-0 relative"
              >
                <img name=" "
                  src={`${process.env.REACT_APP_API_URL}${product?.image}`}
                  alt={product?.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg mr-3 md:mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-sm md:text-lg font-semibold">
                    {product?.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {product?.size}
                  </p>
                  <div className="flex items-center">
                    <span className="text-green-600 font-bold text-sm md:text-lg mr-2">
                      {product?.selling_price}
                    </span>
                    <span className="text-gray-400 line-through text-xs md:text-sm">
                      {product?.mrp}
                    </span>
                  </div>
                  {/* {product.inStock ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => decrement(product.id)}
                        className="px-3 py-1 bg-lime-500 rounded text-xs md:text-sm font-semibold text-white"
                      >
                        -
                      </button>
                      <span className="text-sm md:text-lg font-medium">
                        {quantities[product.id]}
                      </span>
                      <button
                        onClick={() => increment(product.id)}
                        className="px-3 py-1 bg-lime-500 rounded text-xs md:text-sm font-semibold text-white"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <p className="text-red-600 mt-2 font-semibold text-sm">
                      Out of stock
                    </p>
                  )} */}
                </div>
                {/* Adjust the positioning of the delete button */}
                {/* <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Delete item"
                >
                  <RiDeleteBin6Line className="w-5 h-5 text-gray-500 hover:text-red-500" />
                </button> */}
              </div>
            ))}
          </div>
        </Box>
        <div className="sticky bottom-0 z-10 bg-white p-4 flex justify-center">
          <button className="w-1/2 py-2 bg-lime-500 text-white font-bold text-center rounded-lg hover:bg-lime-600" onClick={()=>handleBuyItNowSubmit()}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupShopTheLook;
