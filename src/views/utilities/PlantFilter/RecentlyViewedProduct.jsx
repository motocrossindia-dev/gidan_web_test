import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingCard from "../../../Components/TrendingProducts/TrendingCard"
import axiosInstance from '../../../Axios/axiosInstance';

const RecentlyViewedProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/recentlyViewed/`);
      setProducts(response?.data?.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate("/productdata/" + productId);
  };

  return (
      <div className="w-full py-8 relative z-10 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="md:text-2xl text-xl mb-6 text-center md:font-bold font-semibold">
            Recently Viewed
          </h2>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center">
              {products.length > 0 ? (
                  products.map((product) => (
                      <div key={product?.id} onClick={() => handleProductClick(product?.id)} className="cursor-pointer">
                        <TrendingCard
                            product={product}
                            name={product?.name}
                            price={Math.round(product?.selling_price)}
                            imageUrl={product?.image || "/fallback-image.jpg"}
                            userRating={product?.product_rating?.avg_rating || 0}
                            ratingNumber={product?.product_rating?.num_ratings}
                            inCart={product?.is_cart}
                            inWishlist={product?.is_wishlist}
                            getProducts={getProducts}
                            mrp={Math.round(product?.mrp)}
                        />
                      </div>
                  ))
              ) : (
                  <p className="text-center col-span-4">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default RecentlyViewedProduct;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import TrendingCard from "../../../Components/TrendingProducts/TrendingCard"
// import axiosInstance from '../../../Axios/axiosInstance';
//
// const RecentlyViewedProduct = () => {
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//
//   const getProducts = async () => {
//     try {
//       const response = await axiosInstance.get(`/product/recentlyViewed/`);
//       setProducts(response?.data?.data?.products || []);
//     } catch (error) {
//       console.error("Error fetching products:", error.response?.data || error.message);
//       setProducts([]);
//     }
//   };
//
//   useEffect(() => {
//     getProducts();
//   }, []);
//
//   const handleProductClick = (productId) => {
//     navigate("/productdata/" + productId);
//   };
//
//   return (
//       <div className="w-full  py-8 relative z-10">
//         <div className="container mx-auto px-4">
//           <h2 className="md:text-2xl text-xl mb-6 text-center md:font-bold font-semibold">
//             Recently Viewed
//           </h2>
//
//           <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center">
//               {products.length > 0 ? (
//                   products.map((product) => (
//                       <div key={product?.id} onClick={() => handleProductClick(product?.id)} className="cursor-pointer">
//                         <TrendingCard
//                             product={product}
//                             name={product?.name}
//                             price={Math.round(product?.selling_price)}
//                             imageUrl={product?.image || "/fallback-image.jpg"}
//                             userRating={product?.product_rating?.avg_rating || 0}
//                             ratingNumber={product?.product_rating?.num_ratings}
//                             inCart={product?.is_cart}
//                             inWishlist={product?.is_wishlist}
//                             getProducts={getProducts}
//                             mrp={Math.round(product?.mrp)}
//                         />
//                       </div>
//                   ))
//               ) : (
//                   <p className="text-center col-span-4">No products found.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// };
//
// export default RecentlyViewedProduct;
// //
// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import TrendingCard from "../../../Components/TrendingProducts/TrendingCard"
// // import axiosInstance from '../../../Axios/axiosInstance';
// //
// // const RecentlyViewedProduct = () => {
// //   const [products, setProducts] = useState([]);
// //   const navigate = useNavigate();
// //
// //
// //   const getProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get(`/product/recentlyViewed/`);
// //
// //
// //       // Update state with the correct path to products array
// //       setProducts(response?.data?.data?.products || []);
// //     } catch (error) {
// //       console.error("Error fetching products:", error.response?.data || error.message);
// //       setProducts([]); // Fallback to an empty array in case of error
// //     }
// //   };
// //
// //   useEffect(() => {
// //
// //       getProducts();
// //
// //   }, []); // Re-run if `accessToken` changes
// //
// //   const handleProductClick = (productId) => {
// //     navigate("/productdata/" + productId);
// //   };
// //
// //   return (
// //     <div className="w-full">
// //       <div className="my-8 p-4 bg-gray-200 rounded-md">
// //         <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">
// //           Recently Viewed
// //         </h2>
// //
// //         <div className="max-w-7xl mx-auto px-3">
// //           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
// //             {products.length > 0 ? (
// //               products.map((product) => (
// //                 <div key={product?.id} onClick={() => handleProductClick(product?.id)}>
// //                   <TrendingCard
// //                     product={product}
// //                     name={product?.name}
// //                     price={Math.round(product?.selling_price)}
// //                     imageUrl={product?.image || "/fallback-image.jpg"} // Use a default image
// //                     userRating={product?.product_rating?.avg_rating || 0}
// //                     ratingNumber={product?.product_rating?.num_ratings}
// //                     inCart={product?.is_cart}
// //                     inWishlist={product?.is_wishlist}
// //                     getProducts={getProducts}
// //                     mrp={Math.round(product?.mrp)}
// //                   />
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-center col-span-4">No products found.</p>
// //             )}
// //           </div>
// //         </div>
// //
// //
// //       </div>
// //     </div>
// //   );
// // };
// //
// // export default RecentlyViewedProduct;
