'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/axiosInstance";
import { useShopTheLook } from "../../hooks/useShopTheLook";

function ShopTheLook() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Use TanStack Query hook for shop the look data
  const { data, isLoading } = useShopTheLook();
  const shoplookData = data?.shoplookData;
  const productss = data?.products || [];
  const shopid = data?.shopid;

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

        setShowPopup(false);
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
        `/order/placeOrder/`,
        {
          order_source: "combo",
          combo_id: shopid
        }
      );

      console.log("✅ Shop The Look Order Response:", placeOrderResponse.data);
      console.log("✅ Order Data:", placeOrderResponse.data.data);

      if (placeOrderResponse.status === 200) {
        setShowPopup(false);
        enqueueSnackbar("Order placed successfully!", { variant: "success" });
        const comboOfferData = {
          id: shopid,
          title: shoplookData?.title || "Shop The Look",
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

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="px-4 py-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-left font-semibold md:font-bold">
            Shop The Look
          </h2>
          <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!shoplookData) return null;

  return (
    <div className="w-full">
      <div className="px-4 py-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-left font-semibold md:font-bold">
          Shop The Look
        </h2>

        <button
          aria-label="Shop the Look"
          type="button"
          onClick={() => setShowPopup(true)}
          className="w-full overflow-hidden bg-white hover:opacity-95 transition-opacity"
        >
          <Image
            src={`https://backend.gidan.store${shoplookData?.image}`}
            alt="Shop the Look"
            width={1200}
            height={407}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="w-full h-auto object-contain"
          />
        </button>
      </div>

      {/* MUI Dialog */}
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#1e40af',
            color: 'white',
            textAlign: 'center',
            py: 2,
            position: 'relative'
          }}
        >
          <div>
            <h2 className="text-lg md:text-2xl font-bold">Shop The Look</h2>
            <p className="text-xs md:text-sm">Add the shop look to your cart</p>
          </div>
          <IconButton
            onClick={() => setShowPopup(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            {productss.map((product) => (
              <div
                key={product.id}
                className="flex items-center p-2 md:p-4 border-b last:border-b-0"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product?.image}`}
                  alt={product?.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg mr-3 md:mr-4 object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-lg font-semibold truncate">
                    {product?.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {product?.size}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-sm md:text-lg">
                      ₹{product?.selling_price}
                    </span>
                    <span className="text-gray-600 line-through text-xs md:text-sm">
                      ₹{product?.mrp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* <button
            className="w-full md:w-1/2 py-3 bg-blue-600 text-white font-bold text-center rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button> */}
          <button
            className="w-full md:w-1/2 py-3 bg-lime-500 text-white font-bold text-center rounded-lg hover:bg-lime-600 transition-colors"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ShopTheLook;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { enqueueSnackbar } from "notistack";
// // import { isMobile } from "react-device-detect";
// import { useSelector } from "react-redux";
// import axiosInstance from "../../Axios/axiosInstance";
//
//
// function ShopTheLook() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [shoplookData, setShoplookData] = useState(null);
//   const [productss, setProducts] = useState([]);
//   const [shopid, setShopid] = useState();
//
//   const router = useRouter();
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//
//   useEffect(() => {
//     const fetchShoplook = async () => {
//       try {
//         const res = await axios.get(
//             "https://backend.gidan.store/combo/combo-offers/"
//         );
//         const data = res?.data?.data?.shop_the_look[0];
//         setShoplookData(data);
//         setProducts(data?.products || []);
//         setShopid(data?.id);
//       } catch (error) {}
//     };
//
//     fetchShoplook();
//   }, []);
//
//   const handleBuyItNowSubmit = async () => {
//     if (isAuthenticated) {
//       const product_data = {
//         order_source: "combo",
//         combo_id: shopid,
//       };
//
//       try {
//         const response = await axiosInstance.post(
//             `/order/placeOrder/`,
//             product_data
//         );
//
//         if (response.status === 200) {
//           // Close the dialog first
//           setShowPopup(false);
//
//           // Show success message
//           enqueueSnackbar("Order placed successfully!", { variant: "success" });
//
//           // Navigate with the complete order data
//           router.push("/checkout", {
//             state: {
//               ordersummary: response.data.data
//             }
//           });
//         }
//       } catch (error) {if (error.response && error.response.status === 400) {
//         enqueueSnackbar(error.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
//       }
//       }
//     } else {
//       enqueueSnackbar("Please Login or Signup to Buy Our Products.");
//       if (isMobile) {
//         router.push("/mobile-signin", { replace: true });
//       } else {
//         router.push("/?modal=signIn", { replace: true });
//       }
//     }
//   };
//
//   if (!shoplookData) return null;
//
//   return (
//       <div className="w-full">
//         <div className="px-4 py-6">
//           <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-left font-semibold md:font-bold">
//             Shop The Look
//           </h2>
//
//           <button
//               aria-label="Shop the Look"
//               type="button"
//               onClick={() => setShowPopup(true)}
//               className="w-full overflow-hidden bg-white hover:opacity-95 transition-opacity"
//           >
//             <img
//                 src={`https://backend.gidan.store${shoplookData?.image}`}
//                 alt="Shop the Look"
//                 loading="lazy"
//                 className="w-full h-auto object-contain"
//             />
//           </button>
//         </div>
//
//         {/* MUI Dialog */}
//         <Dialog
//             open={showPopup}
//             onClose={() => setShowPopup(false)}
//             maxWidth="sm"
//             fullWidth
//             PaperProps={{
//               sx: {
//                 borderRadius: 2,
//                 maxHeight: '90vh',
//               }
//             }}
//         >
//           <DialogTitle
//               sx={{
//                 bgcolor: '#1e40af',
//                 color: 'white',
//                 textAlign: 'center',
//                 py: 2,
//                 position: 'relative'
//               }}
//           >
//             <div>
//               <h2 className="text-lg md:text-2xl font-bold">Shop The Look</h2>
//               <p className="text-xs md:text-sm">Add the shop look to your cart</p>
//             </div>
//             <IconButton
//                 onClick={() => setShowPopup(false)}
//                 sx={{
//                   position: 'absolute',
//                   right: 8,
//                   top: 8,
//                   color: 'white',
//                 }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//
//           <DialogContent sx={{ p: 0 }}>
//             <Box sx={{ p: 2 }}>
//               {productss.map((product) => (
//                   <div
//                       key={product.id}
//                       className="flex items-center p-2 md:p-4 border-b last:border-b-0"
//                   >
//                     <img
//                         src={`${process.env.NEXT_PUBLIC_API_URL}${product?.image}`}
//                         alt={product?.name}
//                         className="w-16 h-16 md:w-20 md:h-20 rounded-lg mr-3 md:mr-4 object-cover flex-shrink-0"
//                         loading="lazy"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-sm md:text-lg font-semibold truncate">
//                         {product?.name}
//                       </h3>
//                       <p className="text-xs md:text-sm text-gray-600">
//                         {product?.size}
//                       </p>
//                       <div className="flex items-center gap-2">
//                     <span className="text-green-600 font-bold text-sm md:text-lg">
//                       ₹{product?.selling_price}
//                     </span>
//                         <span className="text-gray-600 line-through text-xs md:text-sm">
//                       ₹{product?.mrp}
//                     </span>
//                       </div>
//                     </div>
//                   </div>
//               ))}
//             </Box>
//           </DialogContent>
//
//           <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
//             <button
//                 className="w-full md:w-1/2 py-3 bg-lime-500 text-white font-bold text-center rounded-lg hover:bg-lime-600 transition-colors"
//                 onClick={handleBuyItNowSubmit}
//             >
//               Place Order
//             </button>
//           </DialogActions>
//         </Dialog>
//       </div>
//   );
// }
//
// export default ShopTheLook;
// ========== END OLD CODE ==========
