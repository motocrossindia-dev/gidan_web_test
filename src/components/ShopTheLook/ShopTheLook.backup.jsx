'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/axiosInstance";


function ShopTheLook() {
  const [showPopup, setShowPopup] = useState(false);
  const [shoplookData, setShoplookData] = useState(null);
  const [productss, setProducts] = useState([]);
  const [shopid, setShopid] = useState();

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    const fetchShoplook = async () => {
      try {
        const res = await axios.get(
            "https://backend.gidan.store/combo/combo-offers/"
        );
        const data = res?.data?.data?.shop_the_look[0];
        setShoplookData(data);
        setProducts(data?.products || []);
        setShopid(data?.id);
      } catch (error) {}
    };

    fetchShoplook();
  }, []);

  const handleBuyItNowSubmit = async () => {
    if (isAuthenticated) {
      const product_data = {
        order_source: "combo",
        combo_id: shopid,
      };

      try {
        const response = await axiosInstance.post(
            `/order/placeOrder/`,
            product_data
        );

        if (response.status === 200) {
          // Close the dialog first
          setShowPopup(false);

          // Show success message
          enqueueSnackbar("Order placed successfully!", { variant: "success" });

          // Navigate with the complete order data
          navigate("/checkout", {
            state: {
              ordersummary: response.data.data
            }
          });
        }
      } catch (error) {if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
      }
      }
    } else {
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      if (isMobile) {
        navigate("/mobile-signin", { replace: true });
      } else {
        navigate("/?modal=signIn", { replace: true });
      }
    }
  };

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
            <img
                src={`https://backend.gidan.store${shoplookData?.image}`}
                alt="Shop the Look"
                loading="lazy"
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
                    <img
                        src={`${process.env.REACT_APP_API_URL}${product?.image}`}
                        alt={product?.name}
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

          <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
            <button
                className="w-full md:w-1/2 py-3 bg-lime-500 text-white font-bold text-center rounded-lg hover:bg-lime-600 transition-colors"
                onClick={handleBuyItNowSubmit}
            >
              Place Order
            </button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default ShopTheLook;
