'use client';


import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/axiosInstance";
import { applyGstToOrderData } from "../../utils/serverApi";



const PopupShopTheLook = ({ onClose }) => {

  const accessToken = useSelector(selectAccessToken);
  const [productss, setProducts] = useState([])
  const [shopid, setShopid] = useState()
  const router = useRouter(); const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const getshpthelookproducts = async () => {
    try {

      const response = await axiosInstance.get(`/combo/shop_the_look_offers/`);

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

  useEffect(() => {
    getshpthelookproducts();
  }, [])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Login or Signup to add products to cart.");
      if (isMobile) {
        router.push("/mobile-signin", { replace: true });
      } else {
        router.push("/?modal=signIn", { replace: true });
      }
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/order/cart/add-combo/`,
        { combo_id: shopid }
      );

      console.log("✅ Add Combo to Cart Response:", response.data);
      console.log("✅ Cart Data:", response.data.data.cart);
      console.log("✅ Combo Add Info:", response.data.data.combo_add_info);

      if (response.status === 200 || response.status === 201) {
        const { combo_add_info } = response.data.data;

        if (combo_add_info.added_count > 0) {
          enqueueSnackbar(
            `${combo_add_info.added_count} products added to cart!`,
            { variant: "success" }
          );
        } else if (combo_add_info.already_in_cart_count > 0) {
          enqueueSnackbar(
            "All products are already in your cart!",
            { variant: "info" }
          );
        }

        onClose();
      }
    } catch (error) {
      console.error("❌ Add to Cart Error:", error);
      console.error("❌ Error Response:", error.response?.data);

      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Failed to add to cart. Please try again.", { variant: "error" });
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Login or Signup to place order.");
      if (isMobile) {
        router.push("/mobile-signin", { replace: true });
      } else {
        router.push("/?modal=signIn", { replace: true });
      }
      return;
    }

    try {
      // Place order directly using shop_the_look order source
      const placeOrderResponse = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/placeOrder/`,
        {
          order_source: "shop_the_look",
          combo_id: shopid
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Shop The Look Order Response:", placeOrderResponse.data);
      console.log("✅ Order Data:", placeOrderResponse.data.data);

      if (placeOrderResponse.status === 200) {
        onClose();
        enqueueSnackbar("Order placed successfully!", { variant: "success" });

        // Prepare combo offer data for checkout
        const comboOfferData = {
          id: shopid,
          title: "Shop The Look",
          final_price: placeOrderResponse.data.data.order.grand_total,
          products: productss.map(p => p.name),
          is_shop_the_look: true
        };

        sessionStorage.setItem('checkout_ordersummary', JSON.stringify(applyGstToOrderData(placeOrderResponse.data.data)));
        sessionStorage.setItem('checkout_combo_offer', JSON.stringify(comboOfferData));
        router.push("/checkout");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "info" });
      } else {
        enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 font-sans"
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
        <div className="bg-bio-green text-white text-center py-3 sticky top-0 z-10">
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
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product?.image}`}
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

                </div>

              </div>
            ))}
          </div>
        </Box>
        <div className="sticky bottom-0 z-10 bg-white p-4 flex justify-center gap-2">
          <button
            className="w-1/2 py-2 bg-bio-green text-white font-bold text-center rounded-lg hover:bg-green-800"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="w-1/2 py-2 bg-lime-500 text-white font-bold text-center rounded-lg hover:bg-lime-600"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupShopTheLook;
