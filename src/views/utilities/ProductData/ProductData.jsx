'use client';

import { useRouter, usePathname, useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/Slice/cartSlice";
import { addtowishlist } from "../../../redux/Slice/addtowishlistSlice";
import { savePendingCartItem, savePendingWishlistItem } from "../../../utils/pendingAction";
import {

    ShoppingCart,
    Heart,
    ChevronLeft,
    ChevronRight,
    Truck,
    Tag,
    Sparkles,
    Copy,
    Share2,
    Link as LinkIcon,
    Search
} from "lucide-react";
import RightDrawer from "../../../components/Shared/RightDrawer";
import ProductSeller from "./ProductSeller";
import ProductReviews from "./ProductReviews";
import PeopleAlsoBought from "../../../components/Shared/PeopleAlsoBought";
import ProductFeatured from "./ProductFeatured";
import TrustBadges from "../../../components/Shared/TrustBadges";
import AddOnProduct from "./AddOnProduct";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { isMobile } from "react-device-detect";
import AboutTheProducts from "./AboutTheProducts";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt, FaChevronLeft, FaChevronRight, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
// Schemas moved to Server Component (page.tsx) for better SSR/SEO
import WriteAReview from "./WriteAReview";
import StoreSchema from "../seo/StoreSchema";

// import FaqAccordion from "./ProductFaq";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "../../../utils/ga4Ecommerce";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { toSlugString, getProductUrl, convertToSlug } from "../../../utils/urlHelper";
import { setCartItems } from "../../../redux/Slice/cartSlice";



const productdata =
    "https://firebasestorage.googleapis.com/v0/b/zpos-uk.appspot.com/o/67977213135ebb17c407e687%2F2025%2F1%2F1738430215367_scaled_Peacelilly.png?alt=media";

const productData = {
    name: "Peace Lily Plant",
    prices: {
        "2ft": 399.0,
        "4ft": 499.0,
        "6ft": 599.0,
    },
    originalPrices: {
        "2ft": 499.0,
        "4ft": 599.0,
        "6ft": 699.0,
    },
    rating: 4,
    images: [productdata, productdata, productdata, productdata],
    sizes: ["2ft", "4ft", "6ft"],
    planters: {
        "2ft": ["Mini Pot", "Small Roma", "Small Diamond"],
        "4ft": ["Medium Pot", "Medium Roma", "Medium Diamond", "Medium Spira"],
        "6ft": [
            "Large Pot",
            "Large Roma",
            "Large Diamond",
            "Large Spira",
            "XL Roma",
        ],
    },
    planterSizes: {
        "2ft": ["2ft", "2.5ft", "3ft"],
        "4ft": ["4ft", "4.5ft", "5ft"],
        "6ft": ["6ft", "6.5ft", "7ft"],
    },
    colors: {
        "2ft": {
            "Mini Pot": ["white", "beige", "gray"],
            "Small Roma": ["terracotta", "black", "green"],
            "Small Diamond": ["silver", "gold", "rose gold"],
        },
        "4ft": {
            "Medium Pot": ["white", "black", "blue", "green"],
            "Medium Roma": ["terracotta", "gray", "brown", "green"],
            "Medium Diamond": ["silver", "gold", "copper", "black"],
            "Medium Spira": ["white", "black", "silver", "gold"],
        },
        "6ft": {
            "Large Pot": ["white", "black", "gray", "brown", "green"],
            "Large Roma": ["terracotta", "black", "gray", "green", "blue"],
            "Large Diamond": ["silver", "gold", "rose gold", "black", "white"],
            "Large Spira": ["white", "black", "silver", "gold", "copper"],
            "XL Roma": ["terracotta", "gray", "brown", "green", "blue"],
        },
    },
    description:
        "Are you a sucker for succulents? Then the Mini Jade succulent will be your dream plant! As one of the easiest houseplants to look after, the Crassula Green Mini plant boasts a lush foliage which beautifies any room. The Jade is also considered lucky as per Feng Shui for its coin-like round plump leaves. So, go ahead and bring Jade home... luck just tags along!",
    addOns: [
        { name: "Peace Lily Plant", price: 499.0, image: productdata },
        { name: "Snake Plant", price: 399.0, image: productdata },
        { name: "Monstera Deliciosa", price: 599.0, image: productdata },
        { name: "Aloe Vera", price: 299.0, image: productdata },
    ],
};

export default function ProductData({ initialProductData }) {
    const pathname = usePathname();
    const [selectedImage, setSelectedImage] = useState(0);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedgram, setSelectedGram] = useState("");
    const [selectedLitre, setSelectedLitre] = useState("");
    const [selectedPlanterSize, setSelectedPlanterSize] = useState("");
    const [selectedPlanter, setSelectedPlanter] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [addOnData, setAddOnData] = useState(initialProductData?.data?.product_add_ons || []);
    const [quantity, setQuantity] = useState(1);
    const stockCheckTimer = useRef(null);
    const [inWishlist, setInWishlist] = useState(null)
    const [productDetailData, setProductDetailData] = useState(initialProductData || []);
    const [imageThumbnails, setImageThumbnails] = useState(initialProductData?.data?.product?.images || []);
    const [mainProductId, setMainProductId] = useState(initialProductData?.data?.product?.id || null);
    const params = useParams();

    // Always use 3-segment URL pattern: /:categorySlug/:subcategorySlug/:productSlug/
    const id = null?.product_id || params.productSlug || params.id;

    const [product_slug, setproduct_slug] = useState(null?.product_id || id);
    const [scategory_slug, setcategory_slug] = useState(null?.category_slug || params.categorySlug);
    const [ssubcategory_slug, setsubcategory_slug] = useState(null?.sub_category_slug || params.subcategorySlug);

    // Track current URL for canonical tag synchronization
    const [currentUrl, setCurrentUrl] = useState(() =>
        typeof window !== 'undefined' ? window.location.pathname : ''
    );

    const [pincode, setPincode] = useState("");
    const [error, setError] = useState("");
    const [showNoDeliveryPopup, setShowNoDeliveryPopup] = useState(false);

    // ==========auth cart
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAuthenticatedMobile] = useState(() => typeof window !== 'undefined' ? !!localStorage.getItem('userData') : false);

    const [token] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const accessToken = useSelector(selectAccessToken);

    // ========== Free Shipping PDP Progress Logic (Synced with Cart)
    const cartItems = useSelector(state => state.cart.items) || [];
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);

    const fetchCartItems = async () => {
        if (!isAuthenticated && !isAuthenticatedMobile) return;
        try {
            const response = await axiosInstance.get(`/order/cart/`);
            if (response.data?.message === "success") {
                dispatch(setCartItems(response.data.data.cart));
            }
        } catch (err) {
            console.error("Error fetching cart for PDP sync:", err);
        }
    };

    useEffect(() => {
        const fetchThreshold = async () => {
            try {
                const response = await axiosInstance.get(`/utils/freeShipping/`);
                if (response.data?.status === "success" || response.data?.message === "success") {
                    const threshold = response.data?.data?.threshold || response.data?.threshold || 2000;
                    setFreeShippingThreshold(Number(threshold));
                }
            } catch (err) {
                console.error("Error fetching free shipping threshold:", err?.message);
            }
        };

        fetchThreshold();
        fetchCartItems();

        // Listen for external cart updates (e.g. from Sidebar or other components)
        window.addEventListener("cartUpdated", fetchCartItems);
        return () => window.removeEventListener("cartUpdated", fetchCartItems);
    }, [isAuthenticated, isAuthenticatedMobile]);

    // Calculate total including current item's potential addition
    const currentProductId = productDetailData?.data?.product?.id;

    // Calculate current cart total EXCLUDING any existing version of this product
    const otherItemsTotal = cartItems.reduce((acc, item) => {
        if (item.id === currentProductId || item.main_prod_id === currentProductId) return acc;
        return acc + (Number(item.selling_price || 0) * Number(item.quantity || 0));
    }, 0);

    const sellingPrice = productDetailData?.data?.product?.selling_price || 0;
    const currentItemContribution = sellingPrice * quantity;

    const combinedTotal = otherItemsTotal + currentItemContribution;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - combinedTotal);
    const freeShippingProgress = Math.min(100, (combinedTotal / freeShippingThreshold) * 100);

    // ========== Coupon Discovery Logic
    const [allCoupons, setAllCoupons] = useState([]);
    const [bestCoupon, setBestCoupon] = useState(null);
    const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axiosInstance.get(`/coupon/coupons/`);
                if (response.data?.status === "success" || response.data?.message === "success") {
                    const coupons = response.data.coupons || response.data.data?.coupons || [];
                    setAllCoupons(coupons);

                    // Filter applicable coupons
                    const currentProduct = productDetailData?.data?.product;
                    const catId = currentProduct?.category_id;
                    const prodId = currentProduct?.id;

                    const applicable = coupons.filter(c => {
                        const isGlobal = !c.applicable_products?.length && !c.applicable_categories?.length && !c.applicable_combination_products?.length;
                        const appliesToProduct = c.applicable_products?.includes(prodId);
                        const appliesToCategory = c.applicable_categories?.some(cat => cat.id === catId || cat === catId);

                        // Also check variants (combination products)
                        const currentVariantId = productDetailData?.data?.product?.id; // The variant is the product ID in this structure
                        const appliesToVariant = c.applicable_combination_products?.includes(currentVariantId);

                        return isGlobal || appliesToProduct || appliesToCategory || appliesToVariant;
                    });

                    if (applicable.length > 0) {
                        // Sort by discount value (approximate logic: fixed amount > percentage if high value)
                        const best = applicable.sort((a, b) => (b.discount_value || 0) - (a.discount_value || 0))[0];
                        setBestCoupon(best);
                    }
                }
            } catch (err) {
                console.error("Error fetching coupons for PDP:", err);
            }
        };
        fetchCoupons();
    }, [productDetailData]);

    const handleCopyCoupon = (code) => {
        navigator.clipboard.writeText(code);
        enqueueSnackbar("Coupon code copied!", { variant: "success" });
    };

    // ========== Manual Coupon Application (PDP Preview)
    const [manualCouponCode, setManualCouponCode] = useState("");
    const [appliedCouponInfo, setAppliedCouponInfo] = useState(null);
    const [isPreviewingCoupon, setIsPreviewingCoupon] = useState(false);

    const handleApplyCouponPreview = async (codeToApply) => {
        const activeCode = codeToApply || manualCouponCode;
        if (!activeCode) {
            enqueueSnackbar("Please enter a coupon code.", { variant: "warning" });
            return;
        }

        setIsPreviewingCoupon(true);
        try {
            const currentProduct = productDetailData?.data?.product;
            const payload = {
                coupon_code: activeCode.toUpperCase(),
                order_source: "product",
                products: [
                    {
                        prod_id: currentProduct?.id,
                        quantity: quantity
                    }
                ]
            };

            const response = await axiosInstance.post(`/order/previewCoupon/`, payload);

            if (response.data?.status === "success" || response.data?.message === "success") {
                setAppliedCouponInfo(response.data.data);
                enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
            } else {
                enqueueSnackbar(response.data?.message || "Invalid coupon code.", { variant: "error" });
            }
        } catch (err) {
            console.error("PDP Coupon Error:", err);
            enqueueSnackbar(err.response?.data?.message || "Failed to apply coupon.", { variant: "error" });
        } finally {
            setIsPreviewingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCouponInfo(null);
        setManualCouponCode("");
        enqueueSnackbar("Coupon removed.", { variant: "info" });
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        enqueueSnackbar("Product link copied to clipboard!", { variant: "success" });
    };

    const handleWhatsAppShare = () => {
        const p = productDetailData?.data?.product;
        const name = p?.name || "Check this out";
        const url = window.location.href;
        const text = `Check out this ${name} on Gidan: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handleInstagramShare = () => {
        // IG doesn't support direct link sharing via web URL.
        // We trigger the native share if available, or just copy link.
        if (navigator.share) {
            navigator.share({
                title: productDetailData?.data?.product?.name,
                url: window.location.href
            }).catch(() => handleCopyLink());
        } else {
            handleCopyLink();
            enqueueSnackbar("Link copied! You can now share it in your Instagram stories or DMs.", { variant: "info" });
        }
    };

    // Re-validate or reset coupon if selection changes
    useEffect(() => {
        if (appliedCouponInfo) {
            setAppliedCouponInfo(null);
            setManualCouponCode("");
        }
    }, [quantity, selectedSize, selectedPlanter, selectedColor]);

    // Robust access to rating and review data which might be at top level or nested under .data
    // SSR data from fetchProductDetail returns the whole response object { message, data: { ... } }
    const ratingData = productDetailData?.data?.product_rating || productDetailData?.product_rating || productDetailData?.data?.product?.product_rating || { avg_rating: 0, num_ratings: 0, stars_given: [] };
    const reviewData = productDetailData?.data?.product_reviews || productDetailData?.product_reviews || productDetailData?.data?.product?.product_reviews || [];

    const isInCart = productDetailData?.data?.product?.is_cart;

    const [optionType, setOptionType] = useState(null);

    const hasWeights = productDetailData?.data?.product_weights?.length > 0;
    const hasLitres = productDetailData?.data?.product_litres?.length > 0;

    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);

    const handleWriteReviewClick = async () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign in to write a review.", { variant: "info" });
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        const currentProduct = productDetailData?.data?.product;
        if (!currentProduct?.id) {
            enqueueSnackbar("Error: Product information is missing", { variant: "error" });
            return;
        }

        setIsCheckingPurchase(true);
        try {
            const response = await axiosInstance.get(`/order/orderHistory/`);
            const allOrders = response?.data?.data?.orders || [];

            let purchaseRecord = null;
            // 1. Check order summaries first (fastest)
            for (const order of allOrders) {
                const summary = order?.product_details;
                if ((summary?.id === currentProduct.id ||
                    summary?.product_id === currentProduct.id ||
                    summary?.product_name?.toLowerCase() === (currentProduct.main_product_name || currentProduct.name || "").toLowerCase()) &&
                    order.status === 'DELIVERED') {
                    purchaseRecord = order;
                    break;
                }
            }

            // 2. If not found, check detail items for the last 10 orders (more thorough)
            if (!purchaseRecord && allOrders.length > 0) {
                const recentOrders = allOrders.slice(0, 10);
                for (const order of recentOrders) {
                    if (order.status !== 'DELIVERED') continue;
                    try {
                        const itemsResponse = await axiosInstance.get(`/order/orderHistoryItems/${order?.id}`);
                        const items = itemsResponse?.data?.data?.order_items || [];
                        const found = items.some(item =>
                            item.product_id === currentProduct.id ||
                            item.product_name?.toLowerCase().includes((currentProduct.main_product_name || currentProduct.name || "").toLowerCase())
                        );
                        if (found) {
                            purchaseRecord = order;
                            break;
                        }
                    } catch (e) {
                        console.error("Error checking order items:", e);
                    }
                }
            }

            if (purchaseRecord) {
                setIsReviewModalOpen(true);
            } else {
                const hasAnyPurchase = allOrders.some(order =>
                    order?.product_details?.id === currentProduct.id ||
                    order?.product_details?.product_id === currentProduct.id
                );

                if (hasAnyPurchase) {
                    enqueueSnackbar("You can only write a review once the product is delivered.", { variant: "warning" });
                } else {
                    enqueueSnackbar("You must purchase this product before writing a review.", { variant: "warning" });
                }
            }
        } catch (error) {
            console.error("Error checking purchase history:", error);
            enqueueSnackbar("Failed to verify purchase history. Please try again.", { variant: "error" });
        } finally {
            setIsCheckingPurchase(false);
        }
    };

    const handleViewReviewClick = () => {
        const reviewSection = document.getElementById('reviews');
        if (reviewSection) {
            reviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const lensSize = 120; // square lens size
    const zoomLevel = 2.5; // magnification level

    const imageRef = useRef(null);
    const imgRef = useRef(null);
    const product = productDetailData?.data?.product;

    // Helper to update URL with variant query parameter while keeping base slug
    const updateUrlWithParams = (newProduct) => {
        const urlParams = new URLSearchParams(window.location.search);

        // Clear old variant parameters and use only the single variant ID
        const oldParams = ['size_id', 'color_id', 'planter_id', 'planter_size_id', 'litre_id', 'weight_id'];
        oldParams.forEach(param => urlParams.delete(param));

        if (newProduct?.id) {
            urlParams.set('variant', newProduct.id);
        } else {
            urlParams.delete('variant');
        }

        const queryString = urlParams.toString();

        // Always use the primary slug field for a clean, stable URL
        const baseSlug = toSlugString(newProduct?.slug) || params.productSlug;
        const catSlug = toSlugString(newProduct?.category_slug) || params.categorySlug;
        const subCatSlug = toSlugString(newProduct?.sub_category_slug) || params.subcategorySlug || "all";

        // Construct clean URL - NO trailing slash before query params as requested
        const newUrl = `/${catSlug}/${subCatSlug}/${baseSlug}${queryString ? '?' + queryString : '/'}`;

        window.history.replaceState(null, "", newUrl);
        setCurrentUrl(newUrl);
    };


    // ⬆️ Scroll to top on navigation
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [pathname]);

    // Auto-scroll to Write a Review section when it's opened
    useEffect(() => {
        if (isReviewModalOpen) {
            setTimeout(() => {
                const element = document.getElementById('write-review-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [isReviewModalOpen]);

    // URL normalization: ensure the URL uses the primary product slug
    // This fires when product data becomes available (from SSR or fetch)
    useEffect(() => {
        if (!product) return;

        const expectedSlug = toSlugString(product.slug);
        const currentSlug = params.productSlug;

        if (expectedSlug && currentSlug !== expectedSlug) {
            const catSlug = toSlugString(product.category_slug) || params.categorySlug;
            const subCatSlug = toSlugString(product.sub_category_slug) || params.subcategorySlug || "all";

            const urlParams = new URLSearchParams(window.location.search);
            const queryString = urlParams.toString();
            const cleanUrl = `/${catSlug}/${subCatSlug}/${expectedSlug}${queryString ? '?' + queryString : '/'}`;

            window.history.replaceState(null, "", cleanUrl);
            setCurrentUrl(cleanUrl);
        }
    }, [product?.id, product?.slug]);





    const handlePincodeChange = (e) => {
        const value = e.target.value;

        // Allow only digits and max 6 chars
        if (/^\d{0,6}$/.test(value)) {
            setPincode(value);
            setError(""); // Clear error if any
        }
    };

    const handleCheck = async () => {
        if (pincode.length !== 6) {
            setError("Please enter a valid 6-digit pincode");
            return;
        }

        try {

            const response = await axiosInstance.post(`/tracking/check-pincode/`, {
                pincode: pincode
            })
            if (response.status === 200) {
                const isAvailable = response?.data?.delivery_available;

                if (isAvailable) {
                    enqueueSnackbar("Great news! Delivery is available in your area 🎉", {
                        variant: "success",
                    });
                } else {
                    setShowNoDeliveryPopup(true);
                }
            }
        } catch (error) {
            setShowNoDeliveryPopup(true);
        }

    };

    const dispatch = useDispatch();
    const router = useRouter();

    const handleAddToCartSubmit = async () => {
        if (isAuthenticated || isAuthenticatedMobile) {
            const productId = productDetailData?.data?.product?.id;
            if (!productId) {
                enqueueSnackbar("Product is still loading. Please wait.", { variant: "warning" });
                return;
            }

            // Stock check before adding to cart
            try {
                await axiosInstance.get(`/product/stockCheck/${productId}/`, {
                    params: { quantity, action: "increment" },
                });
            } catch (err) {
                enqueueSnackbar(err?.response?.data?.message || "Not enough stock available.", { variant: "warning" });
                return;
            }

            const product_data = {
                prod_id: productId,
                quantity: quantity,
            };

            try {
                const response = await axiosInstance.post(`/order/cart/`, product_data);

                if (response.status === 201 || response.status === 200) {
                    dispatch(addToCart(product_data));
                    enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
                    window.dispatchEvent(new Event("cartUpdated"));
                    trackAddToCart(productDetailData?.data?.product, quantity);

                    // Navigate to cart with coupon (priority: manual > best)
                    const finalCouponCode = appliedCouponInfo?.coupon_code || (bestCoupon ? bestCoupon.code : "");
                    const couponParam = finalCouponCode ? `?coupon=${finalCouponCode}` : "";
                    router.push(`/cart${couponParam}`);
                }
            } catch (error) {
                const msg = error.response?.data?.message || "";
                const availableStock = error.response?.data?.available_stock;
                if (msg.toLowerCase().includes("not enough stock") || msg.toLowerCase().includes("stock")) {
                    const stockMsg = availableStock !== undefined
                        ? `Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available in stock.`
                        : msg;
                    enqueueSnackbar(stockMsg, { variant: "warning" });
                } else if (
                    msg.toLowerCase().includes("already") ||
                    msg.toLowerCase().includes("exists") ||
                    error.response?.status === 400
                ) {
                    enqueueSnackbar("This item is already in your cart.", { variant: "info" });
                } else {
                    enqueueSnackbar(msg || "Failed to add product to cart", { variant: "info" });
                }
            }
        } else {
            enqueueSnackbar("Added to cart (Guest)", { variant: "success" });
            savePendingCartItem({ prod_id: productDetailData?.data?.product?.id, quantity });
            window.dispatchEvent(new Event("cartUpdated"));
        }


    };


    const handleAddToWishlistSubmit = async () => {
        if (isAuthenticated || isAuthenticatedMobile) {
            const product_id = productDetailData?.data?.product?.id;

            try {
                // Send only the product_id to the API
                const response = await axiosInstance.post(`/order/wishlist/`,
                    { prod_id: product_id });
                if (response?.status === 200) {
                    setInWishlist(response?.data?.data?.in_wishlist)
                    dispatch(addtowishlist(product_id));
                    window.dispatchEvent(new Event("wishlistUpdated"));

                    // GA4: Track add_to_wishlist event
                    if (response?.data?.data?.in_wishlist) {
                        trackAddToWishlist(productDetailData?.data?.product);
                    }

                    enqueueSnackbar(response?.data?.message, { variant: "success" });
                }

            } catch (error) {

                enqueueSnackbar(
                    "Failed to add product to wishlist. Please try again.",
                    { variant: "error" }
                ); // Show error message
            }
        } else {
            enqueueSnackbar("Added to wishlist (Guest)", {
                variant: "success",
            });
            savePendingWishlistItem({ prod_id: productDetailData?.data?.product?.id });
            window.dispatchEvent(new Event("wishlistUpdated"));
        }
    };


    const handleBuyItNowSubmit = async () => {

        if (isAuthenticated || isAuthenticatedMobile) {
            const productId = productDetailData?.data?.product?.id;
            if (!productId) {
                enqueueSnackbar("Product is still loading. Please wait.", { variant: "warning" });
                return;
            }

            // Stock check before placing order
            try {
                await axiosInstance.get(`/product/stockCheck/${productId}/`, {
                    params: { quantity, action: "increment" },
                });
            } catch (err) {
                enqueueSnackbar(err?.response?.data?.message || "Not enough stock available.", { variant: "warning" });
                return;
            }

            const product_data = {
                order_source: "product",
                prod_id: productId,
                quantity: quantity,
            };

            const finalCoupon = appliedCouponInfo?.coupon_code || bestCoupon?.code;
            if (finalCoupon) {
                product_data.coupon_code = finalCoupon;
            }

            try {
                const response = await axiosInstance.post(`/order/placeOrder/`, product_data);


                if (response.status === 200) {
                    //      enqueueSnackbar("Order placed successfully!", { variant: "success" });
                    window.dispatchEvent(new Event("cartUpdated"));


                    sessionStorage.setItem('checkout_ordersummary', JSON.stringify(response.data.data));
                    sessionStorage.removeItem('checkout_combo_offer');
                    router.push("/checkout");
                }

            } catch (error) {
                if (error.response && error.response.status === 400) {

                    enqueueSnackbar(error.response.data.message, { variant: "warning" });
                    if (error.response.data.message === "User profile is not updated.") {
                        router.push('/profile')
                    }
                    if (error.response.data.message === "User address is not updated.") {

                        router.push('/profile')

                    }
                } else {
                    enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
                }
            }
        } else {
            // If not authenticated, redirect based on device type
            enqueueSnackbar("Please Login or Signup to Buy Our Products.", { variant: 'info' });
            savePendingCartItem({ prod_id: productDetailData?.data?.product?.id, quantity });
            if (isMobile) {
                router.push("/mobile-signin", { replace: true });
            } else {
                router.push("/?modal=signIn", { replace: true });
            }
        }
    };

    const CustomPrevArrow = ({ className, onClick }) => (
        <button aria-label="Previous" className={`${className} z-10 left-0`} onClick={onClick}>
            <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
    );

    const CustomNextArrow = ({ className, onClick }) => (
        <button aria-label="Next" className={`${className} z-10 right-0`} onClick={onClick}>
            <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
    );

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };


    const handleQuantity = (product_id, action, qty) => {
        if (action === "direct") {
            // User typed directly — validate locally, no API override
            const parsed = parseInt(qty, 10);
            const safe = !isNaN(parsed) && parsed >= 1 ? Math.min(parsed, 1000) : 1;
            setQuantity(safe);
            return;
        }

        // +/− buttons: update UI immediately (feels instant)
        if (action === "decrement" && qty <= 1) return; // already at minimum, nothing to do
        const next = action === "decrement" ? qty - 1 : qty + 1;
        setQuantity(next);

        // Stock check only needed for increment (to verify availability)
        if (action === "decrement") return;

        if (stockCheckTimer.current) clearTimeout(stockCheckTimer.current);
        stockCheckTimer.current = setTimeout(async () => {
            try {
                await axiosInstance.get(`/product/stockCheck/${product_id}/`, {
                    params: { quantity: 1, action: "increment" },
                });
                // Optimistic value is correct — do not override from API response
            } catch (err) {
                // Revert to previous value on error (e.g. exceeds stock)
                setQuantity(qty);
                enqueueSnackbar(err?.response?.data?.message, { variant: "info" });
            }
        }, 400);
    };
    const handleSizeClick = async (size, product) => {
        try {
            // Set the selected size

            setSelectedSize(size);

            // Make API call to the unified endpoint
            // Use the unified product_detail_view endpoint for filtering
            const res = await axiosInstance.get(`/product/product_detail_view/${params.productSlug}/`,
                {
                    params: {
                        size_id: size.id,
                    },
                }
            );

            // If the same size is clicked again, toggle the selection (deselect)
            if (selectedSize?.size === size?.size) {
                setSelectedSize(null); // Deselect the size
            } else {
                setSelectedSize(size); // Select the new size
            }

            // Handle the API response
            const data = res.data;
            const images = data?.data?.product?.images || [];

            // Update URL with query parameters instead of changing slug
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);
            setImageThumbnails(images);
            setProductDetailData(data);
            if (data?.data?.product_add_ons) {
                setAddOnData(data.data.product_add_ons);
            }

            // You can update state or perform additional actions with the filtered products
        } catch (error) {// Handle error scenarios
        }
    };

    const handleWeightClick = async (size, product) => {
        try {

            // Toggle selection properly
            setSelectedGram((prev) =>
                prev?.size_grams === size?.size_grams ? null : size
            );

            // Make API call to the unified endpoint
            const res = await axiosInstance.get(
                `/product/product_detail_view/${params.productSlug}/`,
                {
                    params: { weight_id: size.id },
                }
            );

            // Ensure data exists before updating state

            const data = res?.data;

            if (data?.data?.product?.images) {
                setImageThumbnails(data?.data?.product?.images || []);
            }

            // Update URL with query parameters
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);
            setProductDetailData(data);
            if (data?.data?.product_add_ons) {
                setAddOnData(data.data.product_add_ons);
            }
        } catch (error) { }
    };

    const handleLitreClick = async (litre, product) => {
        try {

            // Toggle selection properly
            setSelectedLitre((prev) =>
                prev?.name === litre?.name ? null : litre
            );

            // Make API call to the unified endpoint
            const res = await axiosInstance.get(
                `/product/product_detail_view/${params.productSlug}/`,
                {
                    params: { litre_id: litre.id },
                }
            );

            // Ensure data exists before updating state

            const data = res?.data;

            // Update URL with query parameters
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);

            if (data?.data?.product?.images) {
                setImageThumbnails(data?.data?.product?.images || []);
            }

            setProductDetailData(data);
        } catch (error) { }
    };


    const handlePlanterSizeClick = async (size, product) => {
        try {
            // Set the selected size
            setSelectedPlanterSize(size);

            // Make API call to the unified endpoint
            const res = await axiosInstance.get(
                `/product/product_detail_view/${params.productSlug}/`,
                {
                    params: {
                        planter_size_id: size.id,
                        size_id: product.size_id,
                    },
                }
            );
            // If the same size is clicked again, toggle the selection (deselect)
            if (selectedPlanterSize?.size === size?.size) {
                setSelectedPlanterSize(null); // Deselect the size
            } else {
                setSelectedPlanterSize(size); // Select the new size
            }
            // Handle the API response
            const data = res.data;
            const images = data?.data?.product?.images || [];

            // Update URL with query parameters instead of changing slug
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);
            setImageThumbnails(images);
            setProductDetailData(data);

            // You can update state or perform additional actions with the filtered products
        } catch (error) {// Handle error scenarios
        }
    };

    const handlePlanterClick = async (planter, product) => {
        try {
            // Set the selected size
            setSelectedPlanter(planter, id);
            // If the same planter is clicked again, toggle the selection (deselect)
            if (selectedPlanter?.id === planter?.id) {
                setSelectedPlanter(null); // Deselect the planter
            } else {
                setSelectedPlanter(planter); // Select the new planter
            }
            // Make API call to the unified endpoint
            const res = await axiosInstance.get(
                `/product/product_detail_view/${params.productSlug}/`,
                {
                    params: {
                        planter_id: planter.id,
                        planter_size_id: product.planter_size_id,
                        size_id: product.size_id,
                    },
                }
            );

            // Handle the API response
            const data = res.data;
            const images = data?.data?.product?.images || [];

            // Update URL with query parameters instead of changing slug
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);
            setImageThumbnails(images);
            setProductDetailData(data);

            // You can update state or perform additional actions with the filtered products
        } catch (error) {// Handle error scenarios
        }
    };

    const handlePlanterColorClick = async (color, product) => {
        try {
            // 🚫 remove toggle/deselect logic
            if (selectedColor?.id === color?.id) {
                return; // if same color clicked, do nothing
            }

            setSelectedColor(color);

            // ✅ Make API call to the unified endpoint
            const res = await axiosInstance.get(
                `/product/product_detail_view/${params.productSlug}/`,
                {
                    params: {
                        color_id: color.id,
                        planter_id: product.planter_id,
                        planter_size_id: product.planter_size_id,
                        size_id: product.size_id,
                    },
                }
            );

            const data = res.data;
            const images = data?.data?.product?.images || [];

            // Update URL with query parameters
            updateUrlWithParams(data?.data?.product);

            setproduct_slug(data?.data?.product?.slug || id);
            setcategory_slug(data?.data?.product?.category_slug);
            setsubcategory_slug(data?.data?.product?.sub_category_slug);
            setImageThumbnails(images);
            setProductDetailData(data);
            setSelectedImage(0);

        } catch (error) { }
    };


    // ========== NEW CODE (Feb 16, 2026) - Auto-select variant matching clicked product slug ==========
    // ✅ Fetch product data and auto-select variant matching the URL slug
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the slug from URL params to fetch the exact product variant
                const productSlug = params.productSlug || id;
                const queryParams = new URLSearchParams(window.location.search).toString();
                const response = await axiosInstance.get(`/product/product_detail_view/${productSlug}/${queryParams ? '?' + queryParams : ''}`);

                if (response.status === 200) {
                    const data = response.data;
                    setProductDetailData(data);
                    setAddOnData(data?.data?.product_add_ons || []);
                    setImageThumbnails(data?.data?.product?.images || []);

                    // GA4: Track view_item event (MOVED TO SEPARATE USEEFFECT)
                    // if (data?.data?.product) {
                    //     trackViewItem(data.data.product);
                    // }

                    // Do NOT call updateUrlWithParams here — params should only
                    // be added when the user explicitly changes a variant.
                    // The URL normalization useEffect handles the clean slug.

                    setproduct_slug(data?.data?.product?.slug || id);
                    setcategory_slug(data?.data?.product?.category_slug);
                    setsubcategory_slug(data?.data?.product?.sub_category_slug);

                    const { size_id, planter_size_id, planter_id, color_id, litre_id, weight_id } = data.data.product;

                    const defaultSize =
                        data.data.product_sizes.find(
                            (s) => s.id === size_id || s.size === size_id
                        ) || data.data.product_sizes[0] || "";

                    const defaultPlanterSize =
                        data.data.product_planter_sizes.find(
                            (s) =>
                                s.id === planter_size_id ||
                                s.size === planter_size_id?.size ||
                                s.name === planter_size_id?.name
                        ) || data.data.product_planter_sizes[0] || "";

                    const defaultPlanter =
                        data.data.product_planters.find(
                            (s) => s.id === planter_id || s.name === planter_id?.name
                        ) || data.data.product_planters[0] || "";

                    const defaultColor =
                        data.data.product_colors.find((c) => c.id === Number(color_id)) ||
                        data.data.product_colors[0] || null;

                    const defaultLitre =
                        data.data.product_litres.find(
                            (s) => s.id === litre_id || s.name === litre_id?.name
                        ) || data.data.product_litres[0] || "";

                    const defaultWeight =
                        data.data.product_weights.find(
                            (s) => s.id === weight_id || s.name === weight_id?.name
                        ) || data.data.product_weights[0] || "";

                    setSelectedSize(defaultSize);
                    setSelectedPlanterSize(defaultPlanterSize);
                    setSelectedPlanter(defaultPlanter);
                    setSelectedColor(defaultColor);
                    setSelectedLitre(defaultLitre);
                    setSelectedGram(defaultWeight);

                    // Store the main product ID for use in filterProduct calls
                    const mainId = data?.data?.product?.id;
                    if (mainId) setMainProductId(mainId);

                }
            } catch (error) { }
        };

        // Clear state if the ID changes to prevent stale data display ONLY if the products are truly different
        // We use the product ID as a more stable identifier than the slug which can vary for same product
        const currentIdInState = productDetailData?.data?.product?.id || productDetailData?.product?.id;

        // Only clear if we have a mismatch and it's NOT the initial render (initialProductData exists)
        if (currentIdInState && id && currentIdInState.toString() !== id.toString() && params.productSlug !== (productDetailData?.data?.product?.slug || productDetailData?.product?.slug)) {
            // Only clear if it's truly a different product, not just a variant of the same base slug
            // But be careful: id could be a slug or a numeric ID.
            if (isNaN(id) && id !== params.productSlug) {
                setProductDetailData([]);
                setImageThumbnails([]);
            }
        }

        // Skip initial fetch if we already have hydrated data from the server that includes product info
        const currentSlug = productDetailData?.data?.product?.slug || productDetailData?.product?.slug;
        const currentId = productDetailData?.data?.product?.id || productDetailData?.product?.id;

        // Extract hydrated rating/review info similarly to how it's done in the render method
        const hasHydratedRatings = !!(productDetailData?.data?.product_rating || productDetailData?.product_rating || productDetailData?.data?.product?.product_rating);
        const hasHydratedReviews = (productDetailData?.data?.product_reviews?.length > 0 || productDetailData?.product_reviews?.length > 0 || productDetailData?.data?.product?.product_reviews?.length > 0);

        if ((currentSlug === id || currentId === id) && (hasHydratedRatings || hasHydratedReviews)) {
            return;
        }
        fetchData();
    }, [id, params.productSlug]); // Added params.productSlug to dependencies
    // ========== END NEW CODE ==========

    // GA4: Dedicated effect for view_item to ensure it fires even on SSR/Hydration
    const lastTrackedId = useRef(null);
    useEffect(() => {
        const product = productDetailData?.data?.product || productDetailData?.product;
        const productId = product?.id || product?.prod_id;

        if (productId && productId !== lastTrackedId.current) {
            trackViewItem(product);
            lastTrackedId.current = productId;
        }
    }, [productDetailData]);

    // ========== END SSR IMAGE FIX (No longer needed with product_detail_view) ==========

    // ========== OLD CODE (Before Feb 16, 2026) - COMMENTED OUT ==========
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstance.get(`/product/defaultProduct/${id}/`);
    //             if (response.status === 200) {
    //                 const data = response.data;
    //                 setProductDetailData(data);
    //                 setAddOnData(data?.data?.product_add_ons || []);
    //                 setImageThumbnails(data?.data?.product?.images || []);
    //
    //                 // NEW: Clean URL structure - Always 3-segment
    //                 const newUrl = `/${data?.data?.product?.category_slug}/${data?.data?.product?.sub_category_slug}/${data?.data?.product?.slug || id}/`;
    //                 window.history.replaceState(null, "", newUrl);
    //                 setCurrentUrl(newUrl); // Update state to trigger re-render
    //
    //                 setproduct_slug(data?.data?.product?.slug || id);
    //                 setcategory_slug(data?.data?.product?.category_slug);
    //                 setsubcategory_slug(data?.data?.product?.sub_category_slug);
    //
    //                 const {size_id, planter_size_id, planter_id, color_id, litre_id, weight_id} = data.data.product;
    //
    //                 const defaultSize =
    //                     data.data.product_sizes.find(
    //                         (s) => s.id === size_id || s.size === size_id
    //                     ) || data.data.product_sizes[0] || "";
    //
    //                 const defaultPlanterSize =
    //                     data.data.product_planter_sizes.find(
    //                         (s) =>
    //                             s.id === planter_size_id ||
    //                             s.size === planter_size_id?.size ||
    //                             s.name === planter_size_id?.name
    //                     ) || data.data.product_planter_sizes[0] || "";
    //
    //                 const defaultPlanter =
    //                     data.data.product_planters.find(
    //                         (s) => s.id === planter_id || s.name === planter_id?.name
    //                     ) || data.data.product_planters[0] || "";
    //
    //                 const defaultColor =
    //                     data.data.product_colors.find((c) => c.id === Number(color_id)) ||
    //                     data.data.product_colors[0] || null;
    //
    //                 const defaultLitre =
    //                     data.data.product_litres.find(
    //                         (s) => s.id === litre_id || s.name === litre_id?.name
    //                     ) || data.data.product_litres[0] || "";
    //
    //                 const defaultWeight =
    //                     data.data.product_weights.find(
    //                         (s) => s.id === weight_id || s.name === weight_id?.name
    //                     ) || data.data.product_weights[0] || "";
    //
    //                 setSelectedSize(defaultSize);
    //                 setSelectedPlanterSize(defaultPlanterSize);
    //                 setSelectedPlanter(defaultPlanter);
    //                 setSelectedColor(defaultColor);
    //                 setSelectedLitre(defaultLitre);
    //                 setSelectedGram(defaultWeight);
    //
    //                 // ✅ Trigger the same flow as manual selection to update images
    //                 if (defaultColor) {
    //                     handlePlanterColorClick(defaultColor, data.data.product);
    //                 }
    //                 if (defaultSize) {
    //                     handleSizeClick(defaultSize, data.data.product);
    //                 }
    //                 if (defaultPlanterSize) {
    //                     handlePlanterSizeClick(defaultPlanterSize, data.data.product);
    //                 }
    //                 if (defaultPlanter) {
    //                     handlePlanterClick(defaultPlanter, data.data.product);
    //                 }
    //                 if (defaultLitre) {
    //                     handleLitreClick(defaultLitre, data.data.product);
    //                 }
    //                 if (defaultWeight) {
    //                     handleWeightClick(defaultWeight, data.data.product);
    //                 }
    //
    //             }
    //         } catch (error) {}
    //     };
    //
    //     if (id) fetchData();
    // }, [id]);
    // ========== END OLD CODE ==========

    return (
        <>

            {/* Breadcrumb Navigation */}
            <Breadcrumb
                items={[
                    {
                        label: productDetailData?.data?.product?.category_name || scategory_slug,
                        path: `/${scategory_slug}/`
                    },
                    {
                        label: productDetailData?.data?.product?.sub_category_name || ssubcategory_slug,
                        path: `/${scategory_slug}/${ssubcategory_slug}/`
                    }
                ]}
                currentPage={
                    productDetailData?.data?.product?.name ||
                    (productDetailData?.data?.product?.slug
                        ? productDetailData.data.product.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                        : "")
                }
            />

            <div className="w-full" style={{ backgroundColor: "whitesmoke" }}>
                <div className="container mx-auto px-3 py-4 font-sans md:px-8">
                    <div className="flex flex-col md:flex-row -mx-4 relative items-start">
                        {/* LEFT COLUMN: STATIC / STICKY IMAGE GALLERY & ACTIONS */}
                        <div 
                            className="md:flex-1 px-4 md:sticky md:top-24 h-fit z-30"
                            style={{ position: '-webkit-sticky', position: 'sticky', top: '96px' }}
                        >
                            {/* Main Image with Fully Working Zoom */}
                            <div 
                                className="relative cursor-crosshair group z-40 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm aspect-square"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    setPosition({ x, y });
                                }}
                                ref={imageRef}
                            >
                                {/* MAIN IMAGE */}
                                {imageThumbnails.length > 0 ? (
                                    <>
                                        <Image
                                            src={
                                                (() => {
                                                    const img = imageThumbnails[selectedImage] || imageThumbnails[0];
                                                    let path = (img?.image || img?.url || "").trim();
                                                    if (!path) return "";
                                                    // Robust URL check (handles http://, https://, and //)
                                                    if (path.startsWith("http") || path.startsWith("//")) {
                                                        return path;
                                                    }
                                                    // Ensure relative path starts with /
                                                    const cleanPath = path.startsWith('/') ? path : `/${path}`;
                                                    return `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${cleanPath}`;
                                                })()
                                            }
                                            alt={productDetailData?.data?.product?.main_product_name || ""}
                                            className="w-full h-full object-contain"
                                            ref={imgRef}
                                            priority={true}
                                            width={500}
                                            height={500}
                                            unoptimized={true}
                                        />
                                        
                                        {/* Hover to Zoom indicator */}
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 pointer-events-none z-10 transition-opacity duration-300">
                                            <Share2 size={12} className="text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Hover to zoom</span>
                                        </div>
                                    </>
                                ) : null}

                                {/* LENS BOX (Transparent Square) */}
                                {zoom && (
                                    <div
                                        className="absolute pointer-events-none border border-green-400 bg-white/20 rounded-sm"
                                        style={{
                                            width: lensSize,
                                            height: lensSize,
                                            top: position.y - lensSize / 2,
                                            left: position.x - lensSize / 2,
                                        }}
                                    />
                                )}
                            </div>

                            {/* ZOOM BOX ON RIGHT */}
                            {zoom && (
                                <div
                                    className="absolute top-0 right-0 translate-x-[110%] w-[500px] h-[500px] hidden md:block border border-gray-300 rounded-lg bg-white z-50 shadow-lg"
                                    style={{
                                        backgroundImage: `url(${
                                            (() => {
                                                const img = imageThumbnails[selectedImage] || imageThumbnails[0];
                                                const path = (img?.image || img?.url || "").trim();
                                                if (path.startsWith("http") || path.startsWith("//")) return path;
                                                const cleanPath = path.startsWith('/') ? path : `/${path}`;
                                                return `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${cleanPath}`;
                                            })()
                                        })`,
                                        backgroundPosition: `${-position.x * 2.5 + 250}px ${-position.y * 2.5 + 250}px`,
                                        backgroundSize: `1250px 1250px`,
                                        backgroundRepeat: "no-repeat",
                                    }}
                                />
                            )}

                            {/* Image Thumbnails */}
                            <div className="mt-6 flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {imageThumbnails.map((thumbnail, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                                            selectedImage === index ? "border-[#375421] shadow-md scale-[1.05]" : "border-gray-100 hover:border-gray-300"
                                        }`}
                                    >
                                        <Image
                                            src={
                                                (() => {
                                                    const path = (thumbnail?.image || thumbnail?.url || "").trim();
                                                    if (path.startsWith("http") || path.startsWith("//")) return path;
                                                    const cleanPath = path.startsWith('/') ? path : `/${path}`;
                                                    return `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${cleanPath}`;
                                                })()
                                            }
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Shared footer row below thumbnails */}
                            <div className="mt-8 flex items-center justify-between gap-4 px-2">
                                <div className="flex items-center gap-2">
                                    <button onClick={handleWhatsAppShare} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-100 transition-all shadow-sm">
                                        <FaWhatsapp size={14} />
                                    </button>
                                    <button onClick={handleInstagramShare} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-100 transition-all shadow-sm">
                                        <FaInstagram size={14} />
                                    </button>
                                    <button onClick={handleCopyLink} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                        <LinkIcon size={14} />
                                    </button>
                                </div>
                                <div className="px-4 py-2 bg-[#ecf3e8] border border-green-100 rounded-full flex items-center gap-2 shadow-sm">
                                    <span className="text-xl">🛡️</span>
                                    <span className="text-[10px] font-black text-[#375421] uppercase tracking-wide">7-Day Survival Guarantee</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:flex-1 px-4 font-sans mt-8">
                            <h1 className="text-xl md:text-3xl font-bold mb-2">
                                {(() => {
                                    const p = productDetailData?.data?.product;
                                    const cleanName = p?.name || (p?.slug ? p.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "");
                                    return cleanName ? `Buy ${cleanName}` : "";
                                })()}
                            </h1>
                            <p className="text-md md:text-lg font-sans mb-4 whitespace-pre-line text-black">
                                {productDetailData?.data?.product?.description || ""}
                            </p>
                            {productDetailData?.data?.product?.whats_included && (
                                <p className="text-sm text-gray-600 mb-4 italic leading-relaxed">
                                    <span className="font-bold">What's included:</span> {productDetailData.data.product.whats_included}
                                </p>
                            )}

                            {/* Product Highlights & Real-time Info */}
                            <div className="mb-6 space-y-4">
                                {productDetailData?.data?.care_guides?.length > 0 && (
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {productDetailData.data.care_guides.map((guide, index) => (
                                            <div key={guide.id || index} className="flex items-center gap-2 text-sm text-gray-700">
                                                {guide.icon ? (
                                                    <img src={guide.icon} alt="" className="w-5 h-5 object-contain" />
                                                ) : (
                                                    <span className="text-bio-green">✨</span>
                                                )}
                                                {guide.title}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col gap-1 py-3 border-y border-gray-200/60">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-sm font-bold text-green-600">
                                            {productDetailData?.data?.product?.stock_word === "OutOfStock" ? "Out of Stock" : `In stock (${productDetailData?.data?.product?.stock || 0})`}
                                        </span>
                                        {productDetailData?.data?.product?.stock > 0 && (
                                            <span className="text-sm text-gray-500">— Only {productDetailData.data.product.stock} left</span>
                                        )}
                                    </div>
                                    {productDetailData?.data?.product?.viewing_count > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-orange-500">🔥</span>
                                            <span className="font-medium text-orange-600">
                                                {productDetailData.data.product.viewing_count} people
                                            </span> viewing right now
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <p className="text-black-600 text-sm">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const fraction =
                                            ratingData?.avg_rating || 0;
                                        const filled = Math.floor(fraction);
                                        const half = fraction - filled;
                                        return (
                                            <React.Fragment key={i}>
                                                {i < filled && (
                                                    <FaStar className="inline-block text-bio-green" />
                                                )}
                                                {i === filled && half > 0 && (
                                                    <FaStarHalfAlt className="inline-block text-bio-green" />
                                                )}
                                                {i >= filled + half && (
                                                    <FaStar className="inline-block text-gray-700" />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    <span className="ml-2">({ratingData?.num_ratings || 0} {ratingData?.num_ratings === 1 ? 'review' : 'reviews'})</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleViewReviewClick}
                                        className="text-sm text-bio-green hover:text-[#051d18] hover:underline cursor-pointer bg-transparent border-none p-0"
                                    >
                                        View reviews
                                    </button>
                                    <span className="text-sm text-gray-400">|</span>
                                    <button
                                        onClick={handleWriteReviewClick}
                                        disabled={isCheckingPurchase}
                                        className="text-sm text-bio-green hover:text-[#051d18] hover:underline cursor-pointer bg-transparent border-none p-0"
                                    >
                                        {isCheckingPurchase ? "Checking..." : (productDetailData?.data?.product?.is_review ? "Edit your review" : (productDetailData?.data?.product_rating?.num_ratings === 0 ? "Be the first to review" : "Write a review"))}
                                    </button>
                                </div>
                            </div>
                            {/* ProductSchema moved to Server Component */}

                            <div className="flex mb-4 items-center">
                                <div className="mr-4 flex items-center">
                                    <span className="font-bold text-bio-green text-lg md:text-2xl">
                                        ₹{Math.round(productDetailData?.data?.product?.selling_price || 0)}
                                    </span>

                                    {productDetailData?.data?.product?.mrp > productDetailData?.data?.product?.selling_price && (
                                        <>
                                            <span className="text-gray-600 text-md md:text-xl line-through ml-2">
                                                ₹{Math.round(productDetailData?.data?.product?.mrp || 0)}
                                            </span>
                                            <span className="ml-2 text-red-500 font-semibold text-md md:text-lg">
                                                {Math.round(
                                                    ((productDetailData?.data?.product?.mrp - productDetailData?.data?.product?.selling_price) /
                                                        productDetailData?.data?.product?.mrp) *
                                                    100
                                                )}
                                                % OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {bestCoupon && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsCouponDrawerOpen(true);
                                        }}
                                        className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full cursor-pointer hover:bg-orange-100 transition-all animate-pulse shadow-sm"
                                    >
                                        <Tag className="w-3.5 h-3.5 text-orange-600" />
                                        <span className="text-[11px] font-bold text-orange-700 uppercase tracking-tight">
                                            Use {bestCoupon.code} for {bestCoupon.discount_type === 'percentage' ? `${bestCoupon.discount_value}%` : `₹${bestCoupon.discount_value}`} OFF
                                        </span>
                                        <Sparkles className="w-3 h-3 text-orange-400" />
                                    </div>
                                )}
                            </div>

                            {productDetailData?.data?.product_weights?.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Packet Size:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetailData?.data?.product_weights?.map((size, idx) => (
                                            <button
                                                key={size?.id || size?.size_grams || idx}
                                                onClick={() => handleWeightClick(size, productDetailData?.data?.product)}
                                                className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedgram?.size_grams === size?.size_grams
                                                    ? "border-[#375421] text-[#375421] bg-[#375421]/5"
                                                    : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {size?.size_grams}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_litres?.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Capacity:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetailData?.data?.product_litres?.map((litre, idx) => (
                                            <button
                                                key={litre?.id || litre?.name || idx}
                                                onClick={() => handleLitreClick(litre, productDetailData?.data?.product)}
                                                className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedLitre?.name === litre?.name
                                                    ? "border-[#375421] text-[#375421] bg-[#375421]/5"
                                                    : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {litre?.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_sizes?.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Plant Size:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetailData?.data?.product_sizes?.map((size, idx) => {
                                            const diff = (size?.price || 0);
                                            return (
                                                <button
                                                    key={size?.id || size?.size || idx}
                                                    onClick={() => handleSizeClick(size, productDetailData?.data?.product)}
                                                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize?.size === size?.size
                                                        ? "border-[#375421] text-[#375421] bg-[#375421]/5"
                                                        : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {size?.size} {diff > 0 && <span className="text-[10px] opacity-60 ml-1">(+₹{Math.round(diff)})</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_planter_sizes?.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Planter Size:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetailData?.data?.product_planter_sizes?.map((size, idx) => {
                                            const diff = (size?.price || 0);
                                            return (
                                                <button
                                                    key={size?.id || size?.size || idx}
                                                    onClick={() => handlePlanterSizeClick(size, productDetailData?.data?.product)}
                                                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedPlanterSize?.size === size?.size
                                                        ? "border-[#375421] text-[#375421] bg-[#375421]/5"
                                                        : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {size?.size} {diff > 0 && <span className="text-[10px] opacity-60 ml-1">(+₹{Math.round(diff)})</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_planters?.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Select Planter:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetailData?.data?.product_planters?.map((planter, idx) => {
                                            const diff = (planter?.price || 0);
                                            return (
                                                <button
                                                    key={planter?.id || planter?.name || idx}
                                                    onClick={() => handlePlanterClick(planter, productDetailData?.data?.product)}
                                                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedPlanter?.id === planter?.id
                                                        ? "border-[#375421] text-[#375421] bg-[#375421]/5"
                                                        : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {planter?.name} {diff > 0 && <span className="text-[10px] opacity-60 ml-1">(+₹{Math.round(diff)})</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_colors?.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Recommended Planter Color:</span>
                                    {/* Select Box - color name with code dot */}
                                    <div className="relative mt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {productDetailData?.data?.product_colors?.map((color, idx) => (
                                                <button
                                                    key={color?.id || color?.color_code || idx}
                                                    onClick={() => handlePlanterColorClick(color, productDetailData?.data?.product)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${selectedColor?.id === color?.id
                                                        ? "border-bio-green bg-green-50 shadow-sm"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <span
                                                        className="w-4 h-4 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: color?.color_code }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{color?.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Manual Coupon Application UI (PDP) - Same as Checkout */}
                            <div className="bg-[#f2f8f2] p-4 rounded-2xl mt-6 border border-emerald-50 mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag className="text-[#375421]" size={16} fill="none" />
                                    <span className="text-[11px] font-black text-[#375421] uppercase tracking-[0.1em]">APPLY COUPON</span>
                                </div>

                                {appliedCouponInfo ? (
                                    <div className="flex items-center justify-between bg-white border border-emerald-100 rounded-xl px-4 py-3 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-800 text-sm font-black tracking-widest uppercase">{appliedCouponInfo.coupon_code}</span>
                                            <span className="text-emerald-600 text-[10px] font-bold">Applied — saved ₹{Math.round(appliedCouponInfo.discount_amount || 0)}</span>
                                            {appliedCouponInfo.redemption_message && (
                                                <p className="text-[9px] text-[#375421]/70 font-medium leading-tight mt-1">{appliedCouponInfo.redemption_message}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="PROMO CODE"
                                                value={manualCouponCode}
                                                onChange={(e) => setManualCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 px-4 py-2 border-2 border-dashed border-[#375421]/30 rounded-xl focus:outline-none focus:border-[#375421] text-sm bg-white placeholder:text-gray-300 font-bold uppercase tracking-wider transition-all"
                                            />
                                            <button
                                                onClick={() => handleApplyCouponPreview()}
                                                disabled={isPreviewingCoupon || !manualCouponCode}
                                                className="bg-[#375421] text-white font-black px-6 py-2 rounded-xl hover:bg-[#2d451b] transition-all text-xs uppercase tracking-[0.15em] shadow-md shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isPreviewingCoupon ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "APPLY"}
                                            </button>
                                        </div>

                                        {bestCoupon && (
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-x-2">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Try code</span>
                                                    <button
                                                        onClick={() => {
                                                            setManualCouponCode(bestCoupon.code);
                                                            handleApplyCouponPreview(bestCoupon.code);
                                                        }}
                                                        className="text-[10px] font-black text-[#375421] underline decoration-dashed transition-colors uppercase hover:text-[#2d451b]"
                                                    >
                                                        {bestCoupon.code}
                                                    </button>
                                                    <span className="text-[10px] text-gray-400 font-medium">· Max savings</span>
                                                </div>

                                                {allCoupons.length > 1 && (
                                                    <button
                                                        onClick={() => setIsCouponDrawerOpen(true)}
                                                        className="text-[10px] font-black text-[#375421] uppercase hover:underline tracking-widest"
                                                    >
                                                        + More Offers
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Free Shipping Progress Indicator (PDP Standalone) */}
                            <div className="mb-6 px-5 py-4 bg-gradient-to-r from-[#faf9f6]/80 to-white rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-end mb-3 relative z-10 w-full">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                                            <span className="text-[14px] font-bold text-gray-900 leading-tight">
                                                {amountToFreeShipping > 0
                                                    ? `Add ₹${Math.round(amountToFreeShipping).toLocaleString()} more for FREE shipping`
                                                    : "This item qualifies for FREE shipping!"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className="text-[15px] font-black text-[#375421] whitespace-nowrap">₹{Math.round(combinedTotal).toLocaleString()} <span className="text-gray-400 text-[11px] font-bold">/ ₹{freeShippingThreshold.toLocaleString()}</span></span>
                                    </div>
                                </div>

                                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner flex shrink-0 border border-gray-200/50">
                                    <div
                                        className="h-full bg-[#375421] transition-all duration-1000 ease-out rounded-full shadow-sm"
                                        style={{ width: `${freeShippingProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mb-8 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center border border-[#375421] rounded-xl overflow-hidden shadow-sm h-12">
                                        <button
                                            onClick={() => handleQuantity(productDetailData?.data?.product?.id, "decrement", quantity)}
                                            className="w-12 h-full flex items-center justify-center text-[#375421] hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-[#375421]/20 font-black"
                                        >
                                            −
                                        </button>
                                        <div className="w-14 h-full flex items-center justify-center bg-white text-sm font-black text-gray-900">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => handleQuantity(productDetailData?.data?.product?.id, "increment", quantity)}
                                            className="w-12 h-full flex items-center justify-center text-[#375421] hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-[#375421]/20 font-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={isInCart ? () => router.push('/cart') : handleAddToCartSubmit}
                                        disabled={productDetailData?.data?.product?.in_stock === false}
                                        className="flex-1 h-12 bg-[#375421] text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2d451b] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <ShoppingCart size={18} />
                                        {isInCart ? "Go to Cart" : "Add to Cart"}
                                    </button>
                                    <button
                                        onClick={!productDetailData?.data?.product?.is_wishlist ? handleAddToWishlistSubmit : null}
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all shadow-sm active:scale-95 ${productDetailData?.data?.product?.is_wishlist ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-200 bg-white text-gray-400 hover:text-red-400 hover:border-red-100 hover:bg-red-50'}`}
                                    >
                                        <Heart size={20} fill={productDetailData?.data?.product?.is_wishlist ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleBuyItNowSubmit}
                                    disabled={productDetailData?.data?.product?.in_stock === false}
                                    className="w-full h-14 border-2 border-[#375421] text-[#375421] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#375421]/5 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Sparkles size={18} className="text-orange-400" />
                                    Buy Now — ₹{Math.round(productDetailData?.data?.product?.selling_price || 0)}
                                </button>
                            </div>

                            <div className="mb-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <Truck size={20} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Check delivery</h3>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter PIN code"
                                        value={pincode}
                                        onChange={handlePincodeChange}
                                        className="flex-1 px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-[#375421] outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        onClick={handleCheck}
                                        className="px-8 bg-[#375421] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#2d451b] transition-all shadow-sm active:scale-95"
                                    >
                                        Check
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{error}</p>}
                                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-2">
                                    <p className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        📦 Free delivery on orders ₹{freeShippingThreshold}+
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-500 flex items-center gap-2 text-orange-600">
                                        ⚡ Same-day dispatch before 2PM (Bangalore)
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-8">
                                <TrustBadges isGrid={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Details Drawer */}
            <RightDrawer
                isOpen={isCouponDrawerOpen}
                onClose={() => setIsCouponDrawerOpen(false)}
                title="Available Offers"
                subtitle="Exclusive discounts for you"
                footerText="Tap to apply the best offer at checkout"
            >
                <div className="space-y-4">
                    {allCoupons.map((coupon) => {
                        // Re-run filtering logic for display
                        const currentProduct = productDetailData?.data?.product;
                        const catId = currentProduct?.category_id;
                        const prodId = currentProduct?.id;
                        const isGlobal = !coupon.applicable_products?.length && !coupon.applicable_categories?.length && !coupon.applicable_combination_products?.length;
                        const appliesToProduct = coupon.applicable_products?.includes(prodId);
                        const appliesToCategory = coupon.applicable_categories?.some(cat => cat.id === catId || cat === catId);

                        if (!isGlobal && !appliesToProduct && !appliesToCategory) return null;

                        const isCurrentlyApplied = appliedCouponInfo?.coupon_code === coupon.code;

                        return (
                            <div
                                key={coupon.id}
                                className={`group relative p-5 border-2 rounded-[24px] transition-all duration-300 ${isCurrentlyApplied ? 'bg-white border-[#375421] shadow-sm' : 'bg-white border-gray-900 hover:border-[#375421]'}`}
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`font-black text-[11px] px-3.5 py-1.5 rounded-lg border-2 tracking-widest uppercase transition-colors ${isCurrentlyApplied ? 'text-white bg-[#375421] border-[#375421]' : 'text-gray-900 bg-[#ebf5eb] border-gray-900'}`}>
                                            {coupon.code}
                                        </span>
                                        {bestCoupon?.id === coupon.id && (
                                            <span className="text-2xl animate-pulse">🔥</span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-black text-gray-900 mb-2 leading-tight tracking-tight">
                                        {coupon.description}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-dashed border-gray-100">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest border-l-2 border-[#375421] pl-2">
                                            Min order: ₹{coupon.minimum_order_value || 0}
                                        </p>
                                        <button
                                            onClick={() => handleCopyCoupon(coupon.code)}
                                            className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.1em]"
                                        >
                                            Copy
                                        </button>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            onClick={() => {
                                                handleApplyCouponPreview(coupon.code);
                                                setIsCouponDrawerOpen(false);
                                            }}
                                            disabled={isCurrentlyApplied}
                                            className={`w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all active:scale-[0.96] flex items-center justify-center gap-2
                                            ${isCurrentlyApplied
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                                    : 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-site-bg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none'
                                                }`}
                                        >
                                            {isCurrentlyApplied ? 'COUPON APPLIED' : 'APPLY OFFER'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </RightDrawer>

            <div className="bg-white p-4">
                <AboutTheProducts
                    productDetailData={productDetailData}
                    ratingData={ratingData}
                    reviewData={reviewData}
                    onWriteReview={handleWriteReviewClick}
                />
            </div>
            <div className="bg-white pt-4">
                <PeopleAlsoBought title="People Also Bought" />
            </div>
            {isReviewModalOpen && (
                <div id="write-review-section" className="bg-white px-4 md:px-20">
                    <WriteAReview
                        isInline={true}
                        onClose={() => setIsReviewModalOpen(false)}
                        productDetailData={productDetailData}
                        productId={productDetailData?.data?.product?.id || productDetailData?.product?.id}
                    />
                </div>
            )}
            <StoreSchema />
        </>
    );
}
