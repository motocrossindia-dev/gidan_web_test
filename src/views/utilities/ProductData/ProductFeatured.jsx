import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NormalProductGrid from '../../../Components/Shared/NormalProductGrid';

const ProductFeatured = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/product/homeProducts/`)
      .then(response => {
        if (response.data.message === 'success') {
          const filteredProducts = response.data.data.products.filter(product => product.is_featured === true);
          const limitedProducts = filteredProducts.slice(0, 4); // Limit to 4 products
          setProducts(limitedProducts);
          setPagination({
            count: limitedProducts.length || 0,
            next: null,
            previous: null
          });
        }
      })
      .catch(error => {
        console.error("There was an error fetching the products:", error);
        setProducts([]);
        setPagination({});
      });
  }, []);

  return (
    <div className="my-8 p-4 bg-white rounded-md">
      <h2 className="md:text-2xl text-xl mb-4 text-left font-sans">Featured Products</h2>
      
      <NormalProductGrid
        productDetails={products}
        pagination={pagination}
        setResults={setProducts}
      />
    </div>
  );
};

export default ProductFeatured;

// ==============old code with manual grid===============
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Paper, Typography } from "@mui/material";
// import { FaStar } from "react-icons/fa";
// import ReactStars from "react-rating-stars-component";
// import { FaRegHeart } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { FiEye } from "react-icons/fi";
// import TrendingCard from '../../../Components/Shared/ProductCard';
//
// const ProductFeatured = () => {
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_API_URL}/product/homeProducts/`)
//       .then(response => {
//         if (response.data.message === 'success') {
//           const filteredProducts = response.data.data.products.filter(product => product.is_featured === true);
//           setProducts(filteredProducts.slice(0, 4));
//         } else {
//           console.error("API response message is not 'success'");
//         }
//       })
//       .catch(error => {
//         console.error("There was an error fetching the products:", error);
//       });
//   }, []);
//
//   const handleProductClick = (product) => {
//       const category_slug = product?.category_slug;
//       const sub_category_slug = product?.sub_category_slug;
//
//       navigate(`/category/${category_slug}/${product.slug}/`, {
//         state: {
//           product_id: product.id,
//           category_slug:category_slug,
//           sub_category_slug:sub_category_slug
//         }
//       });
//   };
//
//   return (
//     <div className="my-8 p-4 bg-white rounded-md">
//       <h2 className="md:text-2xl text-xl mb-4 text-left font-sans">Featured Products</h2>
//       <div className="max-w-7xl mx-auto px-3">
//         <div className="grid gap-4 justify-items-center font-sans grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
//           {products.map((product, index) => (
//             <div key={index} onClick={() => handleProductClick(product)} className="cursor-pointer">
//               {/* Mobile and Desktop views with manual card implementation */}
//               <TrendingCard
//                 name={product.name}
//                 price={Math.round(product.selling_price)}
//                 mrp={Math.round(product.mrp)}
//                 imageUrl={product.image}
//                 rating={product.rating || 0}
//                 product={product}
//                 inCart={product.inCart}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ProductFeatured;
