import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const API_URL = `${process.env.REACT_APP_API_URL}/filters/filters/`;

const FilterSidebar = ({ setResults, setShowMobileFilter, categoryId, category, subcategory }) => {
  const [selectedFilterType, setSelectedFilterType] = useState("plant");
  const [openFilters, setOpenFilters] = useState({
    subcategories: !!subcategory // automatically open if subcategory exists
  });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterData, setFilterData] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);

  // Sync subcategory prop with selectedFilters, ensure it's an array for checkbox
  useEffect(() => {
    if (filterData.subcategories && subcategory) {
      // Normalize both the incoming subcategory and filter options for comparison
      const normalizedSubcategory = subcategory.toLowerCase().replace(/-/g, ' ');

      const matchedOption = filterData.subcategories.find(
          (option) => option.toLowerCase().replace(/-/g, ' ') === normalizedSubcategory
      );

      setSelectedFilters((prev) => {
        const copy = { ...prev };
        if (matchedOption) {
          copy.subcategories = [matchedOption]; // Use the exact option from filterData
        } else {
          delete copy.subcategories;
        }
        return copy;
      });
    }
  }, [filterData.subcategories, subcategory]);
  // Set selected filter type based on category and availableTypes
  useEffect(() => {
    if (category && availableTypes.length > 0) {
      const matchedType = availableTypes.find(
          (type) =>
              category.toLowerCase().includes(type.toLowerCase()) ||
              type.toLowerCase().includes(category.toLowerCase())
      );

      if (matchedType) {
        setSelectedFilterType(matchedType);
      } else {
        setSelectedFilterType("plant");
      }
    }
  }, [category, availableTypes]);

  // Fetch filters data when selectedFilterType changes
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(
            `${API_URL}?type=${selectedFilterType}&category_id=${categoryId}`
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
      const updatedSelections = currentSelections.includes(option)
          ? currentSelections.filter((item) => item !== option)
          : [...currentSelections, option];
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

    Object.entries(selectedFilters).forEach(([filter, values]) => {
      if (values.length > 0) {
        queryParams.append(filter, values.join(","));
      }
    });

    if (priceRange.min) queryParams.append("price_min", priceRange.min);
    if (priceRange.max) queryParams.append("price_max", priceRange.max);

    const filterApiUrl = `${process.env.REACT_APP_API_URL}/filters/productsFilter/?${queryParams.toString()}`;

    try {
      const response = await axios.get(filterApiUrl);
      if (response.status === 200) {
        setResults(response.data.results);
        if (setShowMobileFilter) {
          setShowMobileFilter(false); // close sidebar on mobile
        }
      }
    } catch (error) {
      console.error("Error applying filters:", error);
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
              onChange={(e) => setSelectedFilterType(e.target.value)}
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
                                options.map((option, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <input
                                          type="checkbox"
                                          id={`${filter}-${idx}`}
                                          checked={selectedFilters[filter]?.includes(option) || false} // here filter will be "subcategories"
                                          onChange={() => handleFilterSelection(filter, option)}
                                          className="mr-2"
                                      />
                                      <label htmlFor={`${filter}-${idx}`} className="text-sm">
                                        {option}
                                      </label>
                                    </div>
                                ))
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
