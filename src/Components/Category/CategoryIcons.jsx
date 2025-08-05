import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import axiosInstance from "../../Axios/axiosInstance";

const CategoryIcons = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

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
              const subCategory = await getSubCategory(category?.id);
              return { ...category, subCategory };
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

  // const getCategorywiseProduct = async (id, categoryname) => {
  //   if (categoryname === "GIFTS") {
  //     navigate(`/gifts/`);
  //   } else if (categoryname === "SERVICES") {
  //     navigate(`/services/`);
  //   } else {
  //     navigate(`/filter/${id}`);
  //   }
  // };

const getCategorywiseProduct = async (id, categoryname) => {
  if (categoryname === "GIFTS") {
    navigate(`/gifts/`);
  } else if (categoryname === "SERVICES") {
    navigate(`/services/`);
  } else if (categoryname === "OFFERS") {
    navigate(`/combooffer`); // ✅ Navigate to combooffer page
  } else {
    navigate(`/filter/${id}`);
  }
};




  return (
<>
  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-5">
    <div
      className={`flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 sm:py-2 w-full ${
        isMobile
          ? "overflow-x-auto whitespace-nowrap scrollbar-hide justify-start"
          : "flex-wrap justify-between"
      }`}
    >
      {publishedCategoryData.map((category, idx) => (
        <div
          key={idx}
          className="relative shrink-0 flex flex-col items-center mb-2 min-w-0 text-center"
        >
          <div
            onMouseEnter={() => setHoveredCategory(idx)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="flex flex-col items-center"
          >
            <div
              className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 border-2 border-gray-400 hover:border-gray-500 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
              onClick={() => getCategorywiseProduct(category.id, category.name)}
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

            {hoveredCategory === idx && (
              <div className="absolute top-full left-0 mt-2 w-[180px] sm:w-[200px] md:w-[220px] bg-white border border-gray-200 shadow-lg rounded-lg z-[999] origin-top-left">
                <div className="p-3 sm:p-4">
                  <h3 className="text-bio-green font-bold mb-2 text-sm sm:text-base">
                    {category.name}
                  </h3>
                  {category.subCategory && category.subCategory.length > 0 ? (
                    <ul className="text-gray-700 space-y-1">
                      {category.subCategory.map((item, index) => (
                        <li
                          key={index}
                          className="hover:text-green-600 cursor-pointer transition-colors duration-200"
                        >
                          <Link
                            to={`/filter/subcategory/${item.id}`}
                            className="block py-1 px-2 rounded hover:bg-gray-50 text-xs sm:text-sm"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">
                      No subcategories available
                    </p>
                  )}
                </div>
              </div>
            )}
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
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { isMobile } from "react-device-detect"; // Import device detection
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Axios/axiosInstance";

// const CategoryIcons = () => {
//   const [categoryData, setCategoryData] = useState([]);
//   const navigate = useNavigate();
//   const publishedCategoryData = categoryData.filter((category) => category?.is_published === true);
  

//   const getCategory = async () => {
//     try {
//       const response = await axiosInstance.get(`/category/`);
//       const categories = response?.data?.data?.categories;
//       if (categories?.length > 0) {
//         const updatedCategories = await Promise.all(
//           categories.map(async (category) => {
//             if (category?.id) {
//               const subCategory = await getSubCategory(category?.id);
//               return { ...category, subCategory };
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

//   const getSubCategory = async (categoryId) => {
//     try {
      
//       const response = await axiosInstance.get(`/category/categoryWiseSubCategory/${categoryId}/`);
//       if (response.status === 200) {
//       return response?.data?.data?.subCategorys || [];
        
//       }
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     getCategory(); // ✅ only runs once on mount
//   }, []);

//   useEffect(() => {
//   }, [categoryData]);




// const getCategorywiseProduct = async (id,categoryname) => {
  
// if (categoryname === "GIFTS") {
//   navigate(`/gifts/`);
//   return;
  
// }else if (categoryname === 'SERVICES') {
//     navigate(`/services/`);
//     return; 
  
// }else{
//           navigate(`/filter/${id}`);
//           return;
// }
  

// }

//   return (

// <>
// <div className="max-w-7xl mx-auto px-5">
//   <div className={`flex items-center justify-start gap-4 px-4 mt-4 sm:py-2 w-full ${isMobile ? "category-container" : ""}`}>
//     {publishedCategoryData.map((category, idx) => (
//       <div
//         key={idx}
//         className="relative group shrink-0 flex-grow flex-basis-[14.28%] flex flex-col items-center mb-2"
//       >
//         {/* Image */}
//         <Link
//           to={
//             category.name === "GIFTS"
//               ? "/gifts"
//               : category.name === "SERVICES"
//               ? "/services"
//               : `/filter/${category.id}`
//           }
//         >
//           <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-26 lg:h-26 border-2 border-gray-400 hover:border-gray-500 rounded-full flex items-center justify-center bg-white shadow-md overflow-hidden">
//             <img name=" "   
//               src={`${process.env.REACT_APP_API_URL}${category.image}`}
//               alt={category.name || "Category"}
//               onClick={() => getCategorywiseProduct(category.id, category.name)}
//               className="w-full h-full object-contain rounded-full"
//             />
//           </div>
//         </Link>

//         <h2 className="mt-1 text-center text-xs sm:text-sm md:text-base font-medium text-gray-800">
//           {category.name}
//         </h2>

//         {/* Dropdown for Subcategories - Hidden on Mobile */}
//         <div
//           className="absolute bottom-0 left-1/2 transform -translate-x-1/2 ml-4 translate-y-full hidden w-[180px] bg-white border border-gray-200 shadow-lg z-[999] md:group-hover:block"
//         >
//           <div className="p-4">
//             <h3 className="text-bio-green font-bold mb-2">{category.name}</h3>
//             {category.subCategory && category.subCategory.length > 0 ? (
//               <ul className="text-gray-700">
//                 {category.subCategory.map((item, index) => (
//                   <li key={index} className="hover:text-green-600 cursor-pointer">
//                     <Link to={`/filter/subcategory/${item.id}`} className="block">
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No subcategories available</p>
//             )}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Custom Scrollbar CSS */}
//   <style jsx>{`
//     .category-container {
//       -webkit-overflow-scrolling: touch;
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 25px;
//       padding: 8px 2px;
//     }

//     .custom-scrollbar::-webkit-scrollbar {
//       display: none;
//     }
//     .custom-scrollbar {
//       -ms-overflow-style: none;
//       scrollbar-width: none;
//     }

//     @media (max-width: 768px) {
//       .category-container {
//         overflow-x: scroll;
//       }
//     }
//   `}</style>
// </div>


// </>

  
//   );
// };

// export default CategoryIcons;

