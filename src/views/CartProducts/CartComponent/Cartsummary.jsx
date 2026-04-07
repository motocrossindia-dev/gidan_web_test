import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axiosInstance from "../../../Axios/axiosInstance";
import { useSnackbar } from "notistack";
import { Tag, Sparkles, Lock, ChevronRight, ShieldCheck, Truck, RefreshCcw, Smartphone, CreditCard, X, Loader2 } from "lucide-react";
import CouponSection from "../../../components/Shared/CouponSection";

const CartSummary = ({
  totalItems,
  totalAmount,
  discount,
  totalSellingPrice,
  amountToFreeShipping,
  products,
  completeYourGarden = [],
  handleAddToCart,
}) => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const [couponData, setCouponData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  const removeCoupon = () => {
    setCouponData(null);
    enqueueSnackbar("Coupon removed", { variant: "info" });
  };
  // Prepare the cart data to be sent

  const handlePlaceOrder = async () => {
    const isAuthenticatedMobile = typeof window !== 'undefined' ? !!localStorage.getItem('userData') : false;
    
    if (!accessToken && !isAuthenticatedMobile) {
      enqueueSnackbar("Please login to proceed with your order", { variant: "info" });
      router.push(window.innerWidth <= 640 ? "/login" : "/login");
      return;
    }

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
          <CouponSection 
            mode="cart"
            products={products.map(p => ({ prod_id: p.product_id, quantity: p.quantity }))}
            appliedCoupon={couponData}
            onSuccess={(data) => setCouponData(data)}
            onRemove={removeCoupon}
          />
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
              <span className="text-3xl font-black text-gray-900">₹{Math.round((Number(totalSellingPrice) || 0) + (amountToFreeShipping > 0 ? 99 : 0) - (Number(couponData?.discount_amount) || 0))}</span>
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

      {/* Complete Your Garden - Mobile Only (Below Summary) */}
      {completeYourGarden.length > 0 && (
        <div className="lg:hidden p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-tight">Complete your garden</h3>
            </div>
          </div>

          <div className="space-y-4">
            {completeYourGarden.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 group transition-all">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image.startsWith('http') ? item.image : `https://backend.gidan.store${item.image}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-gray-900 uppercase truncate mb-1">{item.name}</h4>
                  <p className="text-sm font-black text-[#375421]">₹{Math.round(item.selling_price)}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(item.main_prod_id || item.product_id || item.id)}
                  className="w-10 h-10 bg-[#375421] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
