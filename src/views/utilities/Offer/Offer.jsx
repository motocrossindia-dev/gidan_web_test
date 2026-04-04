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

function Offer({ initialOffers = [], initialBanners = [] }) {
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
  const [banners, setBanners] = useState(initialBanners);
  const [comboOffers, setComboOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const getPublicOffers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/public/`);
      const data = await response.json();
      if (data?.data) {
        setBanners(data.data.filter(b => b.is_visible));
      }
    } catch (error) {
      console.error("Error fetching public banners:", error);
    }
  };

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
    if (initialBanners.length === 0) {
      getPublicOffers();
    }
    getComboOffers();
  }, [initialOffers, initialBanners]);

  const handleBuyCombo = async (id) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Login or Signup to Buy Our Products.");
      router.push("/login", { replace: true });
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
        
        {/* Promotional Banners Section */}
        {banners.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-col items-center text-center mb-10">
              <span className="text-[#A7D949] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">Featured Promotions</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#173113]">Seasonal Campaign</h2>
              <div className="w-16 h-1 bg-[#A7D949] mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {banners.map((banner) => (
                <div 
                  key={banner.id}
                  className="group relative h-[300px] md:h-[400px] rounded-[30px] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => banner.link && router.push(banner.link)}
                >
                  {/* Banner Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={banner.image || banner.image_url} 
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Banner Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                    <h4 className="text-[#A7D949] font-bold text-xs uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {banner.title}
                    </h4>
                    <h3 className="text-white text-2xl md:text-3xl font-serif mb-2 leading-tight">
                      {banner.heading}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 mb-6 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {banner.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-white font-bold text-xs group/btn">
                      <span className="bg-white text-[#173113] px-6 py-3 rounded-full hover:bg-[#A7D949] transition-colors duration-300">
                        Explore Offer
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Categories of trust */}
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
