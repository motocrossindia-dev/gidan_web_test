'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axiosInstance from "../../../Axios/axiosInstance";
import { useSnackbar } from "notistack";
import { Tag, Sparkles, Lock, ChevronRight, ShieldCheck, Truck, RefreshCcw, Smartphone, CreditCard, X, Loader2 } from "lucide-react";

const CartSummary = ({
  totalItems,
  totalAmount,
  discount,
  totalSellingPrice,
  amountToFreeShipping,
  products,
}) => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-apply coupon from URL if present
    const couponFromUrl = searchParams.get('coupon');
    if (couponFromUrl) {
      setCouponCode(couponFromUrl);
      applyCoupon(couponFromUrl);
    }
  }, [searchParams]);

  const applyCoupon = async (code) => {
    const activeCode = code || couponCode;
    if (!activeCode) return;

    setIsApplying(true);
    try {
      const response = await axiosInstance.post(`/order/previewCoupon/`, {
        coupon_code: activeCode.toUpperCase(),
        order_source: "cart",
        products: products.map(p => ({
          prod_id: p.product_id,
          quantity: p.quantity
        }))
      });

      if (response.data?.status === "success" || response.data?.message === "success") {
        setCouponData(response.data.data);
        enqueueSnackbar("Coupon applied!", { variant: "success" });
      } else {
        enqueueSnackbar(response.data?.message || "Invalid coupon code", { variant: "error" });
      }
    } catch (err) {
      console.error("Coupon error:", err);
      enqueueSnackbar(err.response?.data?.message || "Failed to apply coupon", { variant: "error" });
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode("");
    enqueueSnackbar("Coupon removed", { variant: "info" });
  };
  // Prepare the cart data to be sent



  const handlePlaceOrder = async () => {
    const cartData = prepareCartData();

    try {
      const response = await axiosInstance.post(
        `/order/placeOrder/`,
        cartData
      );

      if (response.status === 200) {
        sessionStorage.setItem('checkout_ordersummary', JSON.stringify(response.data.data));
        sessionStorage.removeItem('checkout_combo_offer');
        router.push("/checkout");
      }
    } catch (error) {
      if (error.response?.data) {
        const { message, address_status } = error.response.data;

        // ✅ Show snackbar with error message
        enqueueSnackbar(message || "Something went wrong, please try again.", { variant: "error" });

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
    const data = {
      order_source: "cart",
      products: products.map((product) => ({
        prod_id: product.product_id,
        quantity: product.quantity,
      })),
    };
    
    if (couponData?.coupon_code) {
      data.coupon_code = couponData.coupon_code;
    }
    
    return data;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Order Summary</h2>
        
        {/* Coupon Section */}
        <div className="mb-8 group">
          <div className="flex items-center gap-2 mb-3">
             <Tag className="w-4 h-4 text-green-700" />
             <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Apply Coupon Code</span>
          </div>
          
          {!couponData ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Enter code (try GET10)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-green-600 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <button 
                  onClick={() => applyCoupon()}
                  disabled={isApplying || !couponCode}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-green-800 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["GET10", "SAVE15"].map(code => (
                  <div 
                    key={code}
                    onClick={() => { setCouponCode(code); applyCoupon(code); }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-100/50 cursor-pointer hover:bg-green-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-green-700" />
                    <span className="text-[10px] font-black text-green-800 tracking-tighter uppercase">{code} for {code === "GET10" ? "10%" : "15%"} off</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-green-800 tracking-widest uppercase">{couponData.coupon_code}</span>
                    <div className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] font-black rounded uppercase">Applied</div>
                 </div>
                  <p className="text-[11px] text-green-700 font-bold tracking-tight">Saved ₹{Math.round(couponData.discount_amount)} extra on this order!</p>
                  {couponData.redemption_message && (
                    <p className="text-[9px] text-green-600/70 font-medium leading-tight mt-1">{couponData.redemption_message}</p>
                  )}
              </div>
              <button 
                onClick={removeCoupon}
                className="relative z-10 w-8 h-8 rounded-xl bg-white/50 flex items-center justify-center text-green-800 hover:bg-red-50 hover:text-red-600 transition-all group-hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
              <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 text-green-100 opacity-50" />
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center text-sm font-medium text-gray-500">
            <span>Subtotal ({totalItems} items)</span>
            <span className="text-gray-900 font-bold">₹{Math.round(totalAmount)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-sm font-bold text-green-600">
              <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Product discount</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm font-medium text-gray-500">
            <span>Delivery</span>
            <div className="text-right">
              <span className={amountToFreeShipping <= 0 ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>
                {amountToFreeShipping <= 0 ? 'FREE' : '₹99'}
              </span>
              {amountToFreeShipping > 0 && (
                <span className="block text-[10px] font-bold text-gray-400 italic">Add ₹{Math.round(amountToFreeShipping)} more</span>
              )}
            </div>
          </div>

          {couponData && (
            <div className="flex justify-between items-center text-sm font-bold text-green-600 pt-2 border-t border-gray-50">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Coupon discount ({couponData.coupon_code})</span>
              <span>-₹{Math.round(couponData.discount_amount)}</span>
            </div>
          )}

          <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">TotalAmount</span>
              <span className="text-3xl font-black text-gray-900">₹{Math.round(totalSellingPrice + (amountToFreeShipping > 0 ? 99 : 0) - (couponData?.discount_amount || 0))}</span>
            </div>
          </div>

          {discount > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                 <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs font-black text-green-800 uppercase tracking-tight">
                You're saving ₹{Math.round(discount)} on this order
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-8 bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center justify-center gap-2 group"
        >
          <Lock className="w-4 h-4" />
          Proceed to Checkout
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Quick Payment Options */}
        <div className="mt-8 space-y-3">
           <div className="text-center">
              <div className="relative inline-block px-4 py-1 bg-white z-10 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">or pay instantly with</div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-100" />
           </div>
           
           <div className="grid grid-cols-2 gap-3">
             <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:border-green-200 transition-colors cursor-pointer group">
                <Smartphone className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                <span className="text-[11px] font-bold text-gray-600">UPI / GPay</span>
             </div>
             <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:border-green-200 transition-colors cursor-pointer group">
                <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                <span className="text-[11px] font-bold text-gray-600">PhonePe</span>
             </div>
           </div>
           <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:border-green-200 transition-colors cursor-pointer group">
              <Truck className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              <span className="text-[11px] font-bold text-gray-600">Cash on Delivery (COD)</span>
           </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3 px-2">
         <div className="flex items-center gap-3 text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-gray-400" />
               <span className="text-[11px] font-bold uppercase tracking-tight">Payments secured by RazorPay SSL</span>
            </div>
         </div>
         <div className="flex items-center gap-3 text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
            <div className="flex items-center gap-2">
               <RefreshCcw className="w-4 h-4 text-gray-400" />
               <span className="text-[11px] font-bold uppercase tracking-tight">7-day plant survival guarantee</span>
            </div>
         </div>
         <div className="flex items-center gap-3 text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
            <div className="flex items-center gap-2">
               <Truck className="w-4 h-4 text-gray-400" />
               <span className="text-[11px] font-bold uppercase tracking-tight">Expert packaging — 99.2% arrive healthy</span>
            </div>
         </div>
         <div className="flex items-center gap-3 text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-200 rounded-full" />
            <div className="flex items-center gap-2">
               <RefreshCcw className="w-4 h-4 text-gray-400" />
               <span className="text-[11px] font-bold uppercase tracking-tight">Easy returns within 7 days</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CartSummary;
