'use client';




import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import TrendingCard from "../../../components/TrendingProducts/TrendingCard";
import { getProductUrl } from "../../../utils/urlHelper";
import Link from "next/link";

const RecentlyViewedProduct = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/recentlyViewed/${`?${searchParams.toString()}`}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProducts(response?.data?.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, [`?${searchParams.toString()}`]);

  const handleProductClick = (product) => {
    router.push(getProductUrl(product));
  };


  return (
    <div className="w-full ">
      <div className="my-8 p-4 bg-grey-200 rounded-md">
        <h2 className="md:text-2xl text-xl font-semibold text-center mb-4">
          Recently Viewed
        </h2>

        <div className="max-w-7xl mx-auto px-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product?.id} href={getProductUrl(product)} className="block w-full">
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
                </Link>
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