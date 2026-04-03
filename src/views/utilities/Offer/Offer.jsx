'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../../Axios/axiosInstance";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import ProductCard from "@/components/Shared/ProductCard";
import CategoryHero from "@/components/Shared/CategoryHero";
import OfferTabs from "./OfferTabs";
import ModernComboCard from "../ComboOffer/ModernComboCard";

function Offer({ initialOffers = [] }) {
  const offerSeoData = {
    heading_before: "Exclusive",
    italic_text: "Deals & Offers",
    heading_after: "for your sanctuary",
    description: "Unbeatable savings on nature's finest selection. Every plant is hand-selected and inspected for quality before shipping.",
    tags: [
        { label: "Limited Time" },
        { label: "Expert Formulated" },
        { label: "Free Delivery ₹2,000+" }
    ],
    stats: [
        { value: "50+", label: "Special Offers" },
        { value: "5K+", label: "Happy Plants" },
        { value: "4.9★", label: "Avg. Rating" }
    ],
    info_cards: [
        { title: "Quality Guarantee", content: "Each plant is hand-selected and inspected before shipping." },
        { title: "Safe Transit", content: "Custom botanical packaging ensures healthy arrival." }
    ]
  };

  const breadcrumb = {
    items: [],
    currentPage: "Offers"
  };

  const [activeTab, setActiveTab] = useState('products');
  const [offers, setOffers] = useState(initialOffers);
  const [comboOffers, setComboOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const getOfferProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/offerProducts/`);
      if (response.status === 200) {
        setOffers(response.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const getComboOffers = async () => {
    try {
      const response = await axiosInstance.get(`/combo/combo_offers_list/`);
      if (response.status === 200) {
        setComboOffers(response.data.data?.combo_offers || []);
      }
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  useEffect(() => {
    if (initialOffers.length === 0) {
      getOfferProducts();
    }
    getComboOffers();
  }, [initialOffers]);

  const handleBuyCombo = async (id) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      if (isMobile) {
        router.push("/login", { replace: true });
      } else {
        router.push("/login", { replace: true });
      }
      return;
    }

    const product_data = {
      order_source: "combo",
      combo_id: id,
      quantity: 1
    };

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/order/placeOrder/`, product_data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const ordersummary = response?.data?.data;
        const selectedOffer = comboOffers.find((o) => o.id === id) || null;

        if (selectedOffer) {
          sessionStorage.setItem("selected_combo_offer", JSON.stringify(selectedOffer));
          sessionStorage.setItem("checkout_combo_offer", JSON.stringify(selectedOffer));
        }
        sessionStorage.setItem('checkout_ordersummary', JSON.stringify(ordersummary));
        router.push("/checkout");
      }
    } catch (error) {
      console.error("Error placing combo order:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to place order.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <CategoryHero 
        data={offerSeoData} 
        breadcrumb={breadcrumb}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Tab Selection */}
        <OfferTabs activeTab={activeTab} setTab={setActiveTab} />

        {/* Content Section */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'products' ? (
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center mb-10">
                <span className="text-[#A7D949] font-black uppercase tracking-[0.3em] text-xs mb-2">Individual Deals</span>
                <h2 className="text-4xl font-serif text-[#173113]">Special Products</h2>
                <p className="text-gray-500 mt-2 font-serif">Handpicked plant deals</p>
                <div className="w-24 h-1 bg-[#A7D949] mt-4 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {offers?.map((offer, index) => (
                  <ProductCard
                    key={`prod-offer-${offer.id}-${index}`}
                    product={offer}
                    priority={true}
                  />
                ))}
              </div>
              
              {offers.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-400 font-serif">No individual offers available at the moment.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
               <div className="flex flex-col items-center text-center mb-10">
                <span className="text-[#A7D949] font-black uppercase tracking-[0.3em] text-xs mb-2">Value Bundles</span>
                <h2 className="text-4xl font-serif text-[#173113]">Specially Curated Combos</h2>
                <div className="w-24 h-1 bg-[#A7D949] mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {comboOffers?.map((offer, index) => (
                  <div key={`combo-offer-${offer.id}-${index}`} onClick={() => handleBuyCombo(offer.id)}>
                    <ModernComboCard offer={offer} />
                  </div>
                ))}
              </div>

              {comboOffers.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-400 font-serif">No combo deals available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust & Policy Section */}
        <div className="mt-24 pt-16 border-t border-[#173113]/5">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { title: 'Quality Guarantee', desc: 'Each plant is hand-selected and inspected before shipping.' },
               { title: 'Safe Transit', desc: 'Custom botanical packaging ensures healthy arrival.' },
               { title: 'Care Support', desc: 'Lifetime support and digital care guides for every purchase.' }
             ].map((item, i) => (
               <div key={i} className="text-center">
                 <h3 className="font-serif text-xl text-[#173113] mb-2">{item.title}</h3>
                 <p className="text-gray-500 text-sm">{item.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;
