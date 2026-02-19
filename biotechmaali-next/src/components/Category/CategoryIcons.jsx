'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { useState, useEffect, useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";

const CategoryIcons = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  // Use TanStack Query hook for categories
  const { data: categoryData = [], isLoading } = useCategories();

  // Map categories to type_choices
  const categoryToTypeMap = {
    'PLANTS': 'plant',
    'POTS': 'pot',
    'SEEDS': 'seed',
    'PLANT CARE': 'plantcare'
  };

  const publishedCategoryData = useMemo(() => {
    return categoryData.filter((category) => category?.is_published === true);
  }, [categoryData]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (openDropdown !== null && !event.target.closest('.category-item')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  const getCategorywiseProduct = (id, categoryname, slug, typeKey) => {
    // Always navigate directly on mobile (no dropdown toggle)
    if (categoryname === "GIFTS") {
      router.push(`/gifts/`);
    } else if (categoryname === "SERVICES") {
      router.push(`/services/`);
    } else if (categoryname === "OFFERS") {
      router.push(`/offer/`);
    } else {
      router.push(`/${slug}/`, {
        state: {
          categoryId: id,
          categoryName: categoryname,
          category_slug: slug,
          typeKey: typeKey || ''
        }
      });
    }
  };

  // Desktop Hover Handlers
  const handleCategoryHover = (categoryId, hasSubcategories) => {
    if (window.innerWidth >= 768 && hasSubcategories) {
      setOpenDropdown(categoryId);
    }
  };

  const handleCategoryLeave = () => {
    if (window.innerWidth >= 768) {
      setOpenDropdown(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 w-full pb-2">
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5 relative z-10">
        {/* Category Container */}
        <div
          id="category-scroll-container"
          className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 w-full overflow-x-auto scrollbar-hide md:flex-wrap md:justify-between md:overflow-visible pb-2"
        >
          {publishedCategoryData.map((category, idx) => (
            <div
              key={idx}
              className="relative shrink-0 flex flex-col items-center mb-2 min-w-0 text-center category-item"
              onMouseEnter={() => handleCategoryHover(
                category.id,
                category.subCategory && category.subCategory.length > 0
              )}
              onMouseLeave={handleCategoryLeave}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 border-2 border-gray-400 hover:border-gray-500 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    getCategorywiseProduct(
                      category.id,
                      category.name,
                      category.slug,
                      category.typeKey || categoryToTypeMap[category.name] || ''
                    );
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                    alt={category.name || "Category"}
                    className="w-full h-full object-contain rounded-full"
                    loading="lazy"
                    width="200"
                    height="200"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
                <h2 className="mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-[70px] xs:max-w-[80px] sm:max-w-[90px] md:max-w-[100px] lg:max-w-[110px] leading-tight">
                  {category.name}
                </h2>
              </div>

              {/* Dropdown - Desktop only, smart positioning to prevent overflow */}
              <div
                className={`hidden md:block absolute top-full pt-2 w-[220px] z-[9999] transition-all duration-200 
                  ${openDropdown === category.id ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                  ${idx >= publishedCategoryData.length - 2 ? 'right-0' : 'left-0'}`}
                onMouseEnter={() => setOpenDropdown(category.id)}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-3 sm:p-4">
                  <h3 className="text-bio-green font-bold mb-2 text-sm sm:text-base">
                    {category.name}
                  </h3>
                  {category.subCategory && category.subCategory.length > 0 ? (
                    <ul className="text-gray-700 space-y-1">
                      {category.subCategory.map((item, index) => {
                        const subcategoryUrl = `/${category.slug}/${item.slug}/`;
                        return (
                          <li
                            key={index}
                            className="hover:text-green-600 cursor-pointer transition-colors duration-200"
                          >
                            <Link
                              href={subcategoryUrl}
                              className="block py-1 px-2 rounded hover:bg-gray-50 text-xs sm:text-sm"
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-xs sm:text-sm whitespace-normal">
                      More subcategories will be added soon
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Scrollbar CSS */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default CategoryIcons;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import { useState, useEffect } from "react";
// // import axiosInstance from "../../Axios/axiosInstance";
//
// const CategoryIcons = () => {
//   const [categoryData, setCategoryData] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const router = useRouter();
//
//   // Map categories to type_choices
//   const categoryToTypeMap = {
//     'PLANTS': 'plant',
//     'POTS': 'pot',
//     'SEEDS': 'seed',
//     'PLANT CARE': 'plantcare'
//   };
//
//   const publishedCategoryData = categoryData.filter(
//     (category) => category?.is_published === true
//   );
//
//   const getCategory = async () => {
//     try {
//       const response = await axiosInstance.get(`/category/`);
//       const categories = response?.data?.data?.categories;
//       if (categories?.length > 0) {
//         const updatedCategories = await Promise.all(
//           categories.map(async (category) => {
//             if (category?.id) {
//               const subCategory = await getSubCategory(category?.slug);
//               const typeKey = categoryToTypeMap[category.name] || '';
//               return { ...category, subCategory, typeKey };
//             }
//             return category;
//           })
//         );
//         setCategoryData(updatedCategories);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };
//
//   const getSubCategory = async (categorySlug) => {
//     try {
//       const response = await axiosInstance.get(
//         `/category/categoryWiseSubCategory/${categorySlug}/`
//       );
//       if (response.status === 200) {
//         return response?.data?.data?.subCategorys || [];
//       }
//     } catch (error) {
//       return [];
//     }
//   };
//
//   useEffect(() => {
//     getCategory();
//
//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (openDropdown !== null && !event.target.closest('.category-item')) {
//         setOpenDropdown(null);
//       }
//     };
//
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [openDropdown]);
//
//   const getCategorywiseProduct = (id, categoryname, slug, typeKey) => {
//     // Always navigate directly on mobile (no dropdown toggle)
//     if (categoryname === "GIFTS") {
//       router.push(`/gifts/`);
//     } else if (categoryname === "SERVICES") {
//       router.push(`/services/`);
//     } else if (categoryname === "OFFERS") {
//       router.push(`/offer/`);
//     } else {
//       router.push(`/${slug}/`, {
//         state: {
//           categoryId: id,
//           categoryName: categoryname,
//           category_slug: slug,
//           typeKey: typeKey || ''
//         }
//       });
//     }
//   };
//
//   // Desktop Hover Handlers
//   const handleCategoryHover = (categoryId, hasSubcategories) => {
//     if (window.innerWidth >= 768 && hasSubcategories) {
//       setOpenDropdown(categoryId);
//     }
//   };
//
//   const handleCategoryLeave = () => {
//     if (window.innerWidth >= 768) {
//       setOpenDropdown(null);
//     }
//   };
//
//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5 relative z-10">
//         {/* Category Container */}
//         <div
//           id="category-scroll-container"
//           className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 w-full overflow-x-auto scrollbar-hide md:flex-wrap md:justify-between md:overflow-visible pb-2"
//         >
//           {publishedCategoryData.map((category, idx) => (
//             <div
//               key={idx}
//               className="relative shrink-0 flex flex-col items-center mb-2 min-w-0 text-center category-item"
//               onMouseEnter={() => handleCategoryHover(
//                 category.id,
//                 category.subCategory && category.subCategory.length > 0
//               )}
//               onMouseLeave={handleCategoryLeave}
//             >
//               <div className="flex flex-col items-center">
//                 <div
//                   className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 border-2 border-gray-400 hover:border-gray-500 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     getCategorywiseProduct(
//                       category.id,
//                       category.name,
//                       category.slug,
//                       category.typeKey || categoryToTypeMap[category.name] || ''
//                     );
//                   }}
//                 >
//                   <img
//                     src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
//                     alt={category.name || "Category"}
//                     className="w-full h-full object-contain rounded-full"
//                     loading="lazy"
//                     width="200"
//                     height="200"
//                     style={{ aspectRatio: '1/1' }}
//                   />
//                 </div>
//                 <h2 className="mt-2 text-center text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-[70px] xs:max-w-[80px] sm:max-w-[90px] md:max-w-[100px] lg:max-w-[110px] leading-tight">
//                   {category.name}
//                 </h2>
//               </div>
//
//               {/* Dropdown - Desktop only, smart positioning to prevent overflow */}
//               <div
//                 className={`hidden md:block absolute top-full pt-2 w-[220px] z-[9999] transition-all duration-200 
//                   ${openDropdown === category.id ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
//                   ${idx >= publishedCategoryData.length - 2 ? 'right-0' : 'left-0'}`}
//                 onMouseEnter={() => setOpenDropdown(category.id)}
//                 onMouseLeave={handleCategoryLeave}
//               >
//                 <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-3 sm:p-4">
//                   <h3 className="text-bio-green font-bold mb-2 text-sm sm:text-base">
//                     {category.name}
//                   </h3>
//                   {category.subCategory && category.subCategory.length > 0 ? (
//                     <ul className="text-gray-700 space-y-1">
//                       {category.subCategory.map((item, index) => {
//                         const subcategoryUrl = `/${category.slug}/${item.slug}/`;
//                         return (
//                           <li
//                             key={index}
//                             className="hover:text-green-600 cursor-pointer transition-colors duration-200"
//                           >
//                             <Link
//                               to={subcategoryUrl}
//                               state={{
//                                 categoryId: category.id,
//                                 categoryName: category.name,
//                                 category_slug: category.slug,
//                                 typeKey: category.typeKey || '',
//                                 subcategoryID: item.id,
//                                 subCategory: {
//                                   name: item.name,
//                                   subcategory_slug: item.slug
//                                 }
//                               }}
//                               className="block py-1 px-2 rounded hover:bg-gray-50 text-xs sm:text-sm"
//                             >
//                               {item.name}
//                             </Link>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-600 text-xs sm:text-sm whitespace-normal">
//                       More subcategories will be added soon
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//
//         {/* Custom Scrollbar CSS */}
//         <style jsx>{`
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// };
//
// export default CategoryIcons;
// ========== END OLD CODE ==========
