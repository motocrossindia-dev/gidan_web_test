'use client';

import { useRouter, usePathname, useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/Slice/cartSlice";
import { addtowishlist } from "../../../redux/Slice/addtowishlistSlice";
import {

    ShoppingCart,
    Heart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import ProductSeller from "./ProductSeller";
import ProductReviews from "./ProductReviews";
import PeopleAlsoBought from "../../../components/Shared/PeopleAlsoBought";
import ProductFeatured from "./ProductFeatured";
import AddOnProduct from "./AddOnProduct";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { isMobile } from "react-device-detect";
import AboutTheProducts from "./AboutTheProducts";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import Verify from "../../../Services/Services/Verify";
import axiosInstance from "../../../Axios/axiosInstance";
import ProductSchema from "../seo/ProductSchema";
// HomepageSchema intentionally not used on product pages (wrong canonical entity)
import StoreSchema from "../seo/StoreSchema";
import WriteAReview from "./WriteAReview";
// import FaqAccordion from "./ProductFaq";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "../../../utils/ga4Ecommerce";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { toSlugString, getProductUrl, convertToSlug } from "../../../utils/urlHelper";



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
    const [addOnData, setAddOnData] = useState([]);
    const [quantity, setQuantity] = useState(1);
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
    // ==========auth cart
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAuthenticatedMobile] = useState(() => typeof window !== 'undefined' ? !!localStorage.getItem('userData') : false);

    const [token] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const accessToken = useSelector(selectAccessToken);

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
                    enqueueSnackbar("We're sorry, delivery is currently unavailable in your area 😔", {
                        variant: "warning",
                    });
                }
            }
        } catch (error) {
            enqueueSnackbar("We're sorry, delivery is currently unavailable in your area 😔", {
                variant: "error",
            });
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
            const product_data = {
                prod_id: productId,
                quantity: quantity,
            };

            try {
                if (accessToken) {
                    const response = await axiosInstance.post(`/order/cart/`, product_data);
                    if (response.status === 201) {
                        dispatch(addToCart(product_data));
                        enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
                        window.dispatchEvent(new Event("cartUpdated"));

                        // GA4: Track add_to_cart event
                        trackAddToCart(productDetailData?.data?.product, quantity);

                    }
                } else if (token) {
                    const response = await axiosInstance.post(`/order/cart/`,
                        product_data,);
                    if (response.status === 201) {
                        dispatch(addToCart(product_data));
                        enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
                        window.dispatchEvent(new Event("cartUpdated"));

                        // GA4: Track add_to_cart event
                        trackAddToCart(productDetailData?.data?.product, quantity);

                    }
                }

            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || "Failed to add product to cart", { variant: "info" });
            }
        } else {
            enqueueSnackbar("Please sign..", { variant: "info" });

            if (isMobile) {
                router.push("/mobile-signin", { replace: true });
            } else {
                router.push("/?modal=signIn", { replace: true });
            }
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
            enqueueSnackbar("Please login..", {
                variant: "info",
            }); // Show login message
            if (isMobile) {
                router.push("/mobile-signin", { replace: true });
            } else {
                router.push("/?modal=signIn", { replace: true });
            }
        }
    };


    const handleBuyItNowSubmit = async () => {

        if (isAuthenticated || isAuthenticatedMobile) {
            const productId = productDetailData?.data?.product?.id;
            if (!productId) {
                enqueueSnackbar("Product is still loading. Please wait.", { variant: "warning" });
                return;
            }

            const product_data = {
                order_source: "product",
                prod_id: productId,
                quantity: quantity,
            };

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


    const handleQuantity = async (product_id, action, qty) => {
        try {
            // Always send an action — default to "increment"
            const params = {
                quantity: qty,
                action: action === "decrement" ? "decrement" : "increment",
            };// For debugging
            const response = await axiosInstance.get(`/product/stockCheck/${product_id}/`, {
                params,
            });

            if (response.status === 200) {
                setQuantity(response?.data?.new_quantity);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message, { variant: 'info' });
        }
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
            <Verify />

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
                    <div className="flex flex-col md:flex-row -mx-4 relative overflow-visible">
                        <div className="md:flex-1 px-4">

                            {/* Main Image with Fully Working Zoom */}
                            {/* Main Image with Lens + Right Side Zoom */}
                            <div className="relative flex justify-center bg-gray-100">

                                <div
                                    className="relative w-full max-w-[500px] bg-gray-100 rounded-lg overflow-hidden"
                                    onMouseEnter={() => setZoom(true)}
                                    onMouseLeave={() => setZoom(false)}
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
                                        <img
                                            src={
                                                (() => {
                                                    const img = imageThumbnails[selectedImage] || imageThumbnails[0];
                                                    const path = img?.image || img?.url || "";
                                                    if (!path) return "";
                                                    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${path}`;
                                                })()
                                            }
                                            alt={productDetailData?.data?.product?.main_product_name || ""}
                                            className="w-full h-[500px] md:h-[450px] object-contain"
                                            ref={imgRef} loading="lazy" width="400" height="300" style={{ aspectRatio: '4/3' }} />
                                    ) : null}

                                    {/* LENS BOX (Transparent Square) */}
                                    {zoom && (
                                        <div
                                            className="absolute pointer-events-none border border-blue-400 bg-white/20 rounded-sm"
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
                                {/* ZOOM BOX ON RIGHT */}
                                {zoom && (
                                    <div
                                        className="absolute top-0 right-0 translate-x-[110%] w-[500px] h-[500px] hidden md:block border border-gray-300 rounded-lg bg-white z-50 shadow-lg"
                                        style={{
                                            backgroundImage: `url(${(() => {
                                                const img = imageThumbnails[selectedImage] || imageThumbnails[0];
                                                const path = img?.image || img?.url || "";
                                                if (!path) return "";
                                                return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${path}`;
                                            })()})`,
                                            backgroundRepeat: "no-repeat",

                                            /* BIGGER IMAGE FOR MAGNIFICATION */
                                            backgroundSize: `${zoomLevel * 120}%`,

                                            /* MOVE ZOOM AREA BASED ON LENS POSITION */
                                            backgroundPosition: `
        ${(position.x / (imageRef?.current?.offsetWidth || 1)) * 100}% 
        ${(position.y / (imageRef?.current?.offsetHeight || 1)) * 100}%
      `,
                                        }}
                                    ></div>
                                )}

                            </div>

                            <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto px-2 relative">
                                {/* Left Navigation Button */}
                                <button
                                    onClick={() =>
                                        setSelectedImage((prev) =>
                                            prev === 0 ? imageThumbnails.length - 1 : prev - 1
                                        )
                                    }
                                    className="absolute left-0 z-10 text-gray-600 hover:text-gray-800 focus:outline-none bg-white rounded-full p-1 shadow-md md:relative md:bg-transparent md:shadow-none md:p-0"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft size={24} />
                                </button>

                                {/* Thumbnail List */}
                                <div className="flex gap-3 overflow-x-auto px-8 md:px-0">
                                    {imageThumbnails.map((image, i) => (
                                        <button aria-label="Button"
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0 ${selectedImage === i
                                                ? "ring-2 ring-indigo-300 ring-inset"
                                                : ""
                                                }`}
                                        >
                                            <img
                                                src={(() => {
                                                    const path = image?.image || image?.url || "";
                                                    if (!path) return "";
                                                    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_URL || "https://backend.gidan.store"}${path}`;
                                                })()}
                                                loading="lazy"
                                                alt={`${productData.name} ${i + 1}`}
                                                className="w-full h-full object-cover rounded" width="400" height="300" style={{ aspectRatio: '4/3' }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Right Navigation Button */}
                                <button
                                    onClick={() =>
                                        setSelectedImage((prev) =>
                                            prev === imageThumbnails.length - 1 ? 0 : prev + 1
                                        )
                                    }
                                    className="absolute right-0 z-10 text-gray-600 hover:text-gray-800 focus:outline-none bg-white rounded-full p-1 shadow-md md:relative md:bg-transparent md:shadow-none md:p-0"
                                    aria-label="Next image"
                                >
                                    <FaChevronRight size={24} />
                                </button>
                            </div>


                            {/*<div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto px-2">*/}
                            {/*    /!* Left Navigation Button *!/*/}
                            {/*    <button aria-label="Previous"*/}
                            {/*        onClick={() =>*/}
                            {/*            setSelectedImage((prev) =>*/}
                            {/*                prev === 0 ? imageThumbnails.length - 1 : prev - 1*/}
                            {/*            )*/}

                            {/*        }*/}
                            {/*        className="text-gray-600 hover:text-gray-800 focus:outline-none shrink-0"*/}
                            {/*    >*/}
                            {/*        <FaChevronLeft size={24}/>*/}
                            {/*    </button>*/}

                            {/*    /!* Thumbnail List *!/*/}
                            {/*    <div className="flex gap-3 overflow-x-auto">*/}
                            {/*        {imageThumbnails.slice(1).map((image, i) => (*/}
                            {/*            <button aria-label="Button"*/}
                            {/*                key={i + 1}*/}
                            {/*                onClick={() => setSelectedImage(i + 1)}*/}
                            {/*                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0 ${*/}
                            {/*                    selectedImage === i + 1*/}
                            {/*                        ? "ring-2 ring-indigo-300 ring-inset"*/}
                            {/*                        : ""*/}
                            {/*                }`}*/}
                            {/*            >*/}
                            {/*                <img*/}
                            {/*                    src={image.image}*/}
                            {/*                    loading="lazy"*/}
                            {/*                    alt={`${productData.name} ${i + 2}`}*/}
                            {/*                    className="w-full h-full object-cover rounded"*/}
                            {/* width="400" height="300" style={{ aspectRatio: '4/3' }}                />*/}
                            {/*            </button>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}

                            {/*    /!* Right Navigation Button *!/*/}
                            {/*    <button aria-label="Next"*/}
                            {/*        onClick={() =>*/}
                            {/*            setSelectedImage((prev) =>*/}
                            {/*                prev === imageThumbnails.length - 1 ? 0 : prev + 1*/}
                            {/*            )*/}

                            {/*        }*/}
                            {/*        className="text-gray-600 hover:text-gray-800 focus:outline-none shrink-0"*/}
                            {/*    >*/}
                            {/*        <FaChevronRight size={24}/>*/}
                            {/*    </button>*/}
                            {/*</div>*/}

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
                                <p className="text-sm text-gray-600 mb-4 italic">
                                    <span className="font-bold">What's included:</span> {productDetailData.data.product.whats_included}
                                </p>
                            )}
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
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                                    >
                                        View reviews
                                    </button>
                                    <span className="text-sm text-gray-400">|</span>
                                    <button
                                        onClick={handleWriteReviewClick}
                                        disabled={isCheckingPurchase}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                                    >
                                        {isCheckingPurchase ? "Checking..." : (productDetailData?.data?.product?.is_review ? "Edit your review" : (productDetailData?.data?.product_rating?.num_ratings === 0 ? "Be the first to review" : "Write a review"))}
                                    </button>
                                </div>
                            </div>
                            <ProductSchema
                                product={productDetailData?.data?.product}
                                images={imageThumbnails}
                                rating={ratingData?.avg_rating || 0}
                                ratingCount={ratingData?.num_ratings || 0}
                                reviews={reviewData}
                            />

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
                            </div>


                            {productDetailData?.data?.product_weights?.length > 0 && (
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <span className="font-bold text-gray-700">Select Packet Size:</span>
                                        <div className="flex items-center mt-2">
                                            {productDetailData?.data?.product_weights?.map((size, idx) => (
                                                <button aria-label="Button"
                                                    key={size?.id || size?.size_grams || idx}
                                                    onClick={() => handleWeightClick(size, productDetailData?.data?.product)}
                                                    className={`${selectedgram?.size_grams === size?.size_grams
                                                        ? "border-2 border-bio-green text-gray-700"
                                                        : "border-2 border-gray-300 text-gray-700"
                                                        } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
                                                >
                                                    {size?.size_grams}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_litres?.length > 0 && (
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <span className="font-bold text-gray-700">Select Capacity:</span>
                                        <div className="flex items-center mt-2">
                                            {productDetailData?.data?.product_litres?.map((litre, idx) => (
                                                <button aria-label="Button"
                                                    key={litre?.id || litre?.name || idx}
                                                    onClick={() => handleLitreClick(litre, productDetailData?.data?.product)}
                                                    className={`${selectedLitre?.name === litre?.name
                                                        ? "border-2 border-bio-green text-gray-700"
                                                        : "border-2 border-gray-300 text-gray-700"
                                                        } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
                                                >
                                                    {litre?.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_sizes?.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Select Plant Size:</span>
                                    <div className="flex items-center mt-2">
                                        {productDetailData?.data?.product_sizes?.map((size, idx) => (
                                            <button aria-label="Button"
                                                key={size?.id || size?.size || idx}
                                                onClick={() => handleSizeClick(size, productDetailData?.data?.product)}
                                                className={`${selectedSize?.size === size?.size
                                                    ? "border-2 border-bio-green text-gray-700"
                                                    : "border-2 border-gray-300 text-gray-700"
                                                    } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
                                            >
                                                {size?.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_planter_sizes?.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Select Planter Size:</span>
                                    <div className="flex items-center mt-2">
                                        {productDetailData?.data?.product_planter_sizes?.map((size, idx) => (
                                            <button aria-label="Button"
                                                key={size?.id || size?.size || idx}
                                                onClick={() => handlePlanterSizeClick(size, productDetailData?.data?.product)}
                                                className={`${selectedPlanterSize?.size === size?.size
                                                    ? "border-2 border-bio-green text-gray-700"
                                                    : "border-2 border-gray-300 text-gray-700"
                                                    } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
                                            >
                                                {size?.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productDetailData?.data?.product_planters?.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Select Planter:</span>
                                    <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3">
                                        {productDetailData?.data?.product_planters?.map((planter, idx) => (
                                            <button aria-label="Button"
                                                key={planter?.id || planter?.name || idx}
                                                onClick={() => handlePlanterClick(planter, productDetailData?.data?.product)}
                                                className={`${selectedPlanter?.id === planter?.id
                                                    ? "border-2 border-bio-green text-gray-700"
                                                    : "border-2 border-gray-300 text-gray-700"
                                                    } py-2 px-4 rounded-lg text-sm mr-2 focus:outline-none`}
                                            >
                                                {planter?.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {productDetailData?.data?.product_colors?.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-bold text-gray-700">Color:</span>
                                    <div className="flex items-center mt-2 space-x-4">
                                        {productDetailData?.data?.product_colors?.map((color, idx) => (
                                            <div key={color?.id || color?.color_code || idx}
                                                className="flex flex-col items-center">
                                                <button
                                                    onClick={() =>
                                                        handlePlanterColorClick(color, productDetailData?.data?.product)
                                                    }
                                                    className={`w-10 h-10 rounded-full mb-1 focus:outline-none ${selectedColor?.id === color?.id
                                                        ? "border-2 border-bio-green text-gray-700"
                                                        : "border-2 border-gray-300 text-gray-700"
                                                        }`}
                                                    style={{ backgroundColor: color?.color_code }}
                                                    aria-label={`Select ${color?.name || "color"}`}
                                                />
                                                {/* ✅ Show color name */}
                                                <span className="text-xs text-gray-600">{color?.color_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 flex flex-wrap items-end gap-6 overflow-hidden">
                                <div className="flex flex-col">
                                    <span className="font-bold text-black-700 text-base mb-2">Quantity:</span>
                                    <div className="flex items-center">
                                        <button aria-label="Button"
                                            onClick={() => handleQuantity(productDetailData?.data?.product?.id, "decrement", quantity)}
                                            className="border border-bio-green text-black-700 py-2 px-4 rounded-l-lg hover:bg-bio-green"
                                        >
                                            -
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            className="w-20 text-center border border-bio-green bg-gray-200 text-black py-2 px-4
                                             [-moz-appearance:textfield]
                                             [appearance:textfield]
                                             [&::-webkit-inner-spin-button]:appearance-none
                                             [&::-webkit-outer-spin-button]:appearance-none"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            onBlur={() =>
                                                handleQuantity(
                                                    productDetailData?.data?.product?.id,
                                                    "direct",
                                                    quantity
                                                )
                                            }
                                        />
                                        <button aria-label="Button"
                                            onClick={() => handleQuantity(productDetailData?.data?.product?.id, "increment", quantity)}
                                            className="border border-bio-green text-black-700 py-2 px-4 rounded-r-lg hover:bg-bio-green"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-grow max-w-sm">
                                    <div className="flex w-full items-stretch">
                                        <input
                                            type="text"
                                            placeholder="Enter Pin Code"
                                            value={pincode}
                                            onChange={handlePincodeChange}
                                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l outline-none focus:border-bio-green min-w-0"
                                        />
                                        <button
                                            className="px-6 py-2 bg-bio-green text-white rounded-r hover:bg-green-700 whitespace-nowrap"
                                            onClick={handleCheck}
                                        >
                                            Check
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}
                                </div>
                            </div>
                            <div className="flex mb-8 space-x-2">
                                <div className="w-1/2">
                                    {productDetailData?.data?.product?.in_stock === false ? (
                                        <button
                                            aria-label="Add to cart disabled"
                                            className="w-full border border-gray-400 text-gray-400 bg-gray-100 py-2 px-4 rounded-lg cursor-not-allowed"
                                            disabled
                                        >
                                            <ShoppingCart className="inline-block mr-2" />
                                            Out of stock
                                        </button>
                                    ) : (
                                        <button
                                            aria-label="Add to cart"
                                            className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
                                            onClick={isInCart ? () => router.push('/cart') : handleAddToCartSubmit}
                                        >
                                            <ShoppingCart className="inline-block mr-2" />
                                            {isInCart ? "Go to Cart" : "Add to Cart"}
                                        </button>
                                    )}

                                </div>

                                <div className="w-1/2">
                                    <button aria-label="Add to wishlist"
                                        className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
                                        onClick={!productDetailData?.data?.product?.is_wishlist ? handleAddToWishlistSubmit : null}
                                    >
                                        <Heart className="inline-block mr-2" />
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>

                            {productDetailData?.data?.product?.in_stock === false ? (
                                <button
                                    className="bg-gray-400 text-white py-2 px-4 rounded-lg w-full cursor-not-allowed"
                                    disabled
                                >
                                    Out of stock
                                </button>
                            ) : (
                                <button
                                    className="bg-bio-green text-white py-2 px-4 rounded-lg w-full hover:bg-bio-green"
                                    onClick={handleBuyItNowSubmit}
                                >
                                    Buy It Now
                                </button>
                            )}

                        </div>
                    </div>
                    <AddOnProduct addOnData={addOnData} />

                </div>
            </div>

            {/* People also bought — full width, directly below buy section */}
            <div className="bg-white pt-4">
                <PeopleAlsoBought title="People Also Bought" />
            </div>

            {/* Product description / About */}
            <div className="bg-white p-4">
                <AboutTheProducts productDetailData={productDetailData} />
            </div>

            {/* Write a Review Section (Inline) */}
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

            {/* Product Reviews Section */}
            {(productDetailData?.data?.product || productDetailData?.product) && (
                <ProductReviews
                    product_Rating={ratingData}
                    total_Rating={reviewData}
                    productId={productDetailData?.data?.product?.id || productDetailData?.product?.id}
                    onWriteReview={handleWriteReviewClick}
                    productDetailData={productDetailData}
                />
            )}

            <ProductFeatured />
            <ProductSeller />
            {/* <FaqAccordion /> */}

            <StoreSchema />
        </>
    );
}






// ===================================old---------------------
// import React, {useState, useEffect, useRef} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {addToCart} from "../../../redux/Slice/cartSlice";
// import {addtowishlist} from "../../../redux/Slice/addtowishlistSlice";
// // import {
//
//     ShoppingCart,
//     Heart,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import ProductSeller from "./ProductSeller";
// import ProductReviews from "./ProductReviews";
// import FaqAccordion from "./ProductFaq";
// import ProductFeatured from "./ProductFeatured";
// import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
// import AddOnProduct from "./AddOnProduct";
// import {selectAccessToken} from "../../../redux/User/verificationSlice";
// import {isMobile} from "react-device-detect";
// import AboutTheProducts from "../ProductData/AboutTheProducts";
// import {FaStar} from "react-icons/fa6";
// import {FaStarHalfAlt} from "react-icons/fa";
// // import {enqueueSnackbar} from "notistack";
// import Verify from "../../../Services/Services/Verify";
// import axiosInstance from "../../../Axios/axiosInstance";
// import { Helmet } from "react-helmet-async";
// import ProductSchema from "../seo/ProductSchema";
// import HomepageSchema from "../seo/HomepageSchema";
// import StoreSchema from "../seo/StoreSchema";
//
// const productdata =
//     "https://firebasestorage.googleapis.com/v0/b/zpos-uk.appspot.com/o/67977213135ebb17c407e687%2F2025%2F1%2F1738430215367_scaled_Peacelilly.png?alt=media";
//
// const productData = {
//     name: "Peace Lily Plant",
//     prices: {
//         "2ft": 399.0,
//         "4ft": 499.0,
//         "6ft": 599.0,
//     },
//     originalPrices: {
//         "2ft": 499.0,
//         "4ft": 599.0,
//         "6ft": 699.0,
//     },
//     rating: 4,
//     images: [productdata, productdata, productdata, productdata],
//     sizes: ["2ft", "4ft", "6ft"],
//     planters: {
//         "2ft": ["Mini Pot", "Small Roma", "Small Diamond"],
//         "4ft": ["Medium Pot", "Medium Roma", "Medium Diamond", "Medium Spira"],
//         "6ft": [
//             "Large Pot",
//             "Large Roma",
//             "Large Diamond",
//             "Large Spira",
//             "XL Roma",
//         ],
//     },
//     planterSizes: {
//         "2ft": ["2ft", "2.5ft", "3ft"],
//         "4ft": ["4ft", "4.5ft", "5ft"],
//         "6ft": ["6ft", "6.5ft", "7ft"],
//     },
//     colors: {
//         "2ft": {
//             "Mini Pot": ["white", "beige", "gray"],
//             "Small Roma": ["terracotta", "black", "green"],
//             "Small Diamond": ["silver", "gold", "rose gold"],
//         },
//         "4ft": {
//             "Medium Pot": ["white", "black", "blue", "green"],
//             "Medium Roma": ["terracotta", "gray", "brown", "green"],
//             "Medium Diamond": ["silver", "gold", "copper", "black"],
//             "Medium Spira": ["white", "black", "silver", "gold"],
//         },
//         "6ft": {
//             "Large Pot": ["white", "black", "gray", "brown", "green"],
//             "Large Roma": ["terracotta", "black", "gray", "green", "blue"],
//             "Large Diamond": ["silver", "gold", "rose gold", "black", "white"],
//             "Large Spira": ["white", "black", "silver", "gold", "copper"],
//             "XL Roma": ["terracotta", "gray", "brown", "green", "blue"],
//         },
//     },
//     description:
//         "Are you a sucker for succulents? Then the Mini Jade succulent will be your dream plant! As one of the easiest houseplants to look after, the Crassula Green Mini plant boasts a lush foliage which beautifies any room. The Jade is also considered lucky as per Feng Shui for its coin-like round plump leaves. So, go ahead and bring Jade home... luck just tags along!",
//     addOns: [
//         {name: "Peace Lily Plant", price: 499.0, image: productdata},
//         {name: "Snake Plant", price: 399.0, image: productdata},
//         {name: "Monstera Deliciosa", price: 599.0, image: productdata},
//         {name: "Aloe Vera", price: 299.0, image: productdata},
//     ],
// };
//
// export default function Component() {
//     const pathname = usePathname();
//   const searchParams = useSearchParams();
//     const [selectedImage, setSelectedImage] = useState(0);
//
//     const [selectedSize, setSelectedSize] = useState("");
//     const [selectedgram, setSelectedGram] = useState("");
//     const [selectedLitre, setSelectedLitre] = useState("");
//     const [selectedPlanterSize, setSelectedPlanterSize] = useState("");
//     const [selectedPlanter, setSelectedPlanter] = useState("");
//     const [selectedColor, setSelectedColor] = useState("");
//     const [addOnData, setAddOnData] = useState([]);
//     const [quantity, setQuantity] = useState(1);
//     const [inWishlist, setInWishlist] = useState(null)
//     const [productDetailData, setProductDetailData] = useState([]);
//     const [imageThumbnails, setImageThumbnails] = useState([]);
//     const params = useParams();
//     const id = null?.product_id || params.id;
//     const [product_slug, setproduct_slug] = useState(null?.product_id || id);
//     const [scategory_slug, setcategory_slug] = useState(null?.category_slug);
//
//     const [pincode, setPincode] = useState("");
//     const [error, setError] = useState("");
//     // ==========auth cart
//     const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//     const isAuthenticatedMobile = !!localStorage.getItem('userData');
//
//     const token = localStorage.getItem("token")
//     const accessToken = useSelector(selectAccessToken);
//     const isInCart = productDetailData?.data?.product?.is_cart;
//
//     const [optionType, setOptionType] = useState(null);
//
//     const hasWeights = productDetailData?.data?.product_weights?.length > 0;
//     const hasLitres = productDetailData?.data?.product_litres?.length > 0;
//
//     const [zoom, setZoom] = useState(false);
//     const [position, setPosition] = useState({x: 0, y: 0});
//
//     const lensSize = 120; // square lens size
//     const zoomLevel = 2.5; // magnification level
//
//     const imageRef = useRef(null);
//     const imgRef = useRef(null);
//     const product = productDetailData?.data?.product;
//
//     // ⬆️ Scroll to top on route change
//     useEffect(() => {
//         window.scrollTo({top: -10, left: 0, behavior: 'auto'}); // change to 'smooth' if needed
//     }, [pathname]);
//
//     const handlePincodeChange = (e) => {
//         const value = e.target.value;
//
//         // Allow only digits and max 6 chars
//         if (/^\d{0,6}$/.test(value)) {
//             setPincode(value);
//             setError(""); // Clear error if any
//         }
//     };
//
//     const handleCheck = async () => {
//         if (pincode.length !== 6) {
//             setError("Please enter a valid 6-digit pincode");
//             return;
//         }
//
//         try {
//
//             const response = await axiosInstance.post(`/tracking/check-pincode/`, {
//                 pincode: pincode
//             })
//             if (response.status === 200) {
//                 const isAvailable = response?.data?.delivery_available;
//
//                 if (isAvailable) {
//                     enqueueSnackbar("Great news! Delivery is available in your area 🎉", {
//                         variant: "success",
//                     });
//                 } else {
//                     enqueueSnackbar("We're sorry, delivery is currently unavailable in your area 😔", {
//                         variant: "warning",
//                     });
//                 }
//             }
//         } catch (error) {
//             enqueueSnackbar("We're sorry, delivery is currently unavailable in your area 😔", {
//                 variant: "error",
//             });
//         }
//
//     };
//
//     const dispatch = useDispatch();
//     const router = useRouter();
//
//     const handleAddToCartSubmit = async () => {
//         if (isAuthenticated || isAuthenticatedMobile) {
//             const product_data = {
//                 prod_id: productDetailData?.data?.product?.id,
//                 quantity: quantity,
//             };
//
//             try {
//                 if (accessToken) {
//                     const response = await axiosInstance.post(`/order/cart/`, product_data);
//                     if (response.status === 201) {
//                         dispatch(addToCart(product_data));
//                         enqueueSnackbar("Product added to cart successfully!", {variant: "success"});
//                         window.dispatchEvent(new Event("cartUpdated"));
//                         window.dataLayer = window.dataLayer || [];
//                         window.dataLayer.push({
//                             event: "add_to_cart",
//                             ecommerce: {
//                                 currency: "NGN",
//                                 value: productDetailData?.data?.product?.selling_price,
//                                 items: [{
//                                     item_name: productDetailData?.data?.product?.main_product_name,
//                                     item_id: productDetailData?.data?.product?.id,
//                                     price: productDetailData?.data?.product?.selling_price,
//                                     quantity: quantity
//                                 }]
//                             }
//                         });
//
//                     }
//                 } else if (token) {
//                     const response = await axiosInstance.post(`/order/cart/`,
//                         product_data,);
//                     if (response.status === 201) {
//                         dispatch(addToCart(product_data));
//                         enqueueSnackbar("Product added to cart successfully!", {variant: "success"});
//                         window.dispatchEvent(new Event("cartUpdated"));
//                         window.dataLayer = window.dataLayer || [];
//                         window.dataLayer.push({
//                             event: "add_to_cart",
//                             ecommerce: {
//                                 currency: "NGN",
//                                 value: productDetailData?.data?.product?.selling_price,
//                                 items: [{
//                                     item_name: productDetailData?.data?.product?.main_product_name,
//                                     item_id: productDetailData?.data?.product?.id,
//                                     price: productDetailData?.data?.product?.selling_price,
//                                     quantity: quantity
//                                 }]
//                             }
//                         });
//
//                     }
//                 }
//
//             } catch (error) {
//                 enqueueSnackbar(error.response?.data?.message || "Failed to add product to cart", {variant: "info"});
//             }
//         } else {
//             enqueueSnackbar("Please sign..", {variant: "info"});
//
//             if (isMobile) {
//                 router.push("/mobile-signin", {replace: true});
//             } else {
//                 router.push("/?modal=signIn", {replace: true});
//             }
//         }
//
//
//     };
//
//
//     const handleAddToWishlistSubmit = async () => {
//         if (isAuthenticated || isAuthenticatedMobile) {
//             const product_id = productDetailData?.data?.product?.id;
//
//             try {
//                 // Send only the product_id to the API
//                 const response = await axiosInstance.post(`/order/wishlist/`,
//                     {prod_id: product_id});
//                 if (response?.status === 200) {
//                     setInWishlist(response?.data?.data?.in_wishlist)
//                     dispatch(addtowishlist(product_id));
//                     window.dispatchEvent(new Event("wishlistUpdated"));
//
//                     enqueueSnackbar(response?.data?.message, {variant: "success"});
//                 }
//
//             } catch (error) {
//
//                 enqueueSnackbar(
//                     "Failed to add product to wishlist. Please try again.",
//                     {variant: "error"}
//                 ); // Show error message
//             }
//         } else {
//             enqueueSnackbar("Please login..", {
//                 variant: "info",
//             }); // Show login message
//             if (isMobile) {
//                 router.push("/mobile-signin", {replace: true});
//             } else {
//                 router.push("/?modal=signIn", {replace: true});
//             }
//         }
//     };
//
//
//     const handleBuyItNowSubmit = async () => {
//
//         if (isAuthenticated || isAuthenticatedMobile) {
//
//             const product_data = {
//                 order_source: "product",
//                 prod_id: productDetailData?.data?.product?.id,
//                 quantity: quantity,
//             };
//
//             try {
//                 const response = await axiosInstance.post(`/order/placeOrder/`, product_data);
//
//
//                 if (response.status === 200) {
//                     //      enqueueSnackbar("Order placed successfully!", { variant: "success" });
//                     window.dispatchEvent(new Event("cartUpdated"));
//
//
//                     if (window.innerWidth <= 768) {
//                         // router.push("/order-summary", { state: { resource: response.data.data } }); // Navigate to mobile checkout
//                         router.push("/checkout", {state: {ordersummary: response.data.data}}); // Navigate to regular checkout
//
//
//                     } else {
//                         router.push("/checkout", {state: {ordersummary: response.data.data}}); // Navigate to regular checkout
//                     }
//                 }
//
//             } catch (error) {
//                 if (error.response && error.response.status === 400) {
//
//                     enqueueSnackbar(error.response.data.message, {variant: "warning"});
//                     if (error.response.data.message === "User profile is not updated.") {
//                         router.push('/profile')
//                     }
//                     if (error.response.data.message === "User address is not updated.") {
//
//                         router.push('/profile')
//
//                     }
//                 } else {
//                     enqueueSnackbar("Failed to place order. Please try again.", {variant: "error"});
//                 }
//             }
//         } else {
//             // If not authenticated, redirect based on device type
//             enqueueSnackbar("Please Login or Signup to Buy Our Products.", {variant: 'info'});
//             if (isMobile) {
//                 router.push("/mobile-signin", {replace: true});
//             } else {
//                 router.push("/?modal=signIn", {replace: true});
//             }
//         }
//     };
//
//     const CustomPrevArrow = ({className, onClick}) => (
//         <button className={`${className} z-10 left-0`} onClick={onClick}>
//             <ChevronLeft className="w-6 h-6 text-gray-800"/>
//         </button>
//     );
//
//     const CustomNextArrow = ({className, onClick}) => (
//         <button className={`${className} z-10 right-0`} onClick={onClick}>
//             <ChevronRight className="w-6 h-6 text-gray-800"/>
//         </button>
//     );
//
//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 2,
//         slidesToScroll: 2,
//         prevArrow: <CustomPrevArrow/>,
//         nextArrow: <CustomNextArrow/>,
//     };
//
//
//     const handleQuantity = async (product_id, action, qty) => {
//         try {
//             // Always send an action — default to "increment"
//             const params = {
//                 quantity: qty,
//                 action: action === "decrement" ? "decrement" : "increment",
//             };
//
//             console.log(params); // For debugging
//             const response = await axiosInstance.get(`/product/stockCheck/${product_id}/`, {
//                 params,
//             });
//
//             if (response.status === 200) {
//                 setQuantity(response?.data?.new_quantity);
//             }
//         } catch (error) {
//             enqueueSnackbar(error?.response?.data?.message, {variant: 'info'});
//         }
//     };
//     const handleSizeClick = async (size, product) => {
//         try {
//             // Set the selected size
//
//             setSelectedSize(size);
//
//             // Make API call to filter products by size
//             const response = await axiosInstance.get(`/product/filterProduct/${product?.id}/`,
//                 {
//                     params: {
//                         size_id: size.id,
//
//                     },
//                 }
//             );
//
//             // If the same size is clicked again, toggle the selection (deselect)
//             if (selectedSize?.size === size?.size) {
//                 setSelectedSize(null); // Deselect the size
//             } else {
//                 setSelectedSize(size); // Select the new size
//             }
//
//             // Handle the API response
//             const data = response.data;
//             const images = data?.data?.product?.images || [];
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             setImageThumbnails(images);
//             setProductDetailData(data);
//
//             // You can update state or perform additional actions with the filtered products
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//             // Handle error scenarios
//         }
//     };
//
//     const handleWeightClick = async (size, product) => {
//         try {
//
//             // Toggle selection properly
//             setSelectedGram((prev) =>
//                 prev?.size_grams === size?.size_grams ? null : size
//             );
//
//             // Make API call
//             const response = await axiosInstance.get(
//                 `/product/filterProduct/${product?.id}/`,
//                 {
//                     params: {weight_id: size.id},
//                 }
//             );
//
//             // Ensure data exists before updating state
//
//             const data = response?.data;
//
//             if (data?.data?.product?.images) {
//                 setImageThumbnails(data?.data?.product?.images || []);
//             }
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             setProductDetailData(data);
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//         }
//     };
//
//     const handleLitreClick = async (litre, product) => {
//         try {
//
//             // Toggle selection properly
//             setSelectedLitre((prev) =>
//                 prev?.name === litre?.name ? null : litre
//             );
//
//             // Make API call
//             const response = await axiosInstance.get(
//                 `/product/filterProduct/${product?.id}/`,
//                 {
//                     params: {litre_id: litre.id},
//                 }
//             );
//
//             // Ensure data exists before updating state
//
//             const data = response?.data;
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             if (data?.data?.product?.images) {
//                 setImageThumbnails(data?.data?.product?.images || []);
//             }
//
//             setProductDetailData(data);
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//         }
//     };
//
//
//     const handlePlanterSizeClick = async (size, product) => {
//         try {
//             // Set the selected size
//             setSelectedPlanterSize(size);
//
//             // Make API call to filter products by size
//             const response = await axiosInstance.get(
//                 `/product/filterProduct/${product.id}/`,
//                 {
//                     params: {
//                         planter_size_id: size.id,
//                         size_id: product.size_id,
//                         // planter_id: product.planter_id,
//                         // product_colors_id: product.color_id,
//                     },
//                 }
//             );
//             // If the same size is clicked again, toggle the selection (deselect)
//             if (selectedPlanterSize?.size === size?.size) {
//                 setSelectedPlanterSize(null); // Deselect the size
//             } else {
//                 setSelectedPlanterSize(size); // Select the new size
//             }
//             // Handle the API response
//             const data = response.data;
//             const images = data?.data?.product?.images || [];
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             setImageThumbnails(images);
//             setProductDetailData(data);
//
//             // You can update state or perform additional actions with the filtered products
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//             // Handle error scenarios
//         }
//     };
//
//     const handlePlanterClick = async (planter, product) => {
//         try {
//             // Set the selected size
//             setSelectedPlanter(planter, id);
//             // If the same planter is clicked again, toggle the selection (deselect)
//             if (selectedPlanter?.id === planter?.id) {
//                 setSelectedPlanter(null); // Deselect the planter
//             } else {
//                 setSelectedPlanter(planter); // Select the new planter
//             }
//             // Make API call to filter products by size
//             const response = await axiosInstance.get(
//                 `/product/filterProduct/${product.id}/`,
//                 {
//                     params: {
//                         planter_id: planter.id,
//                         planter_size_id: product.planter_size_id,
//                         size_id: product.size_id,
//                         // product_colors_id: product.color_id,
//                     },
//                 }
//             );
//
//             // Handle the API response
//             const data = response.data;
//             const images = data?.data?.product?.images || [];
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             setImageThumbnails(images);
//             setProductDetailData(data);
//
//             // You can update state or perform additional actions with the filtered products
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//             // Handle error scenarios
//         }
//     };
//
//     const handlePlanterColorClick = async (color, product) => {
//         try {
//             // 🚫 remove toggle/deselect logic
//             if (selectedColor?.id === color?.id) {
//                 return; // if same color clicked, do nothing
//             }
//
//             setSelectedColor(color);
//
//             // ✅ Make API call to filter by new color
//             const response = await axiosInstance.get(
//                 `/product/filterProduct/${product.id}/`,
//                 {
//                     params: {
//                         color_id: color.id,
//                         planter_id: product.planter_id,
//                         planter_size_id: product.planter_size_id,
//                         size_id: product.size_id,
//                     },
//                 }
//             );
//
//             const data = response.data;
//             const images = data?.data?.product?.images || [];
//             setproduct_slug(data?.data?.product?.slug || id);
//             setcategory_slug(data?.data?.product?.category_slug);
//             const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//             window.history.pushState(null, "", newUrl);
//             setImageThumbnails(images);
//             setProductDetailData(data);
//             setSelectedImage(0);
//
//         } catch (error) {
//             console.error("Error fetching filtered products:", error);
//         }
//     };
//
//
// // ✅ Fetch product data only once
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axiosInstance.get(`/product/defaultProduct/${id}/`);
//                 if (response.status === 200) {
//                     const data = response.data;
//                     setProductDetailData(data);
//                     setAddOnData(data?.data?.product_add_ons || []);
//                     setImageThumbnails(data?.data?.product?.images || []);
//                     setproduct_slug(data?.data?.product?.slug || id);
//                     setcategory_slug(data?.data?.product?.category_slug);
//                     const newUrl = `/category/${scategory_slug}/${product_slug}/`;
//                     window.history.pushState(null, "", newUrl);
//                     const {size_id, planter_size_id, planter_id, color_id, litre_id, weight_id} = data.data.product;
//
//                     const defaultSize =
//                         data.data.product_sizes.find(
//                             (s) => s.id === size_id || s.size === size_id
//                         ) || data.data.product_sizes[0] || "";
//
//                     const defaultPlanterSize =
//                         data.data.product_planter_sizes.find(
//                             (s) =>
//                                 s.id === planter_size_id ||
//                                 s.size === planter_size_id?.size ||
//                                 s.name === planter_size_id?.name
//                         ) || data.data.product_planter_sizes[0] || "";
//
//                     const defaultPlanter =
//                         data.data.product_planters.find(
//                             (s) => s.id === planter_id || s.name === planter_id?.name
//                         ) || data.data.product_planters[0] || "";
//
//                     const defaultColor =
//                         data.data.product_colors.find((c) => c.id === Number(color_id)) ||
//                         data.data.product_colors[0] || null;
//
//                     const defaultLitre =
//                         data.data.product_litres.find(
//                             (s) => s.id === litre_id || s.name === litre_id?.name
//                         ) || data.data.product_litres[0] || "";
//
//                     const defaultWeight =
//                         data.data.product_weights.find(
//                             (s) => s.id === weight_id || s.name === weight_id?.name
//                         ) || data.data.product_weights[0] || "";
//
//                     setSelectedSize(defaultSize);
//                     setSelectedPlanterSize(defaultPlanterSize);
//                     setSelectedPlanter(defaultPlanter);
//                     setSelectedColor(defaultColor);
//                     setSelectedLitre(defaultLitre);
//                     setSelectedGram(defaultWeight);
//
//                     // ✅ Trigger the same flow as manual selection to update images
//                     if (defaultColor) {
//                         handlePlanterColorClick(defaultColor, data.data.product);
//                     }
//                     if (defaultSize) {
//                         handleSizeClick(defaultSize, data.data.product);
//                     }
//                     if (defaultPlanterSize) {
//                         handlePlanterSizeClick(defaultPlanterSize, data.data.product);
//                     }
//                     if (defaultPlanter) {
//                         handlePlanterClick(defaultPlanter, data.data.product);
//                     }
//                     if (defaultLitre) {
//                         handleLitreClick(defaultLitre, data.data.product);
//                     }
//                     if (defaultWeight) {
//                         handleWeightClick(defaultWeight, data.data.product);
//                     }
//
//                 }
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };
//
//         if (id) fetchData();
//     }, [id]);
//
//     console.log("iiiidd", id,'p_slug',product_slug);
//
//     const category_slug = null?.category_slug || product.category_slug;
//     console.log(id,'========details');
//     // Fallbacks if fields are missing
//     const metaTitle = product?.meta_title
//         ? product.meta_title
//         : product?.main_product_name
//             ? `Buy ${product.main_product_name} Online | Best Price - Gidan`
//             : 'Buy Gardening Products Online | Best Price - Gidan';
//
//     const metaDescription = product?.meta_description
//         ? product.meta_description
//         : product?.main_product_name
//             ? `Buy ${product.main_product_name} online at Gidan. ✔ Premium quality ✔ Healthy & well-packed ✔ Trusted gardening brand. Fast delivery & easy returns.`
//             : 'Buy gardening products online at Gidan. ✔ Premium quality ✔ Trusted brand ✔ Fast delivery & easy returns.';
//
//     const metaKeywords =
//         product?.meta_keywords || "gardening, plants, seeds, pots, plant care";
//
//     const canonicalUrl =
//         (id || product_slug || product?.slug) &&
//         (category_slug || product?.category_slug || scategory_slug)
//             ? `https://www.gidan.store/category/${encodeURIComponent(
//                 category_slug || product?.category_slug || scategory_slug
//             )}/${encodeURIComponent(product_slug || product?.slug || id)}/`
//             : 'https://www.gidan.store/';
//
// // OG image fallback
//     const ogImage =
//         product?.images?.[0]?.image ||
//         product?.main_image ||
//         "https://www.gidan.store/default-product.jpg";
//
//
//     return (
//         <>
//             <Verify/>
//             <Helmet>
//                 {/* Basic SEO */}
//                 <title>{metaTitle}</title>
//                 <meta name="description" content={metaDescription} />
//                 <meta name="keywords" content={metaKeywords} />
//                 <link rel="canonical" href={canonicalUrl} />
//
//                 {/* Open Graph */}
//                 <meta property="og:title" content={metaTitle} />
//                 <meta property="og:description" content={metaDescription} />
//                 <meta property="og:image" content={ogImage} />
//                 <meta property="og:url" content={canonicalUrl} />
//                 <meta property="og:type" content="product" />
//                 <meta property="og:site_name" content="Gidan" />
//                 <meta property="og:locale" content="en_IN" />
//
//                 {/* Twitter Card */}
//                 <meta name="twitter:card" content="summary_large_image" />
//                 <meta name="twitter:title" content={metaTitle} />
//                 <meta name="twitter:description" content={metaDescription} />
//                 <meta name="twitter:image" content={ogImage} />
//             </Helmet>
//
//             <div className="w-full" style={{backgroundColor: "whitesmoke"}}>
//                 <div className="container mx-auto px-3 py-4 font-sans md:px-8">
//                     <div className="flex flex-col md:flex-row -mx-4 relative overflow-visible">
//                         <div className="md:flex-1 px-4">
//
//                             {/* Main Image with Fully Working Zoom */}
//                             {/* Main Image with Lens + Right Side Zoom */}
//                             <div className="relative flex justify-center bg-gray-100">
//
//                                 <div
//                                     className="relative w-full max-w-[500px] bg-gray-100 rounded-lg overflow-hidden"
//                                     onMouseEnter={() => setZoom(true)}
//                                     onMouseLeave={() => setZoom(false)}
//                                     onMouseMove={(e) => {
//                                         const rect = e.currentTarget.getBoundingClientRect();
//                                         const x = e.clientX - rect.left;
//                                         const y = e.clientY - rect.top;
//
//                                         setPosition({x, y});
//                                     }}
//                                     ref={imageRef}
//                                 >
//                                     {/* MAIN IMAGE */}
//                                     <img
//                                         src={
//                                             imageThumbnails[selectedImage]?.image ||
//                                             imageThumbnails[0]?.image ||
//                                             ""
//                                         }
//                                         alt={productDetailData?.data?.product?.main_product_name || ""}
//                                         className="w-full h-[500px] md:h-[450px] object-contain"
//                                         ref={imgRef}
//                                     />
//
//                                     {/* LENS BOX (Transparent Square) */}
//                                     {zoom && (
//                                         <div
//                                             className="absolute pointer-events-none border border-blue-400 bg-white/20 rounded-sm"
//                                             style={{
//                                                 width: lensSize,
//                                                 height: lensSize,
//                                                 top: position.y - lensSize / 2,
//                                                 left: position.x - lensSize / 2,
//                                             }}
//                                         />
//                                     )}
//                                 </div>
//
//                                 {/* ZOOM BOX ON RIGHT */}
//                                 {/* ZOOM BOX ON RIGHT */}
//                                 {zoom && (
//                                     <div
//                                         className="absolute top-0 right-0 translate-x-[110%] w-[500px] h-[500px] hidden md:block border border-gray-300 rounded-lg bg-white z-50 shadow-lg"
//                                         style={{
//                                             backgroundImage: `url(${
//                                                 imageThumbnails[selectedImage]?.image ||
//                                                 imageThumbnails[0]?.image
//                                             })`,
//                                             backgroundRepeat: "no-repeat",
//
//                                             /* BIGGER IMAGE FOR MAGNIFICATION */
//                                             backgroundSize: `${zoomLevel * 120}%`,
//
//                                             /* MOVE ZOOM AREA BASED ON LENS POSITION */
//                                             backgroundPosition: `
//         ${(position.x / (imageRef?.current?.offsetWidth || 1)) * 100}%
//         ${(position.y / (imageRef?.current?.offsetHeight || 1)) * 100}%
//       `,
//                                         }}
//                                     ></div>
//                                 )}
//
//                             </div>
//
//                             <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto px-2 relative">
//                                 {/* Left Navigation Button */}
//                                 <button
//                                     onClick={() =>
//                                         setSelectedImage((prev) =>
//                                             prev === 0 ? imageThumbnails.length - 1 : prev - 1
//                                         )
//                                     }
//                                     className="absolute left-0 z-10 text-gray-500 hover:text-gray-800 focus:outline-none bg-white rounded-full p-1 shadow-md md:relative md:bg-transparent md:shadow-none md:p-0"
//                                     aria-label="Previous image"
//                                 >
//                                     <FaChevronLeft size={24} />
//                                 </button>
//
//                                 {/* Thumbnail List */}
//                                 <div className="flex gap-3 overflow-x-auto px-8 md:px-0">
//                                     {imageThumbnails.map((image, i) => (
//                                         <button
//                                             key={i + 1}
//                                             onClick={() => setSelectedImage(i + 1)}
//                                             className={`w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0 ${
//                                                 selectedImage === i + 1
//                                                     ? "ring-2 ring-indigo-300 ring-inset"
//                                                     : ""
//                                             }`}
//                                         >
//                                             <img
//                                                 src={image.image}
//                                                 loading="lazy"
//                                                 alt={`${productData.name} ${i + 2}`}
//                                                 className="w-full h-full object-cover rounded"
//                                             />
//                                         </button>
//                                     ))}
//                                 </div>
//
//                                 {/* Right Navigation Button */}
//                                 <button
//                                     onClick={() =>
//                                         setSelectedImage((prev) =>
//                                             prev === imageThumbnails.length - 1 ? 0 : prev + 1
//                                         )
//                                     }
//                                     className="absolute right-0 z-10 text-gray-500 hover:text-gray-800 focus:outline-none bg-white rounded-full p-1 shadow-md md:relative md:bg-transparent md:shadow-none md:p-0"
//                                     aria-label="Next image"
//                                 >
//                                     <FaChevronRight size={24} />
//                                 </button>
//                             </div>
//
//
//                             {/*<div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto px-2">*/}
//                             {/*    /!* Left Navigation Button *!/*/}
//                             {/*    <button*/}
//                             {/*        onClick={() =>*/}
//                             {/*            setSelectedImage((prev) =>*/}
//                             {/*                prev === 0 ? imageThumbnails.length - 1 : prev - 1*/}
//                             {/*            )*/}
//
//                             {/*        }*/}
//                             {/*        className="text-gray-500 hover:text-gray-800 focus:outline-none shrink-0"*/}
//                             {/*    >*/}
//                             {/*        <FaChevronLeft size={24}/>*/}
//                             {/*    </button>*/}
//
//                             {/*    /!* Thumbnail List *!/*/}
//                             {/*    <div className="flex gap-3 overflow-x-auto">*/}
//                             {/*        {imageThumbnails.slice(1).map((image, i) => (*/}
//                             {/*            <button*/}
//                             {/*                key={i + 1}*/}
//                             {/*                onClick={() => setSelectedImage(i + 1)}*/}
//                             {/*                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0 ${*/}
//                             {/*                    selectedImage === i + 1*/}
//                             {/*                        ? "ring-2 ring-indigo-300 ring-inset"*/}
//                             {/*                        : ""*/}
//                             {/*                }`}*/}
//                             {/*            >*/}
//                             {/*                <img*/}
//                             {/*                    src={image.image}*/}
//                             {/*                    loading="lazy"*/}
//                             {/*                    alt={`${productData.name} ${i + 2}`}*/}
//                             {/*                    className="w-full h-full object-cover rounded"*/}
//                             {/*                />*/}
//                             {/*            </button>*/}
//                             {/*        ))}*/}
//                             {/*    </div>*/}
//
//                             {/*    /!* Right Navigation Button *!/*/}
//                             {/*    <button*/}
//                             {/*        onClick={() =>*/}
//                             {/*            setSelectedImage((prev) =>*/}
//                             {/*                prev === imageThumbnails.length - 1 ? 0 : prev + 1*/}
//                             {/*            )*/}
//
//                             {/*        }*/}
//                             {/*        className="text-gray-500 hover:text-gray-800 focus:outline-none shrink-0"*/}
//                             {/*    >*/}
//                             {/*        <FaChevronRight size={24}/>*/}
//                             {/*    </button>*/}
//                             {/*</div>*/}
//
//                         </div>
//
//                         <div className="md:flex-1 px-4 font-sans mt-8">
//                             <h2 className="text-xl md:text-3xl font-bold mb-2">
//                                 {productDetailData?.data?.product?.main_product_name || ""}
//                             </h2>
//                             <h4 className="text-md md:text-lg font-sans mb-4 whitespace-pre-line">
//                                 {productDetailData?.data?.product?.description || ""}
//                             </h4>
//                             <p className="text-black-600 text-sm mb-4">
//                                 {Array.from({length: 5}).map((_, i) => {
//                                     const fraction =
//                                         productDetailData?.data?.product_rating?.avg_rating || 0;
//                                     const filled = Math.floor(fraction);
//                                     const half = fraction - filled;
//                                     return (
//                                         <React.Fragment key={i}>
//                                             {i < filled && (
//                                                 <FaStar className="inline-block text-bio-green"/>
//                                             )}
//                                             {i === filled && half > 0 && (
//                                                 <FaStarHalfAlt className="inline-block text-bio-green"/>
//                                             )}
//                                             {i >= filled + half && (
//                                                 <FaStar className="inline-block text-gray-300"/>
//                                             )}
//                                         </React.Fragment>
//                                     );
//                                 })}
//                             </p>
//                             <ProductSchema
//                                 product={productDetailData?.data?.product}
//                                 images={imageThumbnails}
//                                 rating={productDetailData?.data?.product_rating?.avg_rating || 0}
//                                 ratingCount={productDetailData?.data?.product_rating?.num_ratings || 0}
//                             />
//
//                             <div className="flex mb-4 items-center">
//                                 <div className="mr-4 flex items-center">
//     <span className="font-bold text-bio-green text-lg md:text-2xl">
//       ₹{Math.round(productDetailData?.data?.product?.selling_price || 0)}
//     </span>
//
//                                     {productDetailData?.data?.product?.mrp > productDetailData?.data?.product?.selling_price && (
//                                         <>
//         <span className="text-gray-400 text-md md:text-xl line-through ml-2">
//           ₹{Math.round(productDetailData?.data?.product?.mrp || 0)}
//         </span>
//                                             <span className="ml-2 text-red-500 font-semibold text-md md:text-lg">
//           {Math.round(
//               ((productDetailData?.data?.product?.mrp - productDetailData?.data?.product?.selling_price) /
//                   productDetailData?.data?.product?.mrp) *
//               100
//           )}
//                                                 % OFF
//         </span>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//
//
//                             {productDetailData?.data?.product_weights?.length > 0 && (
//                                 <div className="space-y-6">
//                                     <div className="mb-4">
//                                         <span className="font-bold text-gray-700">Select Packet Size:</span>
//                                         <div className="flex items-center mt-2">
//                                             {productDetailData?.data?.product_weights?.map((size, idx) => (
//                                                 <button
//                                                     key={size?.id || size?.size_grams || idx}
//                                                     onClick={() => handleWeightClick(size, productDetailData?.data?.product)}
//                                                     className={`${
//                                                         selectedgram?.size_grams === size?.size_grams
//                                                             ? "border-2 border-bio-green text-gray-700"
//                                                             : "border-2 border-gray-300 text-gray-700"
//                                                     } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
//                                                 >
//                                                     {size?.size_grams}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {productDetailData?.data?.product_litres?.length > 0 && (
//                                 <div className="space-y-6">
//                                     <div className="mb-4">
//                                         <span className="font-bold text-gray-700">Select Capacity:</span>
//                                         <div className="flex items-center mt-2">
//                                             {productDetailData?.data?.product_litres?.map((litre, idx) => (
//                                                 <button
//                                                     key={litre?.id || litre?.name || idx}
//                                                     onClick={() => handleLitreClick(litre, productDetailData?.data?.product)}
//                                                     className={`${
//                                                         selectedLitre?.name === litre?.name
//                                                             ? "border-2 border-bio-green text-gray-700"
//                                                             : "border-2 border-gray-300 text-gray-700"
//                                                     } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
//                                                 >
//                                                     {litre?.name}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {productDetailData?.data?.product_sizes?.length > 0 && (
//                                 <div className="mb-4">
//                                     <span className="font-bold text-gray-700">Select Plant Size:</span>
//                                     <div className="flex items-center mt-2">
//                                         {productDetailData?.data?.product_sizes?.map((size, idx) => (
//                                             <button
//                                                 key={size?.id || size?.size || idx}
//                                                 onClick={() => handleSizeClick(size, productDetailData?.data?.product)}
//                                                 className={`${
//                                                     selectedSize?.size === size?.size
//                                                         ? "border-2 border-bio-green text-gray-700"
//                                                         : "border-2 border-gray-300 text-gray-700"
//                                                 } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
//                                             >
//                                                 {size?.size}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//
//                             {productDetailData?.data?.product_planter_sizes?.length > 0 && (
//                                 <div className="mb-4">
//                                     <span className="font-bold text-gray-700">Select Planter Size:</span>
//                                     <div className="flex items-center mt-2">
//                                         {productDetailData?.data?.product_planter_sizes?.map((size, idx) => (
//                                             <button
//                                                 key={size?.id || size?.size || idx}
//                                                 onClick={() => handlePlanterSizeClick(size, productDetailData?.data?.product)}
//                                                 className={`${
//                                                     selectedPlanterSize?.size === size?.size
//                                                         ? "border-2 border-bio-green text-gray-700"
//                                                         : "border-2 border-gray-300 text-gray-700"
//                                                 } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
//                                             >
//                                                 {size?.size}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//
//                             {productDetailData?.data?.product_planters?.length > 0 && (
//                                 <div className="mb-4">
//                                     <span className="font-bold text-gray-700">Select Planter:</span>
//                                     <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3">
//                                         {productDetailData?.data?.product_planters?.map((planter, idx) => (
//                                             <button
//                                                 key={planter?.id || planter?.name || idx}
//                                                 onClick={() => handlePlanterClick(planter, productDetailData?.data?.product)}
//                                                 className={`${
//                                                     selectedPlanter?.id === planter?.id
//                                                         ? "border-2 border-bio-green text-gray-700"
//                                                         : "border-2 border-gray-300 text-gray-700"
//                                                 } py-2 px-4 rounded-lg text-sm mr-2 focus:outline-none`}
//                                             >
//                                                 {planter?.name}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//
//
//                             {productDetailData?.data?.product_colors?.length > 0 && (
//                                 <div className="mb-4">
//                                     <span className="font-bold text-gray-700">Color:</span>
//                                     <div className="flex items-center mt-2 space-x-4">
//                                         {productDetailData?.data?.product_colors?.map((color, idx) => (
//                                             <div key={color?.id || color?.color_code || idx}
//                                                  className="flex flex-col items-center">
//                                                 <button
//                                                     onClick={() =>
//                                                         handlePlanterColorClick(color, productDetailData?.data?.product)
//                                                     }
//                                                     className={`w-10 h-10 rounded-full mb-1 focus:outline-none ${
//                                                         selectedColor?.id === color?.id
//                                                             ? "border-2 border-bio-green text-gray-700"
//                                                             : "border-2 border-gray-300 text-gray-700"
//                                                     }`}
//                                                     style={{backgroundColor: color?.color_code}}
//                                                     aria-label={`Select ${color?.name || "color"}`}
//                                                 />
//                                                 {/* ✅ Show color name */}
//                                                 <span className="text-xs text-gray-600">{color?.color_name}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//
//                             <div className="mb-4">
//                                 <span className=" font-bold text-black-700">Quantity:</span>
//                                 <div className="flex items-center mt-4">
//                                     <button
//                                         // onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         onClick={() => handleQuantity(productDetailData?.data?.product?.id, "decrement", quantity)}
//
//                                         className="border border-bio-green text-black-700 py-2 px-4 rounded-l-lg hover:bg-bio-green"
//                                     >
//                                         -
//                                     </button>
//
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         className="w-20 text-center border border-bio-green bg-gray-200 text-black py-2 px-4
//                                          [-moz-appearance:textfield]
//                                          [appearance:textfield]
//                                          [&::-webkit-inner-spin-button]:appearance-none
//                                          [&::-webkit-outer-spin-button]:appearance-none"
//                                         value={quantity}
//                                         onChange={(e) => setQuantity(Number(e.target.value))}
//                                         onBlur={() =>
//                                             handleQuantity(
//                                                 productDetailData?.data?.product?.id,
//                                                 "direct",
//                                                 quantity
//                                             )
//                                         }
//                                     />
//                                     <button
//
//                                         onClick={() => handleQuantity(productDetailData?.data?.product?.id, "increment", quantity)}
//
//
//                                         className="border border-bio-green text-black-700 py-2 px-4 rounded-r-lg hover:bg-bio-green"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex mb-8 space-x-2">
//                                 <div className="w-1/2">
//                                     <button
//                                         className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
//                                         onClick={isInCart ? () => router.push('/cart') : handleAddToCartSubmit}
//                                     >
//                                         <ShoppingCart className="inline-block mr-2"/>
//                                         {isInCart ? "Go to Cart" : "Add to Cart"}
//                                     </button>
//
//                                 </div>
//
//                                 <div className="w-1/2">
//                                     <button
//                                         className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
//                                         onClick={!productDetailData?.data?.product?.is_wishlist ? handleAddToWishlistSubmit : null}
//                                     >
//                                         <Heart className="inline-block mr-2"/>
//                                         Add to Wishlist
//                                     </button>
//                                 </div>
//                             </div>
//
//                             <button
//                                 className="bg-bio-green text-white py-2 px-4 rounded-lg w-full hover:bg-bio-green"
//                                 onClick={handleBuyItNowSubmit}
//                             >
//                                 Buy It Now
//                             </button>
//
//                         </div>
//
//                     </div>
//                     <AddOnProduct addOnData={addOnData}/>
//                 </div>
//                 <div className="py-4 md:pr-32">
//                     <div className="mt-2 flex w-full justify-center md:justify-end">
//                         <input
//                             type="text"
//                             placeholder="Enter Pin Code"
//                             value={pincode}
//                             onChange={handlePincodeChange}
//                             className="px-4 py-2 border border-gray-300 rounded-l outline-none"
//                         />
//                         <button
//                             className="px-8 py-2 bg-bio-green text-white rounded-r hover:bg-green-700"
//                             onClick={handleCheck}
//                         >
//                             Check
//                         </button>
//                     </div>
//                     {error && <p className="text-red-500 text-sm mt-1 text-center md:text-right">{error}</p>}
//                 </div>
//                 <br/>
//                 <div className="bg-white p-4">
//                     <AboutTheProducts productDetailData={productDetailData}/>
//
//                 </div>
//
//                  <ProductFeatured/>
//                 <ProductSeller/>
//
//
//                 <FaqAccordion/>
//                 {productDetailData?.data?.product_rating && (
//                     <ProductReviews
//                         product_Rating={productDetailData?.data?.product_rating}
//                         total_Rating={productDetailData?.data?.product_reviews}
//                         productId={id}
//                     />
//                 )}
//             </div>
//             <HomepageSchema/>
//             <StoreSchema/>
//         </>
//     );
// }