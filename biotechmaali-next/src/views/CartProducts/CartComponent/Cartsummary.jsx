'use client';

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useEffect } from "react";
import Verify from "../../../Services/Services/Verify";
import axiosInstance from "../../../Axios/axiosInstance";
import { useSnackbar } from "notistack";   // ✅ import notistack

const CartSummary = ({
  totalItems,
  totalAmount,
  discount,
  // packagingFee,
  products,
}) => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
   

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  // Prepare the cart data to be sent



  const handlePlaceOrder = async () => {
    const cartData = prepareCartData();
  
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/order/placeOrder/`,
        cartData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        router.push("/checkout", { state: { ordersummary: response.data.data } });
      }
    } catch (error) {
      if (error.response?.data) {
        const { message, address_status } = error.response.data;

        // ✅ Show snackbar with error message
        enqueueSnackbar(message, { variant: "error" });

        // If address not available → redirect to profile
        if (address_status === false) {
          router.push("/profile");
        }
      } else {
        console.error("Error placing order:", error);
        enqueueSnackbar("Something went wrong, please try again.", { variant: "error" });
      }
    }
  };
  
  const prepareCartData = () => {
    return {
      order_source: "cart",
      products: products.map((product) => ({
        prod_id: product.product_id,
        quantity: product.quantity,
      })),
    };
  };

  if (totalItems === 0) {
    return (
      <div className="p-4 bg-white text-gray-500 text-center">
       
      </div>
    );
  }

  return (
    <>
    <Verify />
    <div className="p-4 bg-white text-gray-500 ">
      <h2 className="border-b pb-2 text-xl font-semibold mb-4">Price Details</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Price ({totalItems} items)</span>
          <span>₹{Math.round(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{Math.round(discount)}</span>
        </div>
        
        {/* <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="text-green-600">Free</span>
        </div> */}
        {/* <div className="flex justify-between">
          <span>Packaging Fee</span>
          <span>₹{packagingFee}</span>
        </div> */}
        <div className="border-y-2 border-dashed py-2 flex justify-between font-bold">
          <span>Total Amount</span>
          <span>₹{Math.round(totalAmount - discount)}</span>
        </div>
        <p className="text-green-600 mt-2">
          You will save ₹{Math.round(discount)} on this order
        </p>
      </div>


      <div className="flex justify-end">
        <button
          onClick={handlePlaceOrder}
          className="w-full md:full bg-lime-500 text-white py-2 m-4 rounded-sm hover:bg-green-600"
        >
          Place Order
        </button>
      </div>
    </div>
    </>
  );
};

export default CartSummary;
