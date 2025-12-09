import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSelector } from "react-redux";
import axiosInstance from "../../../Axios/axiosInstance";
import { createPortal } from "react-dom";

const API_URL = `/filters/filters_n/`;

const DropdownPortal = ({ isOpen, filter, options, selectedFilters, handleFilterSelection, buttonRef }) => {
  if (!isOpen) return null;

  const buttonRect = buttonRef.current?.getBoundingClientRect();
  if (!buttonRect) return null;

  const dropdownStyle = {
    position: 'fixed',
    top: `${buttonRect.bottom + window.scrollY + 4}px`,
    left: `${buttonRect.left + window.scrollX}px`,
    width: '16rem',
    zIndex: 9999,
  };

  const handleDropdownMouseDown = (e) => e.stopPropagation();

  return createPortal(
      <div
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
          onMouseDown={handleDropdownMouseDown}
      >
        <div className="p-3 space-y-1">
          {Array.isArray(options) && options.length > 0 ? (
              options.map((option, idx) => {
                const optionValue =
                    filter === "subcategories"
                        ? option.id
                        : typeof option === "string"
                            ? option
                            : option.name;

                const isSelected = selectedFilters[filter] === optionValue;

                return (
                    <div
                        key={option.id || idx}
                        onClick={() => handleFilterSelection(filter, option)}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50"
                        }`}
                    >
                      {isSelected && (
                          <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                          </svg>
                      )}
                      {!isSelected && <span className="w-4 h-4 mr-3" />}

                      <span className="text-sm">
                  {typeof option === "string" ? option : option.name}
                </span>
                    </div>
                );
              })
          ) : (
              <div className="p-2 text-sm text-gray-500">No options available</div>
          )}
        </div>
      </div>,
      document.body
  );
};

const FilterSidebar = ({
                         setResults,
                         setShowMobileFilter,
                         categoryId,
                         category,
                         subcategory,
                         typeKey,
                         subcategoryID,
                       }) => {
  const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
  const [userSelectedFilterType, setUserSelectedFilterType] = useState(false);
  const [openFilters, setOpenFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);

  const dropdownButtonRefs = useRef({});
  const dropdownContainerRefs = useRef({});

  const accessToken = useSelector(selectAccessToken);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(
      (event) => {
        const isInside = Object.keys(openFilters).some((filter) => {
          const btn = dropdownButtonRefs.current[filter];
          const portal = document.querySelector(`[style*="z-index: 9999"]`);
          return (
              (btn && btn.contains(event.target)) ||
              (portal && portal.contains(event.target))
          );
        });

        if (!isInside) {
          setOpenFilters({});
        }
      },
      [openFilters]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Reset user selection when category changes
  useEffect(() => setUserSelectedFilterType(false), [category]);

  // Handle typeKey from URL
  useEffect(() => {
    if (typeKey) {
      setSelectedFilterType(typeKey);
      setUserSelectedFilterType(true);
    }
  }, [typeKey]);

  // Auto-select type based on category name
  useEffect(() => {
    if (category && availableTypes.length > 0 && !userSelectedFilterType && !typeKey) {
      const cat = String(category).toLowerCase();
      const match = availableTypes.find(
          (t) => cat.includes(t.toLowerCase()) || t.toLowerCase().includes(cat)
      );
      setSelectedFilterType(match || "plant");
    }
  }, [category, availableTypes, userSelectedFilterType, typeKey]);

  // Fetch filters
  useEffect(() => {
    axiosInstance
        .get(`${API_URL}?type=${selectedFilterType}`)
        .then((res) => {
          setFilterData(res.data.filters);
          setAvailableTypes(res.data.filters.available_types || []);
          if (res.data.filters.price) {
            setPriceRange({
              min: res.data.filters.price.price_min || "",
              max: res.data.filters.price.price_max || "",
            });
          }
        })
        .catch((err) => console.error(err));
  }, [selectedFilterType, categoryId]);

  // Preselect subcategory from URL
  useEffect(() => {
    if (filterData.subcategories && subcategoryID) {
      const found = filterData.subcategories.find((o) => o.id === subcategoryID);
      if (found) {
        setSelectedFilters((prev) => ({ ...prev, subcategories: found.id }));
      }
    }
  }, [filterData.subcategories, subcategoryID]);

  const handleFilterToggle = (filter) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleFilterSelection = (filter, option) => {
    const value =
        filter === "subcategories"
            ? option.id
            : typeof option === "string"
                ? option
                : option.name;

    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: prev[filter] === value ? null : value,
    }));
    setOpenFilters({});
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    params.append("type", selectedFilterType);
    if (categoryId) params.append("category_id", categoryId);

    Object.entries(selectedFilters).forEach(([k, v]) => {
      if (v) {
        k === "subcategories"
            ? params.append("subcategory_id", v)
            : params.append(k, v);
      }
    });

    if (priceRange.min) params.append("price_min", priceRange.min);
    if (priceRange.max) params.append("price_max", priceRange.max);

    try {
      const res = await axiosInstance.get(`/filters/main_productsFilter/?${params}`);
      setResults(res.data.results);
      setOpenFilters({});
      setShowMobileFilter?.(false);
    } catch (err) {
      console.error(err);
    }
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setPriceRange({ min: "", max: "" });
    setOpenFilters({});
  };

  const removeFilter = (filter, value) => {
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      if (copy[filter] === value) delete copy[filter];
      return copy;
    });
  };

  const getDisplayName = (filter, value) => {
    if (filter === "subcategories") {
      const opt = filterData[filter]?.find((o) => o.id === value);
      return opt ? opt.name : value;
    }
    return value;
  };

  return (
      <div className="w-full bg-white shadow-sm border-b border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center gap-3">
              <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium"
              >
                Reset All
              </button>
              <button
                  onClick={applyFilters}
                  className="px-6 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters Body - Responsive */}
        <div className="px-6 py-4">
          {/* This container hides scrollbar but allows scrolling */}
          <div
              className="flex flex-col md:flex-row md:gap-4 md:overflow-x-auto hide-scrollbar md:pb-2 space-y-4 md:space-y-0"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
          >
            {/* Type Selector */}
            <div className="w-full md:w-48 flex-shrink-0">
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={selectedFilterType}
                  onChange={(e) => {
                    setSelectedFilterType(e.target.value);
                    setUserSelectedFilterType(true);
                  }}
              >
                {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                ))}
              </select>
            </div>

            {/* Dynamic Filters */}
            {Object.entries(filterData)
                .filter(([k]) => k !== "available_types" && k !== "price")
                .map(([filter, options]) => (
                    <div
                        key={filter}
                        className="w-full md:w-48 flex-shrink-0"
                        ref={(el) => (dropdownContainerRefs.current[filter] = el)}
                    >
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                        {filter.replace("_", " ")}
                      </label>
                      <button
                          ref={(el) => (dropdownButtonRefs.current[filter] = el)}
                          onClick={() => handleFilterToggle(filter)}
                          className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between"
                      >
                  <span className="text-gray-700 truncate">
                    {selectedFilters[filter]
                        ? getDisplayName(filter, selectedFilters[filter])
                        : "Select"}
                  </span>
                        {openFilters[filter] ? (
                            <FaAngleUp className="text-gray-500 ml-2 flex-shrink-0" />
                        ) : (
                            <FaAngleDown className="text-gray-500 ml-2 flex-shrink-0" />
                        )}
                      </button>

                      <DropdownPortal
                          isOpen={openFilters[filter]}
                          filter={filter}
                          options={options}
                          selectedFilters={selectedFilters}
                          handleFilterSelection={handleFilterSelection}
                          buttonRef={{ current: dropdownButtonRefs.current[filter] }}
                      />
                    </div>
                ))}

            {/* Price Range */}
            {filterData.price && (
                <div className="w-full md:w-64 flex-shrink-0">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min || ""}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full md:w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max || ""}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full md:w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(selectedFilters).length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">Active:</span>
                {Object.entries(selectedFilters).map(
                    ([filter, value]) =>
                        value && (
                            <span
                                key={`${filter}-${value}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                    <span className="max-w-[150px] truncate">
                      {getDisplayName(filter, value)}
                    </span>
                    <button
                        onClick={() => removeFilter(filter, value)}
                        className="ml-1 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                        )
                )}
              </div>
            </div>
        )}

        {/* Custom CSS to hide scrollbar */}
        <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      </div>
  );
};

export default FilterSidebar;
// import React, { useState, useEffect, useRef, useCallback } from "react"; // <-- ADD useCallback
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import { selectAccessToken } from "../../../redux/User/verificationSlice";
// import { useSelector } from "react-redux";
// import axiosInstance from "../../../Axios/axiosInstance";
// import { createPortal } from "react-dom";
//
// const API_URL = `/filters/filters_n/`;
//
// const DropdownPortal = ({ isOpen, filter, options, selectedFilters, handleFilterSelection, buttonRef }) => {
//   if (!isOpen) return null;
//
//   const buttonRect = buttonRef.current?.getBoundingClientRect();
//   if (!buttonRect) return null;
//
//   const dropdownStyle = {
//     position: 'fixed',
//     top: `${buttonRect.bottom + window.scrollY + 4}px`,
//     left: `${buttonRect.left + window.scrollX}px`,
//     width: '16rem',
//     zIndex: 9999,
//   };
//
//   const handleDropdownMouseDown = (event) => {
//     event.stopPropagation();
//   };
//
//   return createPortal(
//       <div
//           style={dropdownStyle}
//           className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
//           onMouseDown={handleDropdownMouseDown}
//       >
//         <div className="p-3 space-y-1">
//           {Array.isArray(options) && options.length > 0 ? (
//               options.map((option, idx) => {
//                 const optionValue = (filter === 'subcategories')
//                     ? option.id
//                     : (typeof option === 'string' ? option : option.name);
//
//                 const isSelected = selectedFilters[filter] === optionValue;
//
//                 return (
//                     <div
//                         key={option.id || idx}
//                         onClick={() => handleFilterSelection(filter, option)}
//                         className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
//                             isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'
//                         }`}
//                     >
//                       {isSelected && (
//                           <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                           </svg>
//                       )}
//                       {!isSelected && <span className="w-4 h-4 mr-3"></span>}
//
//                       <span className="text-sm">
// {typeof option === 'string' ? option : option.name}
// </span>
//                     </div>
//                 );
//               })
//           ) : (
//               <div className="p-2 text-sm text-gray-500">No options available</div>
//           )}
//         </div>
//       </div>,
//       document.body
//   );
// };
//
// const FilterSidebar = ({ setResults, setShowMobileFilter, categoryId, category, subcategory, typeKey, subcategoryID }) => {
//   const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
//   const [userSelectedFilterType, setUserSelectedFilterType] = useState(false);
//   const [openFilters, setOpenFilters] = useState({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [filterData, setFilterData] = useState({});
//   const [availableTypes, setAvailableTypes] = useState([]);
//
//   const dropdownButtonRefs = useRef({});
//   const dropdownContainerRefs = useRef({});
//
//   const accessToken = useSelector(selectAccessToken);
//
// // --- OPTIMIZED: Use useCallback to prevent infinite loops ---
//   const handleClickOutside = useCallback((event) => {
//     const isClickInsideAnyDropdown = Object.keys(openFilters).some((filter) => {
//       const buttonRef = dropdownButtonRefs.current[filter];
//       if (buttonRef && buttonRef.contains(event.target)) {
//         return true;
//       }
//       const dropdownElement = document.querySelector(`[style*="z-index: 9999"]`);
//       if (dropdownElement && dropdownElement.contains(event.target)) {
//         return true;
//       }
//       return false;
//     });
//
//     if (!isClickInsideAnyDropdown) {
//       setOpenFilters({});
//     }
//   }, [openFilters]);
//
// // --- OPTIMIZED: The effect now depends on the stable function ---
//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [handleClickOutside]);
//
// // ... (all other useEffect hooks remain the same) ...
//   useEffect(() => {
//     setUserSelectedFilterType(false);
//   }, [category]);
//
//   useEffect(() => {
//     if (typeKey) {
//       setSelectedFilterType(typeKey);
//       setUserSelectedFilterType(true);
//     }
//   }, [typeKey]);
//
//   useEffect(() => {
//     if (category && availableTypes.length > 0 && !userSelectedFilterType) {
//       if (!typeKey) {
//         const categoryStr = typeof category === 'string' ? category : String(category);
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
//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const response = await axiosInstance.get(
//             `${API_URL}?type=${selectedFilterType}`
//         );
//         setFilterData(response.data.filters);
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
//   useEffect(() => {
//     if (filterData.subcategories && subcategoryID) {
//       const matchedOption = filterData.subcategories.find(
//           (option) => option.id === subcategoryID
//       );
//
//       setSelectedFilters((prev) => {
//         const copy = { ...prev };
//         if (matchedOption) {
//           copy.subcategories = matchedOption.id;
//         } else {
//           delete copy.subcategories;
//         }
//         return copy;
//       });
//     }
//   }, [filterData.subcategories, subcategoryID]);
//
//   const handleFilterToggle = (filter) => {
//     setOpenFilters((prev) => {
//       const newState = {};
//       newState[filter] = !prev[filter];
//       return newState;
//     });
//   };
//
//   const handleFilterSelection = (filter, option) => {
//     const optionValue = (filter === 'subcategories')
//         ? option.id
//         : (typeof option === 'string' ? option : option.name);
//
//     setSelectedFilters((prev) => {
//       const newValue = prev[filter] === optionValue ? null : optionValue;
//       return {
//         ...prev,
//         [filter]: newValue,
//       };
//     });
//
//     setOpenFilters({});
//   };
//
//   const applyFilters = async () => {
//     let queryParams = new URLSearchParams();
//     queryParams.append("type", selectedFilterType);
//
//     if (categoryId) queryParams.append("category_id", categoryId);
//
//     Object.entries(selectedFilters).forEach(([filter, value]) => {
//       if (value) {
//         if (filter === 'subcategories') {
//           queryParams.append('subcategory_id', value);
//         } else {
//           queryParams.append(filter, value);
//         }
//       }
//     });
//
//     if (priceRange.min) queryParams.append("price_min", priceRange.min);
//     if (priceRange.max) queryParams.append("price_max", priceRange.max);
//
//     const filterApiUrl = `/filters/main_productsFilter/?${queryParams.toString()}`;
//
//     try {
//       const response = await axiosInstance.get(filterApiUrl);
//
//       if (response.status === 200) {
//         setResults(response.data.results);
//         setOpenFilters({});
//         if (setShowMobileFilter) {
//           setShowMobileFilter(false);
//         }
//       }
//     } catch (error) {
//       console.error("Error applying filters:", error);
//       if (error.response?.status === 401) {
//         console.warn("Unauthorized. Please log in again.");
//       }
//     }
//   };
//
//   const resetFilters = () => {
//     setSelectedFilters({});
//     setPriceRange({ min: "", max: "" });
//     setOpenFilters({});
//   };
//
//   const removeFilter = (filter, value) => {
//     setSelectedFilters((prev) => {
//       const copy = { ...prev };
//       if (copy[filter] === value) {
//         delete copy[filter];
//       }
//       return copy;
//     });
//   };
//
//   const getDisplayName = (filter, value) => {
//     if (filter === 'subcategories') {
//       const option = filterData[filter]?.find(opt => opt.id === value);
//       return option ? option.name : value;
//     }
//     return value;
//   };
//
//   return (
//       <div className="w-full bg-white shadow-sm border-b border-gray-200 relative">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//             <div className="flex items-center gap-3">
//               <button
//                   className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition-colors"
//                   onClick={resetFilters}
//               >
//                 Reset All
//               </button>
//               <button
//                   className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
//                   onClick={applyFilters}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//
//         <div className="px-6 py-4 overflow-visible">
//           <div className="flex items-start gap-4 overflow-x-auto overflow-y-visible pb-2">
//             <div className="flex-shrink-0 min-w-[180px]">
//               <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
//               <select
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={selectedFilterType}
//                   onChange={(e) => {
//                     setSelectedFilterType(e.target.value);
//                     setUserSelectedFilterType(true);
//                   }}
//               >
//                 {availableTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </option>
//                 ))}
//               </select>
//             </div>
//
//             {Object.entries(filterData).map(
//                 ([filter, options]) =>
//                     filter !== "available_types" && filter !== "price" && (
//                         <div
//                             key={filter}
//                             className="relative flex-shrink-0 min-w-[180px]"
//                             ref={(el) => (dropdownContainerRefs.current[filter] = el)}
//                         >
//                           <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
//                             {filter.replace("_", " ")}
//                           </label>
//                           <button
//                               ref={(el) => (dropdownButtonRefs.current[filter] = el)}
//                               className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between"
//                               onClick={() => handleFilterToggle(filter)}
//                           >
// <span className="text-gray-700 truncate">
// {selectedFilters[filter]
//     ? getDisplayName(filter, selectedFilters[filter])
//     : "Select"}
// </span>
//                             {openFilters[filter] ? (
//                                 <FaAngleUp className="text-gray-500 flex-shrink-0 ml-2" />
//                             ) : (
//                                 <FaAngleDown className="text-gray-500 flex-shrink-0 ml-2" />
//                             )}
//                           </button>
//
//                           <DropdownPortal
//                               isOpen={openFilters[filter]}
//                               filter={filter}
//                               options={options}
//                               selectedFilters={selectedFilters}
//                               handleFilterSelection={handleFilterSelection}
//                               buttonRef={{ current: dropdownButtonRefs.current[filter] }}
//                           />
//                         </div>
//                     )
//             )}
//
//             {filterData.price && (
//                 <div className="flex-shrink-0 min-w-[200px]">
//                   <label className="block text-xs font-medium text-gray-600 mb-1">
//                     Price Range
//                   </label>
//                   <div className="flex items-center gap-2">
//                     <input
//                         type="number"
//                         placeholder="Min"
//                         value={priceRange.min || ""}
//                         onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//                         className="w-20 px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <span className="text-gray-400">-</span>
//                     <input
//                         type="number"
//                         placeholder="Max"
//                         value={priceRange.max || ""}
//                         onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//                         className="w-20 px-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//             )}
//           </div>
//         </div>
//
//         {Object.keys(selectedFilters).length > 0 && (
//             <div className="px-6 pb-4">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-xs font-medium text-gray-600">Active:</span>
//                 {Object.entries(selectedFilters).map(([filter, value]) =>
//                         value && (
//                             <span
//                                 key={`${filter}-${value}`}
//                                 className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
//                             >
// <span className="max-w-[150px] truncate">
// {getDisplayName(filter, value)}
// </span>
// <button
//     onClick={() => removeFilter(filter, value)}
//     className="hover:text-blue-900 font-bold text-base leading-none"
// >
// ×
// </button>
// </span>
//                         )
//                 )}
//               </div>
//             </div>
//         )}
//       </div>
//   );
// };
//
// export default FilterSidebar;
