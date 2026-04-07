'use client';


import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/axiosInstance";


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
        router.push("/login", { replace: true });
      } else {
        router.push("/login", { replace: true });
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
          window.dispatchEvent(new Event("cartUpdated"));
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
        router.push("/login", { replace: true });
      } else {
        router.push("/login", { replace: true });
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

        sessionStorage.setItem('checkout_ordersummary', JSON.stringify(placeOrderResponse.data.data));
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] font-sans p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#f8f7f0] relative w-full max-w-[480px] h-fit max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#375421] text-white p-6 pb-8 text-center relative overflow-hidden">
            {/* Background pattern/accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight mb-1 relative z-10">Shop The Look</h2>
            <p className="text-white/80 text-sm font-medium tracking-wide uppercase relative z-10">Add the full look to your garden</p>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide -mt-4 bg-[#f8f7f0] rounded-t-3xl relative z-10">
            <div className="space-y-3">
              {productss.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${product?.image}`}
                      alt={product?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1 ml-4 pr-2">
                    <h3 className="text-[15px] font-bold text-[#173113] leading-tight mb-0.5 line-clamp-1">
                      {product?.name}
                    </h3>
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                      {product?.size || "Standard Size"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#375421] font-black text-base">
                        ₹{product?.selling_price}
                      </span>
                      {product?.mrp > product?.selling_price && (
                        <span className="text-gray-300 line-through text-xs font-bold">
                          ₹{product?.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 bg-[#f8f7f0] flex flex-col gap-3">
            <button
              className="w-full py-4 bg-[#375421] text-white font-sans font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-[#2d451b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 active:scale-[0.98]"
              onClick={handlePlaceOrder}
            >
              Buy the full look <ArrowRight size={16} />
            </button>
            <button
              className="w-full py-4 text-[#375421] font-sans font-black text-sm uppercase tracking-widest rounded-2xl border-2 border-[#375421]/10 hover:bg-[#375421]/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              onClick={handleAddToCart}
            >
              Add set to cart <ShoppingCart size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupShopTheLook;
