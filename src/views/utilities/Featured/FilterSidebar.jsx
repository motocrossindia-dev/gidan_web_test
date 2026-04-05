'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";
import { useCategories } from "../../../hooks/useCategories";
import { FiFilter, FiSun, FiDroplet, FiMaximize, FiStar, FiInfo } from "react-icons/fi";
import axiosInstance from "../../../Axios/axiosInstance";
const API_URL = `/filters/filters_n/`;

const getOptionValue = (option, mainTypes = ['plant', 'pot', 'seed', 'plantcare', 'gift']) => {
  if (typeof option === "string") return option;
  if (option == null) return null;

  if (mainTypes.includes(String(option).toLowerCase())) return String(option).toLowerCase();

  // For flags, we need the "name" field (e.g., "is_featured") to pass to Boolean parameters
  if (option.name && option.name.startsWith("is_")) return option.name;
  return option.value != null ? option.value : (option.id != null ? option.id : option.name);
};

const DropdownMenu = ({ isOpen, filter, options, selectedFilters, handleFilterSelection, mainTypes = [] }) => {
  if (!isOpen) return null;

  const handleDropdownMouseDown = (e) => e.stopPropagation();

  return (
    <div
      className="absolute top-full left-0 mt-1 w-full min-w-[16rem] bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto z-[1000]"
      onMouseDown={handleDropdownMouseDown}
    >
      <div className="p-3 space-y-1">
        {Array.isArray(options) && options.length > 0 ? (
          options.map((option, idx) => {
            const optionValue = getOptionValue(option, mainTypes);

            const isSelected = selectedFilters[filter] === optionValue;

            return (
              <div
                key={option.id || idx}
                onClick={() => handleFilterSelection(filter, option)}
                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-green-100 text-bio-green" : "hover:bg-site-bg"
                  }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4 mr-3 text-bio-green" fill="currentColor" viewBox="0 0 20 20">
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

// The FLAG_MAP is now derived dynamically from initialFlags passed through props.

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
  setCategorySlug,
  setSubcategorySlug,
  setCategoryData,
  setCurrentFilterType,
  isSeasonalCollection,
  isTrending,
  isLatest,
  isFeatured,
  isBestSeller,
  categoryIdFromSlug,
  setFetchedCategoryName,
  setFetchedSubcategoryName,
  setIsSearching,
  initialFilterData = null,
  // SEO update props
  setSeoData,
  setIsSubcategorySEO,
  subcategoryList = [],  // full subcategory objects with sub_category_info from server
  setCurrentQuery,
  selectedPublicFlag,
  onSelectPublicFlag,
  isMobile = false,
  searchQuery = "", // Added for search page support
  isShop = false,
  initialFlags = [],
}) => {
  const isInitialMount = useRef(true);
  const userInteracted = useRef(false);
  const router = useRouter();
  const { data: categoryDataList = [] } = useCategories();

  const mainTypes = useMemo(() => {
    const types = categoryDataList.map(c => c.type?.toLowerCase()).filter(Boolean);
    return types.length > 0 ? types : ['plant', 'pot', 'seed', 'plantcare', 'gift'];
  }, [categoryDataList]);

  const typeToId = useMemo(() => {
    const map = {};
    categoryDataList.forEach(c => { if (c.type && c.id) map[c.type.toLowerCase()] = c.id; });
    return { ...map, 'gift': '' };
  }, [categoryDataList]);

  const typeToSlug = useMemo(() => {
    const map = {};
    categoryDataList.forEach(c => { if (c.type && c.slug) map[c.type.toLowerCase()] = c.slug; });
    return { ...map, 'gift': 'gifts' };
  }, [categoryDataList]);

  // Re-define dynamic Flag Map to replace the deprecated global constant
  const FLAG_MAP = useMemo(() => {
    const map = {
      is_featured: 2,
      is_latest: 3,
      is_best_seller: 4,
      is_seasonal_collection: 5,
      is_trending: 6
    };
    if (Array.isArray(initialFlags)) {
      initialFlags.forEach(f => {
        const key = f.filter_key || f.slug || f.name.toLowerCase().replace(/\s+/g, '_');
        if (key) map[key] = f.id;
      });
    }
    return map;
  }, [initialFlags]);

  const [selectedFilterType, setSelectedFilterType] = useState(typeKey || "");
  const [userHasSelectedType, setUserHasSelectedType] = useState(false);

  const [openFilters, setOpenFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [tempPriceRange, setTempPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState(initialFilterData || {});
  const [availableTypes, setAvailableTypes] = useState(initialFilterData?.available_types || []);
  const applyTimerRef = useRef(null);

  const flagToSlugMap = useMemo(() => {
    const baseMap = {
      2: 'featured',
      3: 'latest',
      4: 'bestseller',
      5: 'seasonal',
      6: 'trending'
    };

    // If the backend filters has flag_to_slug, use it
    if (filterData.flag_to_slug) return { ...baseMap, ...filterData.flag_to_slug };

    // Build from initialFlags if available
    if (Array.isArray(initialFlags) && initialFlags.length > 0) {
      const dynamicMap = {};
      initialFlags.forEach(f => {
        if (f.id && f.slug) dynamicMap[f.id] = f.slug;
        // Fallback slug mapping if f.slug is missing but name is available
        else if (f.id && f.name) {
          const lower = f.name.toLowerCase();
          if (lower.includes('featured')) dynamicMap[f.id] = 'featured';
          else if (lower.includes('latest')) dynamicMap[f.id] = 'latest';
          else if (lower.includes('best')) dynamicMap[f.id] = 'bestseller';
          else if (lower.includes('seasonal')) dynamicMap[f.id] = 'seasonal';
          else if (lower.includes('trending')) dynamicMap[f.id] = 'trending';
        }
      });
      return { ...baseMap, ...dynamicMap };
    }
    return baseMap;
  }, [filterData.flag_to_slug, initialFlags]);

  // Use Refs for data that applyFilters needs but shouldn't trigger its re-definition
  const filterDataRef = useRef(filterData);
  const subcategoryListRef = useRef(subcategoryList);

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(() => {
    subcategoryListRef.current = subcategoryList;
  }, [subcategoryList]);

  // Sync with initialFilterData and categoryId when props change during navigation
  useEffect(() => {
    if (initialFilterData && !userInteracted.current) {
      setFilterData(prev => {
        if (JSON.stringify(prev) === JSON.stringify(initialFilterData)) return prev;
        return initialFilterData;
      });
      setAvailableTypes(prev => {
        const types = initialFilterData.available_types || [];
        if (JSON.stringify(prev) === JSON.stringify(types)) return prev;
        return types;
      });

      // If the selected type is in the new available types, keep it, otherwise update it
      // For shop route, we allow empty type (all products)
      if (initialFilterData.available_types && !initialFilterData.available_types.includes(selectedFilterType) && !isShop) {
        const newType = initialFilterData.available_types[0] || "plant";
        setSelectedFilterType(newType);
      }
    }
  }, [initialFilterData, categoryId]);

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
    // If we've explicitly navigated to a URL with a path-based type (like /plants) or back to global /shop (typeKey null)
    if (!userInteracted.current) {
      if (typeKey && selectedFilterType !== typeKey) {
        setSelectedFilterType(typeKey);
        setUserHasSelectedType(true);
      } else if (typeKey === null && selectedFilterType !== "") {
        // Reset to "All Collection" when on the shop route
        setSelectedFilterType("");
        setUserHasSelectedType(false);
      }
    }
  }, [typeKey, selectedFilterType]);

  // Handle initial Type sync from category/slug (runs only before user interaction)
  const hasSyncedFromUrl = useRef(false);
  useEffect(() => {
    if (availableTypes.length > 0 && !userInteracted.current && !userHasSelectedType && !hasSyncedFromUrl.current) {
      // Normalize searchTerm and types (remove hyphens for comparison)
      const searchTerm = (category || categorySlug || "").toLowerCase().replace(/-/g, "");
      if (searchTerm) {
        const singular = searchTerm.endsWith("s") ? searchTerm.slice(0, -1) : searchTerm;
        const match = availableTypes.find((t) => {
          const tNormalized = t.toLowerCase().replace(/-/g, "");
          return tNormalized === searchTerm || tNormalized === singular;
        });

        // For the main shop route, if no specific category match, default to "All Collection" (empty string) 
        // instead of falling back to the first available type (e.g. pots)
        const finalType = match || (isShop ? "" : availableTypes[0]);

        if (finalType !== undefined && selectedFilterType !== finalType) {
          hasSyncedFromUrl.current = true;
          setSelectedFilterType(finalType);
        }
      }
    }
  }, [category, categorySlug, availableTypes, userHasSelectedType, selectedFilterType]);

  // ALWAYS re-fetch when type OR categoryId OR selectedFilters change for faceted search
  // Use JSON strings in dependencies for stable object/array comparison
  const selectedFiltersSync = useMemo(() => JSON.stringify(selectedFilters), [selectedFilters]);
  const priceRangeSync = useMemo(() => JSON.stringify(priceRange), [priceRange]);

  // ALWAYS re-fetch faceted options when type changes
  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedFilterType) {
        params.append("type", selectedFilterType);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      // Initial results fetch for faceted sidebars often need the base category
      if (categoryId && !userInteracted.current && categoryId !== "undefined") {
        params.append("category_id", String(categoryId));
      }

      const queryString = params.toString();
      const requestUrl = queryString ? `${API_URL}?${queryString}` : API_URL;

      const res = await axiosInstance.get(requestUrl);
      const filters = res.data?.filters || {};

      setFilterData(prev => {
        if (JSON.stringify(prev) === JSON.stringify(filters)) return prev;
        return filters;
      });

      if (filters.available_types && Array.isArray(filters.available_types)) {
        setAvailableTypes(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(filters.available_types)) {
            return filters.available_types;
          }
          return prev;
        });
      }
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        console.error("FilterSidebar fetchData error:", err);
      }
    }
  }, [selectedFilterType, searchQuery, categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Type change logic: switch to correct category_id based on type mapping
  const handleTypeChange = (newType) => {
    if (selectedFilterType === newType && newType !== "") return;


    // 1. Immediately update visual state
    setSelectedFilterType(newType);
    setUserHasSelectedType(true);
    userInteracted.current = true;

    // 2. Clear current filters
    setSelectedFilters({});
    setPriceRange({ min: "", max: "" });
    setTempPriceRange({ min: "", max: "" });
    setOpenFilters({});

    // 3. Force apply IMMEDIATELY for the new type
    applyFilters(newType);
  };

  const isFirstFlagSync = useRef(true);
  useEffect(() => {
    // Sync selectedPublicFlag prop change to mark as interaction if needed 
    if (selectedPublicFlag !== undefined) {
      // If the incoming flag change matches what's already in the URL, it's a mount/navigation sync, NOT a user interaction
      const currentUrlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
      const isUrlSync = Array.from(currentUrlParams.keys()).some(k => currentUrlParams.get(k) === "true");

      if (!isUrlSync) {
        userInteracted.current = true;
      }
    }
  }, [selectedPublicFlag]);

  // Preselect subcategory from URL (Only on first load when filter data arrives)
  const hasSyncedSubcat = useRef(false);
  useEffect(() => {
    if (filterData.subcategories && !userInteracted.current && !hasSyncedSubcat.current) {
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
        hasSyncedSubcat.current = true;
        setSelectedFilters((prev) => ({ ...prev, subcategories: found.id }));
      }
    }
  }, [filterData.subcategories, subcategoryID, subcategorySlug]);

  const handleFilterToggle = useCallback((filter) => {
    setOpenFilters((prev) => {
      const newState = { ...prev };
      newState[filter] = !prev[filter];
      return newState;
    });
  }, []);

  const handleApplyPrice = () => {
    userInteracted.current = true;
    setPriceRange(tempPriceRange);
  };

  const handleFilterSelection = useCallback((filter, option) => {
    // Store id for all object-based filters (subcategories, size, color, weights, etc.)
    const value = getOptionValue(option);

    setSelectedFilters((prev) => {
      const copy = { ...prev };
      if (copy[filter] === value) {
        delete copy[filter];
      } else {
        copy[filter] = value;
      }
      return copy;
    });

    userInteracted.current = true;
    setOpenFilters({});
  }, []);

  const applyFilters = useCallback(async (overriddenType = null) => {
    const finalType = overriddenType || selectedFilterType;
    if (setCurrentFilterType) {
      setCurrentFilterType(finalType);
    }

    // Build complete API params matching exact backend format
    const params = new URLSearchParams();

    params.append("type", finalType || "");
    // When the user switches the Type dropdown, the route's typeKey (from the URL) and the
    // selected type will differ — we call this a "type mismatch".
    const isTypeMismatch = typeKey && (finalType === "" || (finalType && finalType.toLowerCase() !== typeKey.toLowerCase()));

    // Ensure that if we are on a gift route and the user switches to another type,
    // we clear the category IDs to avoid showing products from different categories.
    const isGiftRoute = typeKey?.toLowerCase() === "gift" || window.location.pathname.includes("/gifts") || window.location.pathname.includes("/gift");
    const forceResetIds = isTypeMismatch || (isGiftRoute && finalType.toLowerCase() !== "gift");


    // Use available_types from API if it contains category_id mapping or just use the current type matching
    // If the API filters/filters_n/ doesn't provide explicit mapping, we keep a fallback or better, use 
    // the ids from the filterData if available (e.g. from subcategories)
    // Map types to IDs dynamically using the categories registry
    const typeToIdMap = typeToId;

    // Clear route IDs on type switch or when a search query is active so we search across all categories
    let baseCategoryId = categoryId || categoryIdFromSlug || "";
    if (baseCategoryId === "undefined" || baseCategoryId === "null") baseCategoryId = "";

    let finalCategoryId = (forceResetIds || searchQuery) ? "" : baseCategoryId;

    // If we're on a type change, default to the correct category ID for that type.
    if (isTypeMismatch && !forceResetIds) {
      finalCategoryId = typeToIdMap[finalType] || "";
    }

    // Start with route subcategory only when types match; user selection overrides below
    let finalSubcategoryId = forceResetIds ? "" : (subcategoryID || "");
    let finalSubcategorySlug = forceResetIds ? "" : (subcategorySlug || "");

    params.append("category_id", finalCategoryId || "");

    const filtersObj = JSON.parse(selectedFiltersSync);
    // Always apply user-selected subcategory regardless of type mismatch.
    // filterData.subcategories holds the live list for the currently selected type,
    // so a lookup here works even when the route subcategoryList is for a different type.
    if ("subcategories" in filtersObj) {
      finalSubcategoryId = filtersObj.subcategories || "";
      if (finalSubcategoryId) {
        // Look up in the live filter data (works for switched types)
        const selectedSubcat = filterDataRef.current?.subcategories?.find(s => s.id == finalSubcategoryId);
        finalSubcategorySlug = selectedSubcat
          ? (selectedSubcat.slug || selectedSubcat.subcategory_slug || selectedSubcat.name?.toLowerCase().replace(/\s+/g, '-'))
          : "";
      } else {
        finalSubcategorySlug = "";
      }
    }
    params.append("subcategory_id", finalSubcategoryId);

    // Search query preservation
    params.append("search", searchQuery || "");

    const pr = JSON.parse(priceRangeSync);
    // Price range
    params.append("min_price", pr.min || "");
    params.append("max_price", pr.max || "");

    // All filter IDs (send value or empty string)
    // We check both singular and plural versions of keys to handle inconsistent backend data
    params.append("color_id", filtersObj.color || filtersObj.colors || "");
    params.append("size_id", filtersObj.size || filtersObj.sizes || "");
    params.append("planter_size_id", filtersObj.planter_size || filtersObj.planter_sizes || "");
    params.append("planter_id", filtersObj.planter || filtersObj.planters || "");
    params.append("weight_id", filtersObj.weight || filtersObj.weights || "");
    params.append("pot_type_id", filtersObj.pot_type || filtersObj.pot_types || "");
    params.append("litre_id", filtersObj.litre || filtersObj.litres || "");

    // Standardizing to singular keys for better backend compatibility
    params.append("space_and_light_id", filtersObj.space_and_light || filtersObj.space_and_lights || "");
    params.append("special_filter_id", filtersObj.special_filter || filtersObj.special_filters || "");
    params.append("care_guide_id", filtersObj.care_guide || filtersObj.care_guides || "");

    // min_rating handling (ensure only numeric value is sent)
    params.append("min_rating", filtersObj.rating_option || filtersObj.rating_options || "");

    // Prioritize selectedPublicFlag prop from Parent component
    const effectiveFlag = selectedPublicFlag || filtersObj.flags || "";
    params.append("flag", effectiveFlag);

    // Boolean flags mapping (mapping numeric IDs from flags data to Boolean params)
    const selectedFlag = Number(effectiveFlag);

    // Dynamically append all collection flags based on active context (URL query params OR sidebar selection)
    if (Array.isArray(initialFlags) && initialFlags.length > 0) {
      initialFlags.forEach(f => {
        const keys = [f.filter_key, f.slug, f.name].filter(Boolean);
        const isUrlMatch = keys.some(k => (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search)).get(k) === 'true' : false));
        const isManualMatch = selectedFlag === f.id;

        if (isUrlMatch || isManualMatch) {
          // Use the first valid key (usually filter_key or name) for the boolean parameter
          const flagKey = keys.find(k => k.startsWith('is_')) || keys[0];
          params.append(flagKey, "true");
        }
      });
    } else {
      // Legacy fallback for hardcoded flags if initialFlags data isn't loaded yet
      params.append("is_featured", (selectedFlag === FLAG_MAP.is_featured || isFeatured) ? "true" : "unknown");
      params.append("is_best_seller", (selectedFlag === FLAG_MAP.is_best_seller || isBestSeller) ? "true" : "unknown");
      params.append("is_seasonal_collection", (selectedFlag === FLAG_MAP.is_seasonal_collection || isSeasonalCollection) ? "true" : "unknown");
      params.append("is_trending", (selectedFlag === FLAG_MAP.is_trending || isTrending) ? "true" : "unknown");
      params.append("is_latest", (selectedFlag === FLAG_MAP.is_latest || isLatest) ? "true" : "unknown");
    }


    // Ordering (empty for now)
    params.append("ordering", "");

    // Ordering (empty for now)
    params.append("ordering", "");

    const categorySegment = selectedFilterType ? (typeToSlug[selectedFilterType] || selectedFilterType) : "shop";

    const activeFlagSlug = flagToSlugMap[selectedFlag];

    const hasActiveDiscovery = isSeasonalCollection || isTrending || isFeatured || isBestSeller || selectedPublicFlag ||
      (Array.isArray(initialFlags) && initialFlags.some(f => {
        const keys = [f.filter_key, f.slug, f.name].filter(Boolean);
        return keys.some(k => (new URLSearchParams(window.location.search)).get(k) === 'true');
      }));

    // Safety check: if there are ANY query parameters at all, we should probably not force-reset the path to /shop/
    const hasAnyQuery = typeof window !== 'undefined' && window.location.search.length > 1;

    // Always synchronize the URL path to reflect the current category context while preserving discovery flags
    let newUrlBase = `/${categorySegment}`;
    if (selectedFilterType && finalSubcategorySlug) {
      newUrlBase += `/${finalSubcategorySlug}`;
    }
    // Ensure trailing slash
    if (!newUrlBase.endsWith('/')) newUrlBase += '/';

    const currentParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
    const finalParams = new URLSearchParams();

    // Preserve search query if active
    if (searchQuery) finalParams.set('query', searchQuery);

    // Preserve ALL active discovery flags from the current URL
    if (Array.isArray(initialFlags)) {
      initialFlags.forEach(f => {
        const keys = [f.filter_key, f.slug, f.name].filter(Boolean);
        keys.forEach(k => {
          if (currentParams.get(k) === 'true') finalParams.set(k, 'true');
        });
      });
    }

    const newQueryString = finalParams.toString();
    const newFullUrl = newUrlBase + (newQueryString ? `?${newQueryString}` : "");

    if (typeof window !== 'undefined' && (window.location.pathname !== newUrlBase || window.location.search !== (newQueryString ? `?${newQueryString}` : ""))) {
      // Use replaceState for fluid navigation that doesn't clutter history during discovery
      window.history.replaceState(null, '', newFullUrl);
      // Notify other URL-aware components like breadcrumbs
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    try {
      if (setIsSearching) setIsSearching(true);

      // Clear old metadata if we're jumping types to prevent stale header info
      if (isTypeMismatch) {
        if (setFetchedCategoryName) setFetchedCategoryName(null);
        if (setFetchedSubcategoryName) setFetchedSubcategoryName(null);
        if (setCategoryData) setCategoryData(null);
      }

      params.append("page_size", "12");
      if (setFetchedCategoryName && !finalSubcategoryId) {
        // Fallback for main category name update during type switch
        const catName = categorySegment.charAt(0).toUpperCase() + categorySegment.slice(1).replace(/-/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        setFetchedCategoryName(catName);
      }

      if (setCategorySlug) setCategorySlug(categorySegment);
      if (setSubcategorySlug) setSubcategorySlug(finalSubcategorySlug);

      const requestUrl = `/filters/main_productsFilter/?${params.toString()}`;
      const res = await axiosInstance.get(requestUrl);

      if (setCurrentQuery) setCurrentQuery(params.toString());
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

      // RESET interaction flag after a successful apply to prevent URL-driven re-renders from looping
      // We use a small timeout to ensure the current render cycle completes
      setTimeout(() => {
        userInteracted.current = false;
      }, 100);

      const parentCatInfo = res.data?.category_info || null;
      const parentSubcatInfo = res.data?.subcategory_info || null;
      const nestedCatInfo = parentCatInfo?.category_info || parentCatInfo;
      const activeInfo = parentSubcatInfo || nestedCatInfo;

      if (setCategoryData) {
        setCategoryData(activeInfo);
      }

      // Update SEO directly from same API call — no extra requests
      if (setSeoData && activeInfo) {
        const parentObj = finalSubcategoryId ? parentSubcatInfo : parentCatInfo;

        if (finalSubcategoryId) {
          // Subcategory selected logic
          const matchedSub =
            subcategoryListRef.current?.find(s => s.id == finalSubcategoryId) ||
            filterDataRef.current?.subcategories?.find(s => s.id == finalSubcategoryId);

          const buildSubSeoData = (name, info = {}) => ({
            ...info,
            title: info.title || name,
            subtitle: info.subtitle || `${name} - Buy Online in India from Gidan.store`,
            description: info.description || info.intro_text || info.content || "",
            sections: info.sections || (parentObj?.sections || []),
            info_cards: info.info_cards || (parentObj?.info_cards || [])
          });

          if (matchedSub?.sub_category_info?.description || matchedSub?.sub_category_info?.sections?.length) {
            setSeoData(buildSubSeoData(matchedSub.name, matchedSub.sub_category_info));
            if (setIsSubcategorySEO) setIsSubcategorySEO(true);
          } else if (activeInfo?.subcategory_name && (activeInfo?.description || activeInfo?.intro_text || activeInfo?.sections?.length)) {
            setSeoData(buildSubSeoData(activeInfo.subcategory_name, activeInfo));
            if (setIsSubcategorySEO) setIsSubcategorySEO(true);
          } else {
            const subName = matchedSub?.name || activeInfo?.subcategory_name || "";
            setSeoData(buildSubSeoData(subName, matchedSub?.sub_category_info || {}));
            if (setIsSubcategorySEO) setIsSubcategorySEO(true);

            if (finalSubcategorySlug && categorySegment) {
              const endpoint = categorySegment === 'offers' ? '/product/offerProducts/' : `/category/categoryWiseSubCategory/${categorySegment}/`;
              axiosInstance
                .get(endpoint)
                .then(subRes => {
                  const subcats = subRes.data?.data?.subCategorys || subRes.data?.products || [];
                  const found = subcats.find(s => s.slug === finalSubcategorySlug || s.id == finalSubcategoryId);
                  if (found) {
                    setSeoData(buildSubSeoData(found.name, found.sub_category_info || {}));
                    if (setFetchedSubcategoryName) setFetchedSubcategoryName(found.name);
                  }
                })
                .catch(() => { });
            }
          }
        } else {
          // No subcategory — category level
          setSeoData({
            ...activeInfo,
            // Ensure info_cards are pulled from parent level if missing in detailed nested block
            info_cards: (activeInfo.info_cards && activeInfo.info_cards.length > 0)
              ? activeInfo.info_cards
              : (parentCatInfo?.info_cards || []),
            sections: (activeInfo.sections && activeInfo.sections.length > 0)
              ? activeInfo.sections
              : (parentCatInfo?.sections || [])
          });
          if (setIsSubcategorySEO) setIsSubcategorySEO(false);
        }
      }

      const activeName = activeInfo?.name || activeInfo?.title || activeInfo?.category_name || (finalSubcategoryId ? activeInfo?.subcategory_name : "");

      if (setFetchedCategoryName) {
        if (!finalSubcategoryId && activeName) {
          setFetchedCategoryName(activeName);
        } else if (activeInfo?.category_name) {
          setFetchedCategoryName(activeInfo.category_name);
        }
      }

      if (setFetchedSubcategoryName) {
        setFetchedSubcategoryName(finalSubcategoryId ? activeName : null);
      }

      setOpenFilters({});
      // Only close the mobile drawer if we are NOT on the initial mount
      if (setShowMobileFilter && !isInitialMount.current) {
        setShowMobileFilter(false);
      }
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        console.error("Filter apply error:", err);
      }
    } finally {
      if (setIsSearching) setIsSearching(false);
    }
  }, [
    selectedFilterType,
    categoryId,
    categoryIdFromSlug,
    subcategoryID,
    subcategorySlug,
    selectedFiltersSync,
    priceRangeSync,
    setCurrentFilterType,
    setResults,
    setProducts,
    setFiltersApplied,
    setCategoryData,
    setShowMobileFilter,
    isSeasonalCollection,
    isTrending,
    isLatest,
    isFeatured,
    isBestSeller,


    setIsSearching,
    setFetchedCategoryName,
    setFetchedSubcategoryName,
    setSeoData,
    setIsSubcategorySEO,
    typeKey,
    selectedPublicFlag,
    searchQuery,
    flagToSlugMap
  ]);

  // AUTO-APPLY: whenever selectedFilters, selectedFilterType, or priceRange changes after user interaction, apply immediately
  useEffect(() => {
    if (!userInteracted.current) return;
    // Debounce slightly to batch rapid changes - set to 500ms for responsiveness
    const timer = setTimeout(() => {
      isInitialMount.current = false;
      applyFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedFiltersSync, selectedFilterType, priceRangeSync, selectedPublicFlag, searchQuery, applyFilters]);

  // AUTO-APPLY LOGIC for ID-based navigation (Legacy support)
  useEffect(() => {
    // If we are on a slug-based route, PlantFilter tracks the initial state.
    // If identifying as a direct interactive change, applyFilters handles it.
    // We only trigger THIS effect for mount-time resolution when slugs are NOT present.
    if (categorySlug || subcategorySlug || userInteracted.current) return;

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
    // We no longer reset currentFilterType to null, as it should stay on the current category context.
    if (setSelectedPublicFlag) {
      setSelectedPublicFlag(null);
    }

    // Clear filters from URL while preserving the base context (search page query/type)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      // We explicitly clear the "search" query from the URL if it was previously present
      url.searchParams.delete('query');

      // We remove specific faceted filters but keep the "type" if we are on the search page
      // On category routes, the type is part of the path, so this is safe.
      const filtersToClear = ['color_id', 'size_id', 'min_price', 'max_price', 'planter_size_id', 'planter_id', 'weight_id', 'pot_type_id', 'litre_id', 'space_and_light_id', 'special_filter_id', 'care_guide_id', 'min_rating', 'flag'];
      filtersToClear.forEach(f => url.searchParams.delete(f));

      window.history.replaceState(null, '', url.pathname + url.search);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    // Re-fetch unfiltered products using complete API format
    try {
      const params = new URLSearchParams();
      // Use strictly the route context for reset so breadcrumb and data revert to default
      const finalCategoryId = categoryId || categoryIdFromSlug || "";
      const finalSubcategoryId = subcategoryID || "";

      params.append("type", selectedFilterType || typeKey || "");
      params.append("category_id", finalCategoryId);
      params.append("subcategory_id", finalSubcategoryId);
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
      params.append("is_latest", isLatest ? "true" : "unknown");
      params.append("ordering", "");


      const res = await axiosInstance.get(`/filters/main_productsFilter/?${params}&page_size=12`);
      if (setCurrentQuery) setCurrentQuery(params.toString());
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
      if (setSeoData) {
        setSeoData(res.data?.category_info?.category_info || null);
      }
      if (setIsSubcategorySEO) {
        setIsSubcategorySEO(false);
      }

    } catch (err) {
      console.error("Reset filters fetch error:", err);
    }
  }, [setFiltersApplied, selectedFilterType, categoryId, categoryIdFromSlug, subcategoryID, setResults, setProducts, setCategoryData, setSeoData, setIsSubcategorySEO, isSeasonalCollection, isTrending, isLatest, isFeatured, isBestSeller, typeKey]);


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

  const renderFilterSection = (filter, options) => {
    if (!Array.isArray(options) || options.length === 0 || filter === "flags") return null;

    const filterIcons = {
      space_and_light: <FiSun className="mr-2 text-amber-500 transition-transform hover:scale-110" />,
      care_guides: <FiDroplet className="mr-2 text-blue-400 transition-transform hover:scale-110" />,
      special_filters: <FiStar className="mr-2 text-emerald-500 transition-transform hover:scale-110" />,
      planter_size: <FiMaximize className="mr-2 text-purple-500 transition-transform hover:scale-110" />,
      rating_options: <FiStar className="mr-2 text-yellow-500 transition-transform hover:scale-110" />,
      subcategories: <FiFilter className="mr-2 text-[#375421] transition-transform hover:scale-110" />,
    };

    // Correctly replace all underscores for clean labels (e.g. SPACE_AND_LIGHT -> SPACE AND LIGHT)
    const label = (filter === "care_guides" || filter === "space_and_light" || filter === "special_filters" || filter === "rating_options")
      ? filter.replace(/_/g, " ").toUpperCase()
      : (filter === "subcategories" ? "CATEGORIES" : filter.replace(/_/g, " ").toUpperCase());

    return (
      <div key={filter} className="mb-8 last:mb-0 group/section">
        <div className="flex items-center mb-4">
          {filterIcons[filter] || <div className="w-1.5 h-1.5 rounded-full bg-[#375421] mr-3 opacity-40 group-hover/section:opacity-100 transition-opacity" />}
          <h3 className="text-gray-900 font-extrabold text-[11px] tracking-[0.15em] uppercase opacity-70 group-hover/section:opacity-100 transition-opacity">{label}</h3>
        </div>

        {options.length > 6 ? (
          /* Dropdown for > 6 options (Standard for Color, Planter Size) */
          <div
            className="relative group"
            ref={(el) => (dropdownContainerRefs.current[filter] = el)}
          >
            <button
              ref={(el) => (dropdownButtonRefs.current[filter] = el)}
              onClick={() => handleFilterToggle(filter)}
              className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl text-xs font-bold bg-white hover:border-[#375421] transition-all shadow-sm"
            >
              <span className="truncate text-gray-700">
                {selectedFilters[filter]
                  ? getDisplayName(filter, selectedFilters[filter])
                  : `SELECT ${filter.replace(/_/g, " ").toUpperCase()}`}
              </span>
              <div className={`transition-transform duration-300 ${openFilters[filter] ? 'rotate-180' : ''}`}>
                <FaAngleDown className="text-gray-400" />
              </div>
            </button>

            {openFilters[filter] && (
              <div className="absolute z-[110] left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-1 scrollbar-thin scrollbar-thumb-gray-200">
                {options.map((option, idx) => {
                  const value = getOptionValue(option, mainTypes);
                  const isSelected = selectedFilters[filter] === value;
                  return (
                    <div
                      key={option.id || idx}
                      onClick={() => handleFilterSelection(filter, option)}
                      className={`px-3 py-2 text-xs cursor-pointer rounded-md transition-colors flex items-center justify-between ${isSelected ? "bg-green-50 text-[#375421] font-bold" : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <span className="truncate">{typeof option === "string" ? option : option.name || option.title}</span>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#375421]" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Tag list for <= 6 options (Space and Light, Special Filters, Care Guides etc.) */
          <div className="flex flex-wrap gap-2">
            {options.map((option, idx) => {
              const value = getOptionValue(option, mainTypes);
              const isSelected = selectedFilters[filter] === value;
              const rawLabel = typeof option === "string" ? option : option.name || option.title || option.label;
              const labelText = rawLabel === "Climate testeds" ? "Climate Tested" : rawLabel;

              return (
                <button
                  key={option.id || idx}
                  onClick={() => handleFilterSelection(filter, option)}
                  className={`px-4 py-2 rounded-full border text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${isSelected
                    ? "bg-[#375421] text-white border-[#375421] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#375421] hover:bg-green-50/30 hover:text-[#375421]"
                    }`}
                >
                  {filter === "rating_options" ? (
                    <div className="flex items-center gap-1">
                      <span>{value}</span>
                      <svg className={`w-3.5 h-3.5 ${isSelected ? "fill-white" : "fill-yellow-500"}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {value < 5 && <span className="text-[9px] opacity-80">& UP</span>}
                    </div>
                  ) : labelText}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="w-full bg-white flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={resetFilters} className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              CLEAR ALL
            </button>
          </div>

          {/* Type Selector Mobile */}
          <div className="mb-6">
            <h3 className="text-gray-900 font-bold mb-4">Type</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeChange("")}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${!selectedFilterType
                  ? "bg-[#375421] text-white border-[#375421] shadow-md"
                  : "bg-white text-gray-700 border-gray-200"
                  }`}
              >
                All Collection
              </button>
              {availableTypes.map((type) => {
                const isSelected = selectedFilterType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${isSelected
                      ? "bg-[#375421] text-white border-[#375421] shadow-md"
                      : "bg-white text-gray-700 border-gray-200"
                      }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collections (Public Flags) Mobile */}
          {Array.isArray(initialFlags) && initialFlags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-900 font-bold mb-4">Collections</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectPublicFlag(null)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${!selectedPublicFlag
                    ? "bg-[#375421] text-white border-[#375421] shadow-md"
                    : "bg-white text-gray-700 border-gray-200"
                    }`}
                >
                  All Items
                </button>
                {initialFlags.map((flag) => {
                  const isSelected = selectedPublicFlag === flag.id;
                  return (
                    <button
                      key={flag.id}
                      onClick={() => onSelectPublicFlag(flag.id)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${isSelected
                        ? "bg-[#375421] text-white border-[#375421] shadow-md"
                        : "bg-white text-gray-700 border-gray-200"
                        }`}
                    >
                      {flag.label || flag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-gray-900 font-bold mb-4">Price Range</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="0"
                value={tempPriceRange.min}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}
                className="flex-1 border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#375421]"
              />
              <input
                type="number"
                placeholder="10000"
                value={tempPriceRange.max}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}
                className="flex-1 border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#375421]"
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className="w-full bg-[#375421] text-white font-bold py-3 rounded-lg hover:bg-[#2d451b] transition-colors"
            >
              APPLY PRICE FILTER
            </button>
          </div>

          {Object.entries(filterData)
            .filter(([k]) => k !== "available_types" && k !== "price")
            .map(([filter, options]) => renderFilterSection(filter, options))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={resetFilters} className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            CLEAR ALL
          </button>
        </div>

        {/* Type Selector Desktop */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-bold mb-4 text-sm">Type</h3>
          <div className="flex flex-wrap gap-2">
            {/* Manual 'All Collection' option */}
            <button
              onClick={() => handleTypeChange("")}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${!selectedFilterType
                ? "bg-[#375421] text-white border-[#375421] shadow-sm transform scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#375421]"
                }`}
            >
              All Collection
            </button>
            {availableTypes.map((type) => {
              const isSelected = selectedFilterType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${isSelected
                    ? "bg-[#375421] text-white border-[#375421] shadow-sm transform scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#375421]"
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-bold mb-4 text-sm">Price Range</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="0"
              value={tempPriceRange.min}
              onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}
              className="w-1/2 border rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#375421]"
            />
            <input
              type="number"
              placeholder="10000"
              value={tempPriceRange.max}
              onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}
              className="w-1/2 border rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#375421]"
            />
          </div>
          <button
            onClick={handleApplyPrice}
            className="w-full bg-[#375421] text-white font-bold py-2 rounded-lg text-xs hover:bg-[#2d451b] transition-colors"
          >
            APPLY PRICE FILTER
          </button>
        </div>

        {/* Dynamic Filters */}
        {Object.entries(filterData)
          .filter(([k]) => k !== "available_types" && k !== "price")
          .map(([filter, options]) => renderFilterSection(filter, options))}
      </div>
    </div>
  );
};

export default FilterSidebar;

