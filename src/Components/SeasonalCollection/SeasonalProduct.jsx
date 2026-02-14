import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SeasonalCard from '../SeasonalCollection/SeasonalCard';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { Link } from "react-router-dom";
import axiosInstance from '../../Axios/axiosInstance';
import convertToSlug from "../../utils/slugConverter";

const SeasonalProduct = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // Default to 8 for desktop
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);

  // Fetch Products
  const getProducts = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/product/homeProducts/`;
      const config = accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : {};

      const response = await axiosInstance.get(url, config);
      if (response.status === 200) {
        const filteredProducts = response.data.data.products.filter(
            (product) => product.is_seasonal_collection === true
        );
        setProducts(filteredProducts);
      }
    } catch (error) {setProducts([]); // Fallback to an empty array
    }
  }, [accessToken]);

  useEffect(() => {
    getProducts();
  }, [getProducts]); // ✅ Only runs on first mount

  // // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth <= 768 ? 4 : 8);
    };

    updateVisibleCount(); // Initial check
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const ViewAll = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
          `/product/viewAll`);
    } catch (error) {}
  }, []);

  const handleProductClick = useCallback((product) => {

    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    navigate(`/category/${category_slug}/${product.slug}/`, {       state: {
        product_id: product.slug,
        category_slug:category_slug,
        sub_category_slug:sub_category_slug

      } });


  }, [navigate]);

  // Memoize visible products slice
  const visibleProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  return (
      <div className="w-full bg-gray-100">
        <div className="my-8 p-4 bg-grey-200 rounded-md">

          <h2 className="md:text-2xl text-xl mb-4 text-left md:font-bold font-semibold">Seasonal Collections</h2>


          <div className="max-w-7xl mx-auto px-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center margin-bottom: -33px;">
              {visibleProducts.map((product) => (
                  <div key={product?.id} onClick={() => handleProductClick(product)}>
                    <SeasonalCard
                        product={product?.id}
                        name={product?.name}
                        price={Math.round(product?.selling_price)}
                        imageUrl={product?.image || "/fallback-image.jpg"} // Use default image
                        userRating={product?.product_rating?.avg_rating || 0}
                        ratingNumber={product?.product_rating?.num_ratings}
                        inCart={product?.is_cart}
                        inWishlist={product?.is_wishlist}
                        getProducts={getProducts}
                        mrp={Math.round(product.mrp)}
                        ribbon={product.ribbon}
                    />
                  </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button aria-label="Previous" className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
              <span className="text-bio-green"><FaAngleLeft /></span>
            </button>
            <button aria-label="View all"
                    onClick={ViewAll}
                    className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1"
            >
              <Link to='/feature'>View All</Link>
            </button>
            <button aria-label="Next" className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
              <span className="text-bio-green"><FaAngleRight /></span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default SeasonalProduct;

// ==============old===============
// import React, { useEffect, useState } from 'react';
// import SeasonalCard from '../SeasonalCollection/SeasonalCard';
// import { useNavigate } from 'react-router-dom';
// import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
// import { useSelector } from "react-redux";
// import { selectAccessToken } from "../../redux/User/verificationSlice";
// import { Link } from "react-router-dom";
// import axiosInstance from '../../Axios/axiosInstance';
// import convertToSlug from "../../utils/slugConverter";
//
// const SeasonalProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(8); // Default to 8 for desktop
//   const navigate = useNavigate();
//   const accessToken = useSelector(selectAccessToken);
//
//   // Fetch Products
//   const getProducts = async () => {
//     try {
//       const url = `${process.env.REACT_APP_API_URL}/product/homeProducts/`;
//       const config = accessToken
//         ? { headers: { Authorization: `Bearer ${accessToken}` } }
//         : {};
//
//       const response = await axiosInstance.get(url, config);
//       if (response.status === 200) {
//         const filteredProducts = response.data.data.products.filter(
//           (product) => product.is_seasonal_collection === true
//         );
//         setProducts(filteredProducts);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setProducts([]); // Fallback to an empty array
//     }
//   };
//   useEffect(() => {
//     getProducts();
//   }, []); // ✅ Only runs on first mount
//
//   // // Update visible count based on screen size
//   useEffect(() => {
//     const updateVisibleCount = () => {
//       setVisibleCount(window.innerWidth <= 768 ? 4 : 8);
//     };
//
//     updateVisibleCount(); // Initial check
//     window.addEventListener("resize", updateVisibleCount);
//
//     return () => {
//       window.removeEventListener("resize", updateVisibleCount);
//     };
//   }, []);
//
//   const ViewAll = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/product/viewAll`);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };
//   const handleProductClick = (product) => {
//
//     const category_slug = product?.category_slug;
//     const sub_category_slug = product?.sub_category_slug;
//
//     navigate(`/category/${category_slug}/${product.slug}/`, {       state: {
//         product_id: product.slug,
//         category_slug:category_slug,
//         sub_category_slug:sub_category_slug
//
//       } });
//
//
//   };
//
//   return (
//     <div className="w-full bg-gray-100">
//       <div className="my-8 p-4 bg-grey-200 rounded-md">
//
//         <h2 className="md:text-2xl text-xl mb-4 text-left md:font-bold font-semibold">Seasonal Collections</h2>
//
//
//         <div className="max-w-7xl mx-auto px-3">
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center margin-bottom: -33px;">
//             {products.slice(0, visibleCount).map((product) => (
//               <div key={product?.id} onClick={() => handleProductClick(product)}>
//                 <SeasonalCard
//                   product={product?.id}
//                   name={product?.name}
//                   price={Math.round(product?.selling_price)}
//                   imageUrl={product?.image || "/fallback-image.jpg"} // Use default image
//                   userRating={product?.product_rating?.avg_rating || 0}
//                   ratingNumber={product?.product_rating?.num_ratings}
//                   inCart={product?.is_cart}
//                   inWishlist={product?.is_wishlist}
//                   getProducts={getProducts}
//                   mrp={Math.round(product.mrp)}
//                   ribbon={product.ribbon}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//
//         <div className="flex justify-center mt-4">
//           <button className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
//             <span className="text-bio-green"><FaAngleLeft /></span>
//           </button>
//           <button
//             onClick={ViewAll}
//             className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1"
//           >
//             <Link to='/feature'>View All</Link>
//           </button>
//           <button className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
//             <span className="text-bio-green"><FaAngleRight /></span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default SeasonalProduct;
