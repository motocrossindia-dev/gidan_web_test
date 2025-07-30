import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/Slice/cartSlice";
import { addtowishlist } from "../../../redux/Slice/addtowishlistSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {
  
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductSeller from "./ProductSeller";
import ProductReviews from "./ProductReviews";
import FaqAccordion from "./ProductFaq";
import ProductFeatured from "./ProductFeatured";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AddOnProduct from "./AddOnProduct";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { isMobile } from "react-device-detect";
import AboutTheProducts from "../ProductData/AboutTheProducts";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Verify from "../../../Services/Services/Verify";
import axiosInstance from "../../../Axios/axiosInstance";
import {Helmet} from "react-helmet";

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

export default function Component() {
  const location=useLocation();
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedgram, setSelectedGram] = useState("");
  const [selectedPlanterSize, setSelectedPlanterSize] = useState("");
  const [selectedPlanter, setSelectedPlanter] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addOnData, setAddOnData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist,setInWishlist] =useState(null)
  const [productDetailData, setProductDetailData] = useState([]);
  const [imageThumbnails, setImageThumbnails] = useState([]);
  const { id } = useParams(); // Retrieve the ID from the URL
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  // ==========auth cart
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
const isAuthenticatedMobile = !!localStorage.getItem('userData');

  const token = localStorage.getItem("token")
  const accessToken = useSelector(selectAccessToken);
  const isInCart = productDetailData?.data?.product?.is_cart;


  // ⬆️ Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: -10, left: 0, behavior: 'auto' }); // change to 'smooth' if needed
  }, [location.pathname]);

  const handlePincodeChange = (e) => {
    const value = e.target.value;

    // Allow only digits and max 6 chars
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
      setError(""); // Clear error if any
    }
  };

  const handleCheck =async () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    try {

      const response = await axiosInstance.post(`/tracking/check-pincode/`,{
        pincode:pincode
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
    
    // Call your API or logic here

    // example: checkPincodeAvailability(pincode)
  };



  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCartSubmit = async () => {
    if (isAuthenticated || isAuthenticatedMobile) {
      const product_data = {
        prod_id: productDetailData?.data?.product?.id,
        quantity: quantity,
      };
  
      try {
        if (accessToken) {
                  const response = await axiosInstance.post(`/order/cart/`,product_data);
        if (response.status === 201) {
        dispatch(addToCart(product_data));
        enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));

        }
        }else if (token) {
        const response = await axiosInstance.post(`/order/cart/`,
          product_data,);
        if (response.status=== 201) {
        dispatch(addToCart(product_data));
        enqueueSnackbar("Product added to cart successfully!", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));

        }
        }

      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || "Failed to add product to cart", { variant: "info" });
      }
    } else {
      enqueueSnackbar("Please sign..", { variant: "info" });
  
      if (isMobile) {
        navigate("/mobile-signin", { replace: true });
      } else {
        navigate("/?modal=signIn", { replace: true });
      }
    }
  };
  

  const handleAddToWishlistSubmit = async () => {
    if (isAuthenticated|| isAuthenticatedMobile) {
      const product_id = productDetailData?.data?.product?.id;

      try {
        // Send only the product_id to the API
        const response = await axiosInstance.post(`/order/wishlist/`,
          { prod_id: product_id });
        if (response?.status === 200) {
          setInWishlist(response?.data?.data?.in_wishlist)
            dispatch(addtowishlist(product_id));
            window.dispatchEvent(new Event("wishlistUpdated"));

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
        navigate("/mobile-signin", { replace: true });
      } else {
        navigate("/?modal=signIn", { replace: true });
      }
    }
  };


  const handleBuyItNowSubmit = async () => {

    if (isAuthenticated|| isAuthenticatedMobile) {
 
      const product_data = {
        order_source: "product",
        prod_id: productDetailData?.data?.product?.id,
        quantity: quantity,
      };

      try {
        const response = await axiosInstance.post(`/order/placeOrder/`,product_data);


        if (response.status === 200) {
          enqueueSnackbar("Order placed successfully!", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));

          if (window.innerWidth <= 768) {
            // navigate("/order-summary", { state: { resource: response.data.data } }); // Navigate to mobile checkout
            navigate("/checkout", { state: { ordersummary: response.data.data } }); // Navigate to regular checkout

          } else {
            navigate("/checkout", { state: { ordersummary: response.data.data } }); // Navigate to regular checkout
          }
        }

      } catch (error) {
        if (error.response && error.response.status === 400) {

          enqueueSnackbar(error.response.data.message, { variant: "warning" });
          if (error.response.data.message ==="User profile is not updated.") {
            navigate('/profile')
          }
          if (error.response.data.message === "User address is not updated.") {

            navigate('/profile')
            
          }
        } else {
          enqueueSnackbar("Failed to place order. Please try again.", { variant: "error" });
        }
      }
    } else {
      // If not authenticated, redirect based on device type
      enqueueSnackbar("Please Login or Signup to Buy Our Products." ,{variant:'info'});
      if (isMobile) {
        navigate("/mobile-signin", { replace: true });
      } else {
        navigate("/?modal=signIn", { replace: true });
      }
    }
  };




  const CustomPrevArrow = ({ className, onClick }) => (
    <button className={`${className} z-10 left-0`} onClick={onClick}>
      <ChevronLeft className="w-6 h-6 text-gray-800" />
    </button>
  );

  const CustomNextArrow = ({ className, onClick }) => (
    <button className={`${className} z-10 right-0`} onClick={onClick}>
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



  const handleSizeClick = async (size, product) => {
    try {
      // Set the selected size

      setSelectedSize(size);

      // Make API call to filter products by size
      const response = await axiosInstance.get(`/product/filterProduct/${product?.id}/`,
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
      const data = response.data;
      const images = data?.data?.product?.images || [];
      setImageThumbnails(images);
      setProductDetailData(data);

      // You can update state or perform additional actions with the filtered products
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      // Handle error scenarios
    }
  };

  const handleQuantity = async (product_id, action, qty) => {

    try {

      const response = await axiosInstance.get(`/product/stockCheck/${product_id}/`,
        {
          params: {
            quantity: qty,
            action: action,

          },
        }
      );
      if (response.status === 200) {
        
        setQuantity(response?.data?.new_quantity)
      }
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message,{variant:'info'})
    }
  }
  const handleWeightClick = async (size, product) => {
    try {

      // Toggle selection properly
      setSelectedGram((prev) =>
        prev?.size_grams === size?.size_grams ? null : size
      );

      // Make API call
      const response = await axiosInstance.get(
        `/product/filterProduct/${product?.id}/`,
        {
          params: { weight_id: size.id },
        }
      );

      // Ensure data exists before updating state

      const data = response?.data;

      if (data?.data?.product?.images) {
        setImageThumbnails(data?.data?.product?.images || []);
      }

      setProductDetailData(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };


  const handlePlanterSizeClick = async (size, product) => {
    try {
      // Set the selected size
      setSelectedPlanterSize(size);

      // Make API call to filter products by size
      const response = await axiosInstance.get(
        `/product/filterProduct/${product.id}/`,
        {
          params: {
            planter_size_id: size.id,
            size_id: product.size_id,
            // planter_id: product.planter_id,
            // product_colors_id: product.color_id,
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
      const data = response.data;
      const images = data?.data?.product?.images || [];
      setImageThumbnails(images);
      setProductDetailData(data);

      // You can update state or perform additional actions with the filtered products
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      // Handle error scenarios
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
      // Make API call to filter products by size
      const response = await axiosInstance.get(
        `/product/filterProduct/${product.id}/`,
        {
          params: {
            planter_id: planter.id,
            planter_size_id: product.planter_size_id,
            size_id: product.size_id,
            // product_colors_id: product.color_id,
          },
        }
      );

      // Handle the API response
      const data = response.data;
      const images = data?.data?.product?.images || [];
      setImageThumbnails(images);
      setProductDetailData(data);

      // You can update state or perform additional actions with the filtered products
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      // Handle error scenarios
    }
  };

  // const handlePlanterColorClick = async (color, product) => {
  //   try {
  //     // Set the selected size
  //     setSelectedColor(color);
  //     // If the same color is clicked again, toggle the selection (deselect)
  //     if (selectedColor?.id === color?.id) {
  //       setSelectedColor(null); // Deselect the color
  //     } else {
  //       setSelectedColor(color); // Select the new color
  //     }
  //     // Make API call to filter products by size
  //     const response = await axiosInstance.get(
  //       `/product/filterProduct/${product.id}/`,
  //       {
  //         params: {
  //           color_id: color.id,
  //           planter_id: product.planter_id,
  //           planter_size_id: product.planter_size_id,
  //           size_id: product.size_id,
  //         },
  //       }
  //     );

  //     // Handle the API response
  //     const data = response.data;
  //     const images = data?.data?.product?.images || [];
  //     setImageThumbnails(images);
  //     setProductDetailData(data);

  //     // You can update state or perform additional actions with the filtered products
  //   } catch (error) {
  //     console.error("Error fetching filtered products:", error);
  //     // Handle error scenarios
  //   }
  // };


  const handlePlanterColorClick = async (color, product) => {
  try {
    // Check if same color is clicked (toggle deselect)
    const isSameColor = selectedColor?.id === color?.id;

    // Update the selectedColor state
    const newColor = isSameColor ? null : color;
    setSelectedColor(newColor);

    // If deselected, reset to original product
    if (isSameColor) {
      const originalResponse = await axiosInstance.get(`/product/${product.id}`);
      const originalData = originalResponse.data;
      const originalImages = originalData?.data?.product?.images || [];

      setImageThumbnails(originalImages);
      setProductDetailData(originalData);
      return;
    }

    // Make API call to filter by new color
    const response = await axiosInstance.get(
      `/product/filterProduct/${product.id}/`,
      {
        params: {
          color_id: color.id,
          planter_id: product.planter_id,
          planter_size_id: product.planter_size_id,
          size_id: product.size_id,
        },
      }
    );

    const data = response.data;
    const images = data?.data?.product?.images || [];

    setImageThumbnails(images);
    setProductDetailData(data);

  } catch (error) {
    console.error("Error fetching filtered products:", error);
  }
};

  useEffect(() => {
    if (productDetailData?.data?.product_type == 'plant') {
      const { size_id, planter_size_id, planter_id, color_id } =
        productDetailData.data.product;

      setSelectedSize(
        productDetailData?.data?.product_sizes?.find(
          (s) => s.id === size_id || s.size === size_id
        ) || ""
      );
      setSelectedPlanterSize(
        productDetailData?.data?.product_planter_sizes?.find(
          (s) =>
            s.id === planter_size_id ||
            s.size === planter_size_id.size ||
            s.name === planter_size_id.name
        ) || ""
      );
      setSelectedPlanter(
        productDetailData?.data?.product_planters?.find(
          (s) => s.id === planter_id || s.name === planter_id.name
        ) || ""
      );

      const selectedColor = productDetailData.data.product_colors.find(
        (color) => color.id === Number(color_id) // Ensure color_id is a number
      );
      setSelectedColor(selectedColor || ""); // Default to an empty string if no match is found
    }
  }, [productDetailData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/product/defaultProduct/${id}/`);


        if (response.status === 200) {
                  const data = response.data;
        const images = data?.data?.product?.images || [];
        setImageThumbnails(images);
        setProductDetailData(data);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/product/defaultProduct/${id}/`);

        const data = response.data;


        setAddOnData(data?.data?.product_add_ons || []);
        setProductDetailData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  console.log(productDetailData.data,'==============data')

  useEffect(() => {
   
  }, [imageThumbnails]);
  useEffect(() => {
    if (selectedSize && productData.planterSizes[selectedSize]) {
      const availablePlanterSizes = productData.planterSizes[selectedSize];
      setSelectedPlanterSize(availablePlanterSizes[0] || "");
    }
  }, [selectedSize]);
  useEffect(() => {
    if (
      selectedSize &&
      selectedPlanter &&
      productData.colors[selectedSize] &&
      productData.colors[selectedSize][selectedPlanter]
    ) {
      const availableColors = productData.colors[selectedSize][selectedPlanter];
      setSelectedColor(availableColors[0] || "");
    } else {
      setSelectedColor("");
    }
  }, [selectedPlanter, selectedSize]);
  useEffect(() => {
    if (selectedSize && productData.planters[selectedSize]) {
      const availablePlanters = productData.planters[selectedSize];
      const newPlanter = availablePlanters[0] || "";
      setSelectedPlanter(newPlanter);

      if (
        newPlanter &&
        productData.colors[selectedSize] &&
        productData.colors[selectedSize][newPlanter]
      ) {
        const availableColors = productData.colors[selectedSize][newPlanter];
        setSelectedColor(availableColors[0] || "");
      } else {
        setSelectedColor("");
      }
    }
  }, [selectedSize]);

 

  return (
    <>
      <Verify />


      <Helmet>
        <title>
          {productDetailData?.data?.product?.main_product_name
              ? `Biotech Maali - ${productDetailData.data.product.main_product_name}`
              : 'Biotech Maali - Loading...'}
        </title>
      </Helmet>


      <div className="w-full" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container mx-auto px-3 py-4 font-sans md:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="flex justify-center h-auto bg-gray-50">
                <div className="w-full h-full md:w-full md:h-1/2 rounded-lg bg-gray-100">
                  <img name=" "   
                    src={
                      imageThumbnails[selectedImage]?.image ||
                      productData.images[0].image
                    }
                    // src={productdata}
                    loading="lazy"
                    alt={`Product view ${selectedImage + 1}`}
                    className="w-30 h-30 object-fill"
                  />
                </div>
              </div>

              <div className="flex items-center mb-4 mt-6">
                {/* Left Navigation Button */}
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? productData.images.length - 1 : prev - 1
                    )
                  }
                  className="text-gray-500 hover:text-gray-800 focus:outline-none px-2"
                >
                  <FaChevronLeft size={24} />
                </button>

                {/* ==================== */}
                <div className="flex flex-1 overflow-x-auto">
                  {imageThumbnails.slice(1).map((image, i) => (
                    <div className="flex-1 px-2" key={i + 1}>
                      <button
                        onClick={() => setSelectedImage(i + 1)}
                        className={`focus:outline-none w-full rounded-lg h-3/4 md:h-3/4 bg-gray-100 flex items-center justify-center ${selectedImage === i + 1
                          ? "ring-2 ring-indigo-300 ring-inset"
                          : ""
                          }`}
                      >
                        <img name=" "   
                          src={image.image}
                          loading="lazy"
                          alt={`${productData.name} ${i + 2}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Right Navigation Button */}
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === productData.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="text-gray-500 hover:text-gray-800 focus:outline-none px-2"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="md:flex-1 px-4 font-sans">
              <h2 className="text-xl md:text-3xl font-bold mb-2">
                {productDetailData?.data?.product?.main_product_name || ""}
              </h2>
              <h4 className="text-md md:text-lg font-sans mb-4">
                {productDetailData?.data?.product?.short_description || ""}
              </h4>
              <p className="text-black-600 text-sm mb-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const fraction =
                    productDetailData?.data?.product_rating?.avg_rating || 0;
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
                        <FaStar className="inline-block text-gray-300" />
                      )}
                    </React.Fragment>
                  );
                })}
              </p>
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-bio-green text-lg md:text-2xl">
                    ₹{productDetailData?.data?.product?.selling_price || 0}
                    {/* ₹{productData.prices[selectedSize]} */}
                  </span>
                  <span className="text-gray-400 text-md md:text-xl line-through ml-2">
                    {/* ₹{productData.originalPrices[selectedSize]} */}₹
                    {productDetailData?.data?.product?.mrp || 0}
                  </span>
                </div>
              </div>



              {productDetailData?.data?.product_weights?.length > 0 && (
                <div className="space-y-6">
                  <div className="mb-4">
                    <span className="font-bold text-black-700">Select Packet Size:</span>
                    <div className="flex items-center mt-2">
                      {productDetailData.data.product_weights.map((size) => (
                        <button
                          key={size?.id || size?.size_grams}
                          onClick={() => handleWeightClick(size, productDetailData?.data?.product)}
                          className={`${selectedgram?.size_grams === size?.size_grams
                            ? "border-2 border-bio-green text-gray-700"
                            : "border-2 border-gray-300 text-black"
                            } py-2 px-4 rounded-lg mr-2 focus:outline-none`}
                        >
                          {size?.size_grams}g
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {productDetailData?.data?.product_sizes?.length > 0 && (
                <div className="mb-4">
                  <span className="font-bold text-black-700">Select Plant Size:</span>
                  <div className="flex items-center mt-2">
                    {productDetailData.data.product_sizes.map((size) => (
                      <button
                        key={size?.id || size?.size}
                        onClick={() => handleSizeClick(size, productDetailData?.data?.product)}
                        className={`${selectedSize?.size === size?.size
                          ? "border-2 border-bio-green text-gray-700"
                          : "border-2 border-gray-300 text-black"
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
                  <span className="font-bold text-black-700">Select Planter Size:</span>
                  <div className="flex items-center mt-2">
                    {productDetailData.data.product_planter_sizes.map((size) => (
                      <button
                        key={size?.id || size?.size}
                        onClick={() => handlePlanterSizeClick(size, productDetailData?.data?.product)}
                        className={`${selectedPlanterSize?.size === size?.size
                          ? "border-2 border-bio-green text-gray-700"
                          : "border-2 border-gray-300 text-black"
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
                  <span className="font-bold text-black-700">Select Planter:</span>
                  <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3">
                    {productDetailData.data.product_planters.map((planter) => (
                      <button
                        key={planter?.id || planter?.name}
                        onClick={() => handlePlanterClick(planter, productDetailData?.data?.product)}
                        className={`${selectedPlanter?.id === planter?.id
                          ? "border-2 border-bio-green text-gray-700"
                          : "border-2 border-gray-300 text-black"
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
                  <span className="font-bold text-black-700">Color:</span>
                  <div className="flex items-center mt-2">
                    {productDetailData.data.product_colors.map((color) => (
                      <button
                        key={color?.id || color?.color_code}
                        onClick={() => handlePlanterColorClick(color, productDetailData.data.product)}
                        className={`w-10 h-10 rounded-full mr-2 focus:outline-none ${selectedColor?.id === color?.id
                          ? "border-2 border-bio-green text-gray-700"
                          : "border-2 border-gray-300 text-black"
                          }`}
                        style={{ backgroundColor: color?.color_code }}
                        aria-label={`Select ${color?.name || "color"}`}
                      />
                    ))}
                  </div>
                </div>
              )}



              <div className="mb-4">
                <span className=" font-bold text-black-700">Quantity:</span>
                <div className="flex items-center mt-4">
                  <button
                    // onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    onClick={() => handleQuantity(productDetailData?.data?.product?.id, "decrement", quantity)}

                    className="border border-bio-green text-black-700 py-2 px-4 rounded-l-lg hover:bg-bio-green"
                  >
                    -
                  </button>
                  <span className=" border border-bio-green bg-gray-200 text-black py-2 px-4">
                    {quantity}
                  </span>
                  <button

                    onClick={() => handleQuantity(productDetailData?.data?.product?.id, "increment", quantity)}


                    className="border border-bio-green text-black-700 py-2 px-4 rounded-r-lg hover:bg-bio-green"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex mb-8 space-x-2">
                <div className="w-1/2">
                  <button
                      className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
                      onClick={isInCart ? () => navigate('/cart') : handleAddToCartSubmit}
                  >
                    <ShoppingCart className="inline-block mr-2" />
                    {isInCart ? "Go to Cart" : "Add to Cart"}
                  </button>

                </div>

                <div className="w-1/2">
                <button
  className="w-full border border-bio-green text-bio-green py-2 px-4 rounded-lg hover:bg-bio-green hover:text-white"
  onClick={!productDetailData?.data?.product?.is_wishlist ?  handleAddToWishlistSubmit :null}
>
  <Heart className="inline-block mr-2" />
  {/* {inWishlist ? ( */}
    {/* // <Link to="/wishlist">Go to Wishlist</Link> */}
  {/* // ) : ( */}
    Add to Wishlist
  {/* // )} */}
</button>
                </div>
              </div>

              <button
                className="bg-bio-green text-white py-2 px-4 rounded-lg w-full hover:bg-bio-green"
                onClick={handleBuyItNowSubmit}
              >
                Buy It Now
              </button>

              {/* pincode */}
            </div>

          </div>
          {/* <AddOnProduct productData={productData} /> */}
          <AddOnProduct addOnData={addOnData} />


        </div>
        <div className="py-4 md:pr-32">
      <div className="mt-2 flex w-full justify-center md:justify-end">
        <input
          type="text"
          placeholder="Enter Pin Code"
          value={pincode}
          onChange={handlePincodeChange}
          className="px-4 py-2 border border-gray-300 rounded-l outline-none"
        />
        <button
          className="px-8 py-2 bg-bio-green text-white rounded-r hover:bg-green-700"
          onClick={handleCheck}
        >
          Check
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 text-center md:text-right">{error}</p>}
    </div>
        <br />
        <div className="bg-white p-4">
          <AboutTheProducts productDetailData={productDetailData} />

        </div>

        <ProductFeatured />
        <ProductSeller />
        <FaqAccordion />
        {productDetailData?.data?.product_rating && (
          <ProductReviews
            product_Rating={productDetailData?.data?.product_rating}
            total_Rating={productDetailData?.data?.product_reviews}
            productId={id}
          />
        )}
      </div>
    </>
  );
}
