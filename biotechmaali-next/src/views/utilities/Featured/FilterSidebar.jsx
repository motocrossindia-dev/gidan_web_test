'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axiosInstance from "../../../Axios/axiosInstance";
import { createPortal } from "react-dom";

const API_URL = `/filters/filters_n/`;

// Helper: get the value to store for a filter option (use id for objects, string for plain strings)
const getOptionValue = (option) => {
  if (typeof option === "string") return option;
  return option.id != null ? option.id : option.name;
};

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
          className="bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto"
          onMouseDown={handleDropdownMouseDown}
      >
        <div className="p-3 space-y-1">
          {Array.isArray(options) && options.length > 0 ? (
              options.map((option, idx) => {
                const optionValue = getOptionValue(option);

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
              <div className="p-2 text-sm text-gray-600">No options available</div>
          )}
        </div>
      </div>,
      document.body
  );
};

const FilterSidebar = ({
                         setResults,
                         setProducts,
                         setFiltersApplied,
                         setShowMobileFilter,
                         categoryId,
                         category,
                         subcategory,
                         typeKey,
                         subcategoryID,
                         subcategorySlug,
                         categorySlug,
                         setCategoryData,
                         setCurrentFilterType,
                         isSeasonalCollection,
                         isTrending,
                         isFeatured,
                         isBestSeller
                       }) => {
  // Track if this is the very first render of the component
  const isInitialMount = useRef(true);
  const router = useRouter();

  const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
  const [userHasSelectedType, setUserHasSelectedType] = useState(false);

  const [openFilters, setOpenFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);

  const dropdownButtonRefs = useRef({});
  const dropdownContainerRefs = useRef({});

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(
      (event) => {
        const hasOpenDropdowns = Object.values(openFilters).some(Boolean);
        if (!hasOpenDropdowns) return;

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
    const hasOpenDropdowns = Object.values(openFilters).some(Boolean);

    if (hasOpenDropdowns) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openFilters, handleClickOutside]);

  useEffect(() => {
    setUserHasSelectedType(false);
    setPriceRange({ min: "", max: "" });
  }, [category]);

  useEffect(() => {
    if (typeKey) {
      setSelectedFilterType(typeKey);
      setUserHasSelectedType(true);
    }
  }, [typeKey]);

  useEffect(() => {
    if (availableTypes.length > 0 && !userHasSelectedType && !typeKey) {
      // Try to match type from category name, then fall back to categorySlug
      const searchTerm = (category || categorySlug || "").toLowerCase();
      if (searchTerm) {
        // Normalize: strip trailing 's' for singular comparison (pots→pot, plants→plant)
        const singular = searchTerm.endsWith("s") ? searchTerm.slice(0, -1) : searchTerm;
        const match = availableTypes.find((t) => {
          const tLower = t.toLowerCase();
          return tLower === searchTerm || tLower === singular;
        });
        setSelectedFilterType(match || availableTypes[0] || "plant");
      }
    }
  }, [category, categorySlug, availableTypes, userHasSelectedType, typeKey]);

  // Fetch filters
  useEffect(() => {
    axiosInstance
        .get(`${API_URL}?type=${selectedFilterType}`)
        .then((res) => {
          const filters = res.data?.filters || {};
          setFilterData(filters);
          setAvailableTypes(filters.available_types || []);
          
          // Clear all selected filters when Type changes (except keep the Type itself)
          setSelectedFilters({});
          setPriceRange({ min: "", max: "" });
        })
        .catch((err) => {
          console.error(err);
        });
  }, [selectedFilterType, categoryId]);

  // Preselect subcategory from URL
  useEffect(() => {
    if (filterData.subcategories) {
      let found = null;

      if (subcategoryID) {
        found = filterData.subcategories.find((o) => o.id === subcategoryID);
      }

      if (!found && subcategorySlug) {
        found = filterData.subcategories.find((o) =>
            o.slug === subcategorySlug ||
            o.subcategory_slug === subcategorySlug ||
            o.name?.toLowerCase().replace(/\s+/g, '-') === subcategorySlug
        );
      }

      if (found) {
        setSelectedFilters((prev) => ({ ...prev, subcategories: found.id }));
      }
    }
  }, [filterData.subcategories, subcategoryID, subcategorySlug]);

  const handleFilterToggle = useCallback((filter) => {
    setOpenFilters((prev) => {
      const newState = {};
      newState[filter] = !prev[filter];
      return newState;
    });
  }, []);

  const handleFilterSelection = useCallback((filter, option) => {
    // Store id for all object-based filters (subcategories, size, color, weights, etc.)
    const value = getOptionValue(option);

    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: prev[filter] === value ? null : value,
    }));
    setOpenFilters({});
    
    // Navigate to new URL when subcategory is selected
    if (filter === "subcategories") {
      const subSlug = option.subcategory_slug || option.slug || option.name?.toLowerCase().replace(/\s+/g, '-');
      if (subSlug) {
        const newPath = categorySlug
          ? `/${categorySlug}/${subSlug}/`
          : `/${subSlug}/`;
        router.push(newPath, { replace: false });
      }
    }
  }, [categorySlug, router]);

  const applyFilters = useCallback(async () => {
    const params = new URLSearchParams();
    params.append("type", selectedFilterType);

    if (setCurrentFilterType) {
      setCurrentFilterType(selectedFilterType);
    }

    // Always include category context so results stay scoped to this category
    if (categoryId) {
      params.append("category_id", categoryId);
    } else if (categorySlug) {
      params.append("category_slug", categorySlug);
    }

    // Map filter keys to API param names
    // subcategories → subcategory_id, all others send key=id directly
    let hasSubcategoryId = false;
    Object.entries(selectedFilters).forEach(([k, v]) => {
      if (v != null) {
        if (k === "subcategories") {
          params.append("subcategory_id", v);
          hasSubcategoryId = true;
        } else {
          // For object-based filters (size, color, weights, planter_size, etc.),
          // v is already the id number; for string filters v is the string value
          params.append(k, v);
        }
      }
    });

    // Fallback: if no subcategory_id resolved yet but URL has a slug, use it
    if (!hasSubcategoryId && subcategorySlug) {
      params.append("subcategory_slug", subcategorySlug);
    }

    if (priceRange.min) params.append("price_min", priceRange.min);
    if (priceRange.max) params.append("price_max", priceRange.max);

    // Add boolean filter flags
    if (isSeasonalCollection) params.append("is_seasonal_collection", "true");
    if (isTrending) params.append("is_trending", "true");
    if (isFeatured) params.append("is_featured", "true");
    if (isBestSeller) params.append("is_best_seller", "true");

    try {
      const res = await axiosInstance.get(`/filters/main_productsFilter/?${params}`);
      setResults(res.data.results);

      // Update pagination so ProductGrid shows correct count
      if (setProducts) {
        setProducts({
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
        });
      }

      // Mark filters as applied so ProductGrid disables infinite scroll
      if (setFiltersApplied) {
        setFiltersApplied(true);
      }

      if (setCategoryData) {
        setCategoryData(res.data?.category_info?.category_info || null);
      }

      setOpenFilters({});
      // Only close the mobile drawer if we are NOT on the initial mount
      if (setShowMobileFilter && !isInitialMount.current) {
        setShowMobileFilter(false);
      }
    } catch (err) {}
  }, [selectedFilterType, categoryId, categorySlug, subcategorySlug, userHasSelectedType, selectedFilters, priceRange, setCurrentFilterType, setResults, setProducts, setFiltersApplied, setCategoryData, setShowMobileFilter, isSeasonalCollection, isTrending, isFeatured, isBestSeller]);

  // AUTO-APPLY LOGIC FIX
  useEffect(() => {
    if (selectedFilterType && (categoryId || subcategoryID)) {
      // We call applyFilters but ensure it doesn't close the drawer immediately
      applyFilters().then(() => {
        // Mark initial mount as complete AFTER the first auto-apply
        if (isInitialMount.current) {
          isInitialMount.current = false;
        }
      });
    }
  }, [categoryId, subcategoryID]); // Only run for ID-based navigation; slug pages handled by PlantFilter

  const resetFilters = useCallback(() => {
    setSelectedFilters({});
    setPriceRange({ min: "", max: "" });
    setOpenFilters({});
    if (setFiltersApplied) setFiltersApplied(false);
    if (setCurrentFilterType) {
      setCurrentFilterType(null);
    }
  }, [setFiltersApplied, setCurrentFilterType]);

  const removeFilter = useCallback((filter, value) => {
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      if (copy[filter] === value) delete copy[filter];
      return copy;
    });
  }, []);

  const getDisplayName = useCallback((filter, value) => {
    // Resolve id → name for any filter that has {id, name} objects
    const options = filterData[filter];
    if (Array.isArray(options) && options.length > 0 && typeof options[0] === "object") {
      const opt = options.find((o) => o.id === value);
      return opt ? opt.name : value;
    }
    return value;
  }, [filterData]);

  const filterEntries = useMemo(() => {
    return Object.entries(filterData).filter(
        ([k]) => k !== "available_types" && k !== "price"
    );
  }, [filterData]);

  const activeFilters = useMemo(() => {
    return Object.entries(selectedFilters).filter(([_, value]) => value);
  }, [selectedFilters]);

  const filterTypeDisplayName = useMemo(() => {
    return selectedFilterType ? selectedFilterType.toUpperCase() + "S" : "";
  }, [selectedFilterType]);

  return (
      <div className="w-full bg-white shadow-sm border-b border-gray-300">
        <div className="px-6 py-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {filterTypeDisplayName}
            </h2>

            <div className="flex items-center gap-3">
              <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium"
              >
                Reset All
              </button>
              <button
                  onClick={() => {
                    // Ensure manual click marks mount as complete so drawer closes
                    isInitialMount.current = false;
                    applyFilters();
                  }}
                  className="px-6 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-4 overflow-hidden">
          <div className="flex flex-col md:flex-row md:gap-4 md:overflow-x-auto hide-scrollbar md:pb-2 space-y-4 md:space-y-0">
            {/* Type Selector */}
            <div className="w-full md:w-48 md:flex-shrink-0">
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={selectedFilterType}
                  onChange={(e) => {
                    setSelectedFilterType(e.target.value);
                    setUserHasSelectedType(true);
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
                        className="w-full md:w-48 md:flex-shrink-0"
                        ref={(el) => (dropdownContainerRefs.current[filter] = el)}
                    >
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                        {filter.replace("_", " ")}
                      </label>
                      <button aria-label="Toggle filters"
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
                            <FaAngleUp className="text-gray-600 ml-2 flex-shrink-0" />
                        ) : (
                            <FaAngleDown className="text-gray-600 ml-2 flex-shrink-0" />
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
                <div className="w-full md:w-64 md:flex-shrink-0">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min || ""}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full md:w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">-</span>
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

        {Object.keys(selectedFilters).length > 0 && (
            <div className="px-4 md:px-6 pb-4">
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
                    <button aria-label="Toggle filters"
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
