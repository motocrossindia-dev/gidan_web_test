'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axiosInstance from "../../../Axios/axiosInstance";
const API_URL = `/filters/filters_n/`;
const getOptionValue = (option) => {
  if (typeof option === "string") return option;
  return option.id != null ? option.id : option.name;
};

const DropdownMenu = ({ isOpen, filter, options, selectedFilters, handleFilterSelection }) => {
  if (!isOpen) return null;

  const handleDropdownMouseDown = (e) => e.stopPropagation();

  return (
    <div
      className="absolute top-full left-0 mt-1 w-full min-w-[16rem] bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto z-[10001]"
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
                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50"
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
    </div>
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
  isBestSeller,
  categoryIdFromSlug,
  setFetchedCategoryName,
  setFetchedSubcategoryName,
  setIsSearching,
  initialFilterData = null
}) => {
  // Track if this is the very first render of the component
  const isInitialMount = useRef(true);
  // Track whether user has interacted with filters (to avoid auto-apply on mount)
  const userInteracted = useRef(false);
  const router = useRouter();

  const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "plant");
  const [userHasSelectedType, setUserHasSelectedType] = useState(false);

  const [openFilters, setOpenFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState(initialFilterData || {});
  const [availableTypes, setAvailableTypes] = useState(initialFilterData?.available_types || []);

  const dropdownButtonRefs = useRef({});
  const dropdownContainerRefs = useRef({});

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(
    (event) => {
      const hasOpenDropdowns = Object.values(openFilters).some(Boolean);
      if (!hasOpenDropdowns) return;

      const isInside = Object.keys(openFilters).some((filter) => {
        const container = dropdownContainerRefs.current[filter];
        return container && container.contains(event.target);
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
    // If we have initialFilterData and its type matches our selected type, skip the first fetch
    if (initialFilterData && filterData.available_types && selectedFilterType) {
      // Simple heuristic: if we already have data for this type, don't re-fetch immediately on mount
      // However, we want to allow re-fetching if the type changes later.
      if (isInitialMount.current && availableTypes.includes(selectedFilterType)) {
        return;
      }
    }

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

    // Mark that user has interacted so auto-apply kicks in
    userInteracted.current = true;

    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: prev[filter] === value ? null : value,
    }));
    setOpenFilters({});
  }, []);

  const applyFilters = useCallback(async () => {
    if (setCurrentFilterType) {
      setCurrentFilterType(selectedFilterType);
    }

    // Build complete API params matching exact backend format
    const params = new URLSearchParams();

    params.append("type", selectedFilterType || "");
    params.append("category_id", categoryId || categoryIdFromSlug || "");

    // Subcategory ID
    let finalSubcategoryId = subcategoryID || "";
    let finalSubcategorySlug = subcategorySlug || "";

    if ("subcategories" in selectedFilters) {
      finalSubcategoryId = selectedFilters.subcategories || "";
      if (finalSubcategoryId) {
        const selectedSubcat = filterData.subcategories?.find(s => s.id === finalSubcategoryId);
        finalSubcategorySlug = selectedSubcat ? (selectedSubcat.slug || selectedSubcat.subcategory_slug || selectedSubcat.name?.toLowerCase().replace(/\s+/g, '-')) : "";
      } else {
        finalSubcategorySlug = "";
      }
    }
    params.append("subcategory_id", finalSubcategoryId);

    // Search (always empty for now)
    params.append("search", "");

    // Price range
    params.append("min_price", priceRange.min || "");
    params.append("max_price", priceRange.max || "");

    // All filter IDs (send value or empty string)
    params.append("color_id", selectedFilters.color || "");
    params.append("size_id", selectedFilters.size || "");
    params.append("planter_size_id", selectedFilters.planter_size || "");
    params.append("planter_id", selectedFilters.planter || "");
    params.append("weight_id", selectedFilters.weights || "");
    params.append("pot_type_id", selectedFilters.pot_type || "");
    params.append("litre_id", selectedFilters.litre || "");

    // Boolean flags (always send - use "true"/"unknown")
    params.append("is_featured", isFeatured ? "true" : "unknown");
    params.append("is_best_seller", isBestSeller ? "true" : "unknown");
    params.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
    params.append("is_trending", isTrending ? "true" : "unknown");

    // Ordering (empty for now)
    params.append("ordering", "");

    const typeToSlug = {
      'pot': 'pots',
      'plant': 'plants',
      'seed': 'seeds',
      'plantcare': 'plant-care'
    };

    // Update URL visually only if we are applying a standard category filter and slugs have changed
    if (selectedFilterType && !isSeasonalCollection && !isTrending && !isFeatured && !isBestSeller) {
      const categorySegment = typeToSlug[selectedFilterType] || selectedFilterType;
      let newUrl = `/${categorySegment}`;
      if (finalSubcategorySlug) {
        newUrl += `/${finalSubcategorySlug}`;
      }

      if (window.location.pathname !== newUrl) {
        // Use replaceState to avoid cluttering history if filters are tweaked rapidly
        window.history.replaceState(null, '', newUrl);
      }
    }

    try {
      if (setIsSearching) setIsSearching(true);
      const res = await axiosInstance.get(`/filters/main_productsFilter/?${params}&page_size=100`);
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

      const catInfo = res.data?.category_info?.category_info || null;
      if (setCategoryData) {
        setCategoryData(catInfo);
      }
      if (setFetchedCategoryName && catInfo?.category_name) {
        setFetchedCategoryName(catInfo.category_name);
      }
      if (setFetchedSubcategoryName) {
        setFetchedSubcategoryName(catInfo?.subcategory_name || null);
      }

      setOpenFilters({});
      // Only close the mobile drawer if we are NOT on the initial mount
      if (setShowMobileFilter && !isInitialMount.current) {
        setShowMobileFilter(false);
      }
    } catch (err) {
      console.error("Filter apply error:", err);
    } finally {
      if (setIsSearching) setIsSearching(false);
    }
  }, [selectedFilterType, categoryId, categoryIdFromSlug, subcategoryID, subcategorySlug, selectedFilters, priceRange, filterData, setCurrentFilterType, setResults, setProducts, setFiltersApplied, setCategoryData, setShowMobileFilter, isSeasonalCollection, isTrending, isFeatured, isBestSeller, setIsSearching]);

  // AUTO-APPLY: whenever selectedFilters, selectedFilterType, or priceRange changes after user interaction, apply immediately
  useEffect(() => {
    if (!userInteracted.current) return;
    // Debounce slightly to batch rapid changes - lowered to 400ms for snappier response
    const timer = setTimeout(() => {
      isInitialMount.current = false;
      applyFilters();
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedFilters, selectedFilterType, priceRange, applyFilters]);

  // AUTO-APPLY LOGIC for ID-based navigation (Legacy support)
  useEffect(() => {
    // If we are on a slug-based route, PlantFilter tracks the initial state.
    // If identifying as a direct interactive change, applyFilters handles it.
    // We only trigger THIS effect for mount-time resolution when slugs are NOT present.
    if (categorySlug || subcategorySlug) return;

    if (selectedFilterType && (categoryId || subcategoryID)) {
      // We call applyFilters but ensure it doesn't close the drawer immediately
      applyFilters().then(() => {
        // Mark initial mount as complete AFTER the first auto-apply
        if (isInitialMount.current) {
          isInitialMount.current = false;
        }
      });
    }
  }, [categoryId, subcategoryID, categorySlug, subcategorySlug, applyFilters]); // Added slugs and applyFilters to deps for stability

  const resetFilters = useCallback(async () => {
    userInteracted.current = false; // prevent auto-apply from stale state
    setSelectedFilters({});
    setPriceRange({ min: "", max: "" });
    setOpenFilters({});
    if (setFiltersApplied) setFiltersApplied(false);
    if (setCurrentFilterType) {
      setCurrentFilterType(null);
    }

    // Re-fetch unfiltered products using complete API format
    try {
      const params = new URLSearchParams();

      params.append("type", selectedFilterType || "");
      params.append("category_id", categoryId || categoryIdFromSlug || "");
      params.append("subcategory_id", subcategoryID || "");
      params.append("search", "");
      params.append("min_price", "");
      params.append("max_price", "");
      params.append("color_id", "");
      params.append("size_id", "");
      params.append("planter_size_id", "");
      params.append("planter_id", "");
      params.append("weight_id", "");
      params.append("pot_type_id", "");
      params.append("litre_id", "");
      params.append("is_featured", isFeatured ? "true" : "unknown");
      params.append("is_best_seller", isBestSeller ? "true" : "unknown");
      params.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
      params.append("is_trending", isTrending ? "true" : "unknown");
      params.append("ordering", "");

      const res = await axiosInstance.get(`/filters/main_productsFilter/?${params}&page_size=100`);
      if (setResults) setResults(res.data.results || []);
      if (setProducts) {
        setProducts({
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
        });
      }
      if (setCategoryData) {
        setCategoryData(res.data?.category_info?.category_info || null);
      }
    } catch (err) {
      console.error("Reset filters fetch error:", err);
    }
  }, [setFiltersApplied, setCurrentFilterType, selectedFilterType, categoryId, categoryIdFromSlug, subcategoryID, setResults, setProducts, setCategoryData, isSeasonalCollection, isTrending, isFeatured, isBestSeller]);

  const removeFilter = useCallback((filter, value) => {
    userInteracted.current = true; // trigger auto-apply after removal
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
    <div className="w-full bg-white shadow-sm border-b border-gray-300 relative z-40">
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

      <div className="px-4 md:px-6 py-4 w-full relative z-50">
        <div className="flex flex-col md:flex-row md:gap-4 flex-wrap pb-4 space-y-4 md:space-y-0">
          {/* Type Selector */}
          <div className="w-full md:w-48 md:flex-shrink-0 z-50">
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={selectedFilterType}
              onChange={(e) => {
                let value = e.target.value;
                // Normalize to singular
                if (value.endsWith('s')) value = value.slice(0, -1);
                setSelectedFilterType(value);
                setUserHasSelectedType(true);
                userInteracted.current = true; // Trigger auto-apply
                setSelectedFilters((prev) => ({ ...prev, subcategories: undefined })); // Clear subcategory
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
                className={`relative w-full md:w-48 md:flex-shrink-0 ${openFilters[filter] ? "z-[100]" : "z-50"}`}
                ref={(el) => (dropdownContainerRefs.current[filter] = el)}
              >
                <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                  {filter.replace("_", " ")}
                </label>
                <button aria-label="Toggle filters"
                  ref={(el) => (dropdownButtonRefs.current[filter] = el)}
                  onClick={() => {
                    handleFilterToggle(filter);
                    if (filter === "subcategories"); // Trigger auto-apply for subcategory
                  }}
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

                <DropdownMenu
                  isOpen={openFilters[filter]}
                  filter={filter}
                  options={options}
                  selectedFilters={selectedFilters}
                  handleFilterSelection={handleFilterSelection}
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
                  onChange={(e) => {
                    userInteracted.current = true;
                    setPriceRange({ ...priceRange, min: e.target.value });
                  }}
                  className="w-full md:w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ""}
                  onChange={(e) => {
                    userInteracted.current = true;
                    setPriceRange({ ...priceRange, max: e.target.value });
                  }}
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
