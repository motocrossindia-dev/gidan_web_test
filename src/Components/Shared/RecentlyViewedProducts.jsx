import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingCard from "../TrendingProducts/TrendingCard";
import axiosInstance from '../../Axios/axiosInstance';

/**
 * Reusable Recently Viewed Products Component
 * Displays a grid of recently viewed products with clean URL navigation
 */
const RecentlyViewedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/recentlyViewed/`);
      setProducts(response?.data?.data?.products || []);
    } catch (error) {setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleProductClick = (product) => {
    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    // Clean URL structure
    const productUrl = sub_category_slug 
      ? `/${category_slug}/${sub_category_slug}/${product.slug}/`
      : `/${category_slug}/${product.slug}/`;

    navigate(productUrl, {
      state: {
        product_id: product.slug,
        category_slug: category_slug,
        sub_category_slug: sub_category_slug
      }
    });
  };

  if (products.length === 0) {
    return null; // Don't render if no products
  }

  return (
      <div className="w-full py-8 relative z-10 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="md:text-2xl text-xl mb-6 text-center md:font-bold font-semibold">
            Recently Viewed
          </h2>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center">
              {products.map((product) => (
                  <div 
                    key={product?.id} 
                    onClick={() => handleProductClick(product)} 
                    className="cursor-pointer"
                  >
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
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default RecentlyViewedProducts;
