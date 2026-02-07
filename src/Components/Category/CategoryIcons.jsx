import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../Axios/axiosInstance";

const CategoryIcons = () => {
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  // Map categories to type_choices - only for categories that need keys
  const categoryToTypeMap = {
    'PLANTS': 'plant',
    'POTS': 'pot',
    'SEEDS': 'seed',
    'PLANT CARE': 'plantcare'
  };

  const publishedCategoryData = categoryData.filter(
      (category) => category?.is_published === true
  );

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get(`/category/`);
      const categories = response?.data?.data?.categories;
      if (categories?.length > 0) {
        const updatedCategories = await Promise.all(
            categories.map(async (category) => {
              if (category?.id) {
                const subCategory = await getSubCategory(category?.slug);
                // Add the type_choice key only for specific categories
                const typeKey = categoryToTypeMap[category.name] || '';
                return { ...category, subCategory, typeKey };
              }
              return category;
            })
        );
        setCategoryData(updatedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getSubCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.get(
          `/category/categoryWiseSubCategory/${categoryId}/`
      );
      if (response.status === 200) {
        // Return the subcategories array directly
        return response?.data?.data?.subCategorys || [];
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategorywiseProduct = async (id, categoryname,slug, typeKey) => {

    if (categoryname === "GIFTS") {
      navigate(`/gifts/`);
    } else if (categoryname === "SERVICES") {
      navigate(`/services/`);
    } else if (categoryname === "OFFERS") {
      navigate(`/offer`);
    } else {
      // For categories with typeKey (plants, pots, seeds, plantcare), include it in the URL
      if (typeKey) {
        navigate(`/category/${slug}/`, {
          state: {
            categoryId: id,
            categoryName: categoryname,
            typeKey: typeKey,
            category_slug:slug
          }
        });
      } else {
        // For other categories (if any), navigate without typeKey
        navigate(`/category/${slug}/`, {
          state: {
            categoryId: id,
            categoryName: categoryname,
            category_slug:slug
          }
        });
      }
    }
  };

  return (
      <>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5">
         <div
  className={`flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 sm:py-2 w-full
    ${isMobile
      ? "overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide justify-start"
      : "flex-wrap justify-between"
    } h-[115px] sm:h-auto`}
>

            {publishedCategoryData.map((category, idx) => (
                <div
                    key={idx}
                    className="relative shrink-0 flex flex-col items-center mb-2 min-w-0 text-center group"
                >
                  <div className="flex flex-col items-center">
                    <div
                        className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 border-2 border-gray-400 hover:border-gray-500 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                        onClick={() => getCategorywiseProduct(
                            category.id,
                            category.name,
                            category.slug,
                            category.typeKey || categoryToTypeMap[category.name] || ''
                        )}
                    >
                      <img
                          src={`${process.env.REACT_APP_API_URL}${category.image}`}
                          alt={category.name || "Category"}
                          className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <h2 className="mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-[70px] xs:max-w-[80px] sm:max-w-[90px] md:max-w-[100px] lg:max-w-[110px] leading-tight">
                      {category.name}
                    </h2>
                  </div>
                  <div className="absolute top-full left-0 mt-2 w-[180px] sm:w-[200px] md:w-[220px] bg-white border border-gray-200 shadow-lg rounded-lg z-[999] origin-top-left opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 sm:p-4">
                      <h3 className="text-bio-green font-bold mb-2 text-sm sm:text-base">
                        {category.name}
                      </h3>
                      {category.subCategory && category.subCategory.length > 0 ? (
                          <ul className="text-gray-700 space-y-1">
                            {category.subCategory.map((item, index) => {
                              // Get the typeKey for this subcategory from its parent
                              const typeKey = category.typeKey || categoryToTypeMap[category.name] || '';

                              const subcategoryUrl = `/category/subcategory/${item?.slug}/`;
                              return (
                                  <li
                                      key={index}
                                      className="hover:text-green-600 cursor-pointer transition-colors duration-200"
                                  >
                                    <Link
                                        to={subcategoryUrl}
                                        // Pass the complete subcategory object in state
                                        state={{
                                          categoryName: category.name,
                                          subcategoryID: item.id,
                                          subCategory: item, // Complete subcategory object
                                          typeKey: typeKey,
                                          categoryId: category.id,
                                          subcategory_slug:item.slug
                                        }}
                                        className="block py-1 px-2 rounded hover:bg-gray-50 text-xs sm:text-sm"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                              );
                            })}
                          </ul>
                      ) : (
                          <p className="text-gray-500 text-xs sm:text-sm">
                            No subcategories available
                          </p>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>
          {/* Custom Scrollbar CSS */}
          <style jsx>{`
      .category-container {
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-wrap: nowrap;
        gap: 12px;
        padding: 8px 4px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        justify-content: flex-start;
      }
      .category-container::-webkit-scrollbar {
        display: none;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
        </div>
      </>
  );
};

export default CategoryIcons;
