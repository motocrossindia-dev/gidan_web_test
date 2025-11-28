import React, { useState, useEffect } from "react";
import axios from "axios"; // This can be removed if not used elsewhere
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSelector } from "react-redux";
import axiosInstance from "../../../Axios/axiosInstance"; // <-- IMPORT THE AXIOS INSTANCE

const API_URL = `/filters/filters_n/`; // <-- REMOVE BASE URL, IT'S IN THE INSTANCE

const FilterSidebar = ({ setResults, setShowMobileFilter, categoryId, category, subcategory, typeKey, subcategoryID }) => {
  const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
  const [userSelectedFilterType, setUserSelectedFilterType] = useState(false);
  const [openFilters, setOpenFilters] = useState({
    subcategories: !!subcategory
  });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);

  const accessToken = useSelector(selectAccessToken);

  // Reset user selection when category changes
  useEffect(() => {
    setUserSelectedFilterType(false);
  }, [category]);

  // Handle typeKey changes
  useEffect(() => {
    if (typeKey) {
      setSelectedFilterType(typeKey);
      setUserSelectedFilterType(true);
    }
  }, [typeKey]);

  // Set selected filter type based on category and availableTypes
  useEffect(() => {
    if (category && availableTypes.length > 0 && !userSelectedFilterType) {
      if (!typeKey) {
        const categoryStr = typeof category === 'string' ? category : String(category);
        const matchedType = availableTypes.find(
            (type) => {
              const typeStr = typeof type === 'string' ? type : String(type);
              return (
                  categoryStr.toLowerCase().includes(typeStr.toLowerCase()) ||
                  typeStr.toLowerCase().includes(categoryStr.toLowerCase())
              );
            }
        );
        if (matchedType) {
          setSelectedFilterType(matchedType);
        } else {
          setSelectedFilterType("plant");
        }
      }
    }
  }, [category, availableTypes, userSelectedFilterType, typeKey]);

  // Fetch filters data when selectedFilterType changes
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // *** FIX: Use axiosInstance instead of axios ***
        const response = await axiosInstance.get(
            `${API_URL}?type=${selectedFilterType}`
        );
        setFilterData(response.data.filters);

        setAvailableTypes(response.data.filters.available_types || []);
        if (response.data.filters.price) {
          setPriceRange({
            min: response.data.filters.price.price_min || "",
            max: response.data.filters.price.price_max || "",
          });
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, [selectedFilterType, categoryId]);

  // Sync subcategory prop with selectedFilters using ID matching
  useEffect(() => {
    if (filterData.subcategories && subcategoryID) {
      const matchedOption = filterData.subcategories.find(
          (option) => option.id === subcategoryID
      );

      setSelectedFilters((prev) => {
        const copy = { ...prev };
        if (matchedOption) {
          copy.subcategories = [matchedOption.id];
        } else {
          delete copy.subcategories;
        }
        return copy;
      });
    }
  }, [filterData.subcategories, subcategoryID]);

  // Toggle open/close filter section
  const handleFilterToggle = (filter) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Handle checkbox selection/unselection of filter options
  const handleFilterSelection = (filter, option) => {
    setSelectedFilters((prev) => {
      const currentSelections = prev[filter] || [];
      let optionValue;

      if (filter === 'subcategories') {
        optionValue = option.id;
      } else {
        optionValue = typeof option === 'string' ? option : option.name;
      }

      const updatedSelections = currentSelections.includes(optionValue)
          ? currentSelections.filter((item) => item !== optionValue)
          : [...currentSelections, optionValue];
      return {
        ...prev,
        [filter]: updatedSelections,
      };
    });
  };

  // Apply selected filters and fetch filtered results
  const applyFilters = async () => {
    let queryParams = new URLSearchParams();
    queryParams.append("type", selectedFilterType);

    if (categoryId) queryParams.append("category_id", categoryId);

    Object.entries(selectedFilters).forEach(([filter, values]) => {
      if (values.length > 0) {
        if (filter === 'subcategories') {
          values.forEach(id => queryParams.append('subcategory_id', id));
        } else {
          queryParams.append(filter, values.join(","));
        }
      }
    });

    if (priceRange.min) queryParams.append("price_min", priceRange.min);
    if (priceRange.max) queryParams.append("price_max", priceRange.max);

    const filterApiUrl = `/filters/productsFilter/?${queryParams.toString()}`; // <-- REMOVE BASE URL

    try {
      // *** FIX: Use axiosInstance and remove manual auth config ***
      const response = await axiosInstance.get(filterApiUrl);

      if (response.status === 200) {
        setResults(response.data.results);
        if (setShowMobileFilter) {
          setShowMobileFilter(false);
        }
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // You might want to show a user-friendly error message here
      if (error.response?.status === 401) {
        console.warn("Unauthorized. Please log in again.");
      }
    }
  };

  return (
      <div className="w-full p-6 bg-white mt-4">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-base font-normal text-black">Filter</h2>
          <button
              className="px-2 py-1 text-xs bg-gray-300 rounded text-gray-700 font-semibold"
              onClick={() => setSelectedFilters({})}
          >
            RESET
          </button>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-700">Type of Filter</label>
          <select
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={selectedFilterType}
              onChange={(e) => {
                setSelectedFilterType(e.target.value);
                setUserSelectedFilterType(true);
              }}
          >
            {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            ))}
          </select>
        </div>
        {Object.entries(filterData).map(
            ([filter, options], index) =>
                filter !== "available_types" && (
                    <div key={index} className="relative mb-3">
                      <button
                          className="w-full py-2 flex justify-between items-center text-left border-b border-gray-200 text-sm"
                          onClick={() => handleFilterToggle(filter)}
                      >
                        <span className="text-gray-700 capitalize">{filter.replace("_", " ")}</span>
                        {openFilters[filter] ? (
                            <FaAngleUp className="text-gray-500" />
                        ) : (
                            <FaAngleDown className="text-gray-500" />
                        )}
                      </button>
                      {openFilters[filter] && (
                          <div className="mt-2 space-y-2 pl-4">
                            {Array.isArray(options) ? (
                                options.map((option, idx) => {
                                  const checkValue = (filter === 'subcategories') ? option.id : (typeof option === 'string' ? option : option.name);

                                  return (
                                      <div key={option.id || idx} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`${filter}-${option.id || idx}`}
                                            checked={selectedFilters[filter]?.includes(checkValue) || false}
                                            onChange={() => handleFilterSelection(filter, option)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`${filter}-${option.id || idx}`} className="text-sm">
                                          {typeof option === 'string' ? option : option.name}
                                        </label>
                                      </div>
                                  );
                                })
                            ) : filter === "price" ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                      type="number"
                                      placeholder="Min"
                                      value={priceRange.min || ""}
                                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                      className="w-20 p-1 border border-gray-300 rounded text-sm"
                                  />
                                  <span className="text-sm">-</span>
                                  <input
                                      type="number"
                                      placeholder="Max"
                                      value={priceRange.max || ""}
                                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                      className="w-20 p-1 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                            ) : null}
                          </div>
                      )}
                    </div>
                )
        )}
        <button
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded text-sm font-semibold"
            onClick={applyFilters}
        >
          Apply
        </button>
      </div>
  );
};

export default FilterSidebar;
// ============================================================
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import { selectAccessToken } from "../../../redux/User/verificationSlice";
// import { useSelector } from "react-redux";
// const API_URL = `${process.env.REACT_APP_API_URL}/filters/filters/`;
//
// const FilterSidebar = ({ setResults, setShowMobileFilter, categoryId, category, subcategory, typeKey }) => {
//   const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
//   const [userSelectedFilterType, setUserSelectedFilterType] = useState(false);
//   const [openFilters, setOpenFilters] = useState({
//     subcategories: !!subcategory
//   });
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [filterData, setFilterData] = useState({});
//   const [availableTypes, setAvailableTypes] = useState([]);
//
//    const accessToken = useSelector(selectAccessToken);
//
//
//   // Reset user selection when category changes
//   useEffect(() => {
//     setUserSelectedFilterType(false);
//   }, [category]);
//
//   // Handle typeKey changes
//   useEffect(() => {
//     if (typeKey) {
//       setSelectedFilterType(typeKey);
//       setUserSelectedFilterType(true);
//     }
//   }, [typeKey]);
//
//   // Set selected filter type based on category and availableTypes
//   useEffect(() => {
//     if (category && availableTypes.length > 0 && !userSelectedFilterType) {
//       // Only try to match if typeKey wasn't provided
//       if (!typeKey) {
//         const categoryStr = typeof category === 'string' ? category : String(category);
//         console.log(category, "===========given", categoryStr, '=========category==========takeing');
//         const matchedType = availableTypes.find(
//             (type) => {
//               const typeStr = typeof type === 'string' ? type : String(type);
//               return (
//                   categoryStr.toLowerCase().includes(typeStr.toLowerCase()) ||
//                   typeStr.toLowerCase().includes(categoryStr.toLowerCase())
//               );
//             }
//         );
//         if (matchedType) {
//           setSelectedFilterType(matchedType);
//         } else {
//           setSelectedFilterType("plant");
//         }
//       }
//     }
//   }, [category, availableTypes, userSelectedFilterType, typeKey]);
//
//   // Fetch filters data when selectedFilterType changes
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const response = await axios.get(
//             `${API_URL}?type=${selectedFilterType}`
//         );
//         setFilterData(response.data.filters);
//
//         setAvailableTypes(response.data.filters.available_types || []);
//         if (response.data.filters.price) {
//           setPriceRange({
//             min: response.data.filters.price.price_min || "",
//             max: response.data.filters.price.price_max || "",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching filters:", error);
//       }
//     };
//     fetchFilters();
//   }, [selectedFilterType, categoryId]);
//
//   // Sync subcategory prop with selectedFilters
//   useEffect(() => {
//     if (filterData.subcategories && subcategory) {
//       const subcategoryStr = typeof subcategory === 'string' ? subcategory : String(subcategory);
//       // More robust normalization that handles various punctuation and spacing
//       const normalizedSubcategory = subcategoryStr.toLowerCase()
//           .replace(/[-_\s]+/g, ' ')  // Replace hyphens, underscores, and multiple spaces with single space
//           .trim();
//
//       console.log('Normalized subcategory:', normalizedSubcategory);
//
//       const matchedOption = filterData.subcategories.find(
//           (option) => {
//             const optionStr = typeof option === 'string' ? option : String(option);
//             const normalizedOption = optionStr.toLowerCase()
//                 .replace(/[-_\s]+/g, ' ')
//                 .trim();
//
//             console.log('Comparing:', normalizedOption, 'with', normalizedSubcategory);
//             return normalizedOption === normalizedSubcategory;
//           }
//       );
//
//       console.log('Matched option:', matchedOption);
//
//       setSelectedFilters((prev) => {
//         const copy = { ...prev };
//         if (matchedOption) {
//           copy.subcategories = [matchedOption];
//         } else {
//           delete copy.subcategories;
//         }
//         return copy;
//       });
//     }
//   }, [filterData.subcategories, subcategory]);
//
//   // Toggle open/close filter section
//   const handleFilterToggle = (filter) => {
//     setOpenFilters((prev) => ({
//       ...prev,
//       [filter]: !prev[filter],
//     }));
//   };
//
//   // Handle checkbox selection/unselection of filter options
//   const handleFilterSelection = (filter, option) => {
//     setSelectedFilters((prev) => {
//       const currentSelections = prev[filter] || [];
//       const updatedSelections = currentSelections.includes(option)
//           ? currentSelections.filter((item) => item !== option)
//           : [...currentSelections, option];
//       return {
//         ...prev,
//         [filter]: updatedSelections,
//       };
//     });
//   };
//
//
//   // const applyFilters = async () => {
//   //   let queryParams = new URLSearchParams();
//   //   queryParams.append("type", selectedFilterType);
//   //   Object.entries(selectedFilters).forEach(([filter, values]) => {
//   //     if (values.length > 0) {
//   //       queryParams.append(filter, values.join(","));
//   //     }
//   //   });
//   //   if (priceRange.min) queryParams.append("price_min", priceRange.min);
//   //   if (priceRange.max) queryParams.append("price_max", priceRange.max);
//   //   const filterApiUrl = `${process.env.REACT_APP_API_URL}/filters/productsFilter/?${queryParams.toString()}`;
//   //   try {
//   //     const response = await axios.get(filterApiUrl);
//   //     if (response.status === 200) {
//   //       setResults(response.data.results);
//   //       if (setShowMobileFilter) {
//   //         setShowMobileFilter(false);
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error("Error applying filters:", error);
//   //   }
//   // };
//
//   // Apply selected filters and fetch filtered results
//
//
// const applyFilters = async () => {
//   let queryParams = new URLSearchParams();
//   queryParams.append("type", selectedFilterType);
//
//   Object.entries(selectedFilters).forEach(([filter, values]) => {
//     if (values.length > 0) {
//       queryParams.append(filter, values.join(","));
//     }
//   });
//
//   if (priceRange.min) queryParams.append("price_min", priceRange.min);
//   if (priceRange.max) queryParams.append("price_max", priceRange.max);
//
//   const filterApiUrl = `${process.env.REACT_APP_API_URL}/filters/productsFilter/?${queryParams.toString()}`;
//
//   try {
//
//
//     const config = {
//       headers: accessToken
//         ? { Authorization: `Bearer ${accessToken}` } // attach only if logged in
//         : {},
//     };
//
//     const response = await axios.get(filterApiUrl, config);
//
//     if (response.status === 200) {
//       setResults(response.data.results);
//       if (setShowMobileFilter) {
//         setShowMobileFilter(false);
//       }
//     }
//   } catch (error) {
//     console.error("Error applying filters:", error);
//     if (error.response?.status === 401) {
//       // Optionally: redirect to login if unauthorized
//       console.warn("Unauthorized. Please log in again.");
//     }
//   }
// };
//
//
//
//   return (
//       <div className="w-full p-6 bg-white mt-4">
//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-base font-normal text-black">Filter</h2>
//           <button
//               className="px-2 py-1 text-xs bg-gray-300 rounded text-gray-700 font-semibold"
//               onClick={() => setSelectedFilters({})}
//           >
//             RESET
//           </button>
//         </div>
//         <div className="mb-4">
//           <label className="text-sm text-gray-700">Type of Filter</label>
//           <select
//               className="w-full mt-1 p-2 border border-gray-300 rounded"
//               value={selectedFilterType}
//               onChange={(e) => {
//                 setSelectedFilterType(e.target.value);
//                 setUserSelectedFilterType(true); // Mark that user manually selected
//               }}
//           >
//             {availableTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </option>
//             ))}
//           </select>
//         </div>
//         {Object.entries(filterData).map(
//             ([filter, options], index) =>
//                 filter !== "available_types" && (
//                     <div key={index} className="relative mb-3">
//                       <button
//                           className="w-full py-2 flex justify-between items-center text-left border-b border-gray-200 text-sm"
//                           onClick={() => handleFilterToggle(filter)}
//                       >
//                         <span className="text-gray-700 capitalize">{filter.replace("_", " ")}</span>
//                         {openFilters[filter] ? (
//                             <FaAngleUp className="text-gray-500" />
//                         ) : (
//                             <FaAngleDown className="text-gray-500" />
//                         )}
//                       </button>
//                       {openFilters[filter] && (
//                           <div className="mt-2 space-y-2 pl-4">
//                             {Array.isArray(options) ? (
//                                 options.map((option, idx) => (
//                                     <div key={idx} className="flex items-center">
//                                       <input
//                                           type="checkbox"
//                                           id={`${filter}-${idx}`}
//                                           checked={selectedFilters[filter]?.includes(option) || false}
//                                           onChange={() => handleFilterSelection(filter, option)}
//                                           className="mr-2"
//                                       />
//                                       <label htmlFor={`${filter}-${idx}`} className="text-sm">
//                                         {option}
//                                       </label>
//                                     </div>
//                                 ))
//                             ) : filter === "price" ? (
//                                 <div className="flex items-center space-x-2">
//                                   <input
//                                       type="number"
//                                       placeholder="Min"
//                                       value={priceRange.min || ""}
//                                       onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//                                       className="w-20 p-1 border border-gray-300 rounded text-sm"
//                                   />
//                                   <span className="text-sm">-</span>
//                                   <input
//                                       type="number"
//                                       placeholder="Max"
//                                       value={priceRange.max || ""}
//                                       onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//                                       className="w-20 p-1 border border-gray-300 rounded text-sm"
//                                   />
//                                 </div>
//                             ) : null}
//                           </div>
//                       )}
//                     </div>
//                 )
//         )}
//         <button
//             className="w-full mt-4 py-2 bg-blue-500 text-white rounded text-sm font-semibold"
//             onClick={applyFilters}
//         >
//           Apply
//         </button>
//       </div>
//   );
// };
//
// export default FilterSidebar;
