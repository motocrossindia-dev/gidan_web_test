



import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const FilterSidebar = () => {
  const [openFilters, setOpenFilters] = useState({
    "Type of Plants": false,
    "Price": false,
    "Pot Color": false,
    "Size": false,
    "Indoor/Outdoor": false
  });
  const [selectedFilters, setSelectedFilters] = useState({
    "Type of Plants": [],
    "Price": [],
    "Pot Color": [],
    "Size": [],
    "Indoor/Outdoor": []
  });

  const filterOptions = {
    "Type of Plants": ["Flowering Plants (4)", "Shrub Plants (4)", "Give More Options..."],
    "Price": ["Below Rs 500 (4)", "Rs 500 to 1000 (8)", "Give More Options..."],
    "Pot Color": ["Red", "White", "And Many More..."],
    "Size": ["2ft", "4ft", "And Many More..."],
    "Indoor/Outdoor": ["Indoor", "Outdoor", "And Many More..."]
  };

  const handleFilterToggle = (filter) => {
    setOpenFilters(prevState => ({
      ...prevState,
      [filter]: !prevState[filter]
    }));
  };

  const handleFilterSelection = (filter, option) => {
    setSelectedFilters(prevState => {
      const updatedSelections = prevState[filter].includes(option)
        ? prevState[filter].filter(item => item !== option)
        : [...prevState[filter], option];

      return {
        ...prevState,
        [filter]: updatedSelections
      };
    });
  };

  const renderCheckboxList = (filter) => {
    return filterOptions[filter].map((option, index) => (
      <div key={index} className="flex items-center">
        <input
          type="checkbox"
          id={`${filter}-${index}`}
          checked={selectedFilters[filter].includes(option)}
          onChange={() => handleFilterSelection(filter, option)}
          className="mr-2"
        />
        <label htmlFor={`${filter}-${index}`} className="text-sm">{option}</label>
      </div>
    ));
  };

  return (
    <div className="w-full p-12 h-auto bg-white mt-2 rounded-md">
      <div className="mb-6 flex justify-between items-center rounded-md">
        <h2 className="text-base font-normal text-black">Filter</h2>
        <button className="px-2 py-1 text-xs bg-gray-300 rounded text-gray-700 font-semibold">
          RESET
        </button>
      </div>

      <div className="space-y-4 space-x-0 ">
        {Object.keys(filterOptions).map((filter, index) => (
          <div key={index} className="relative">
            <button
              className="w-full py-2  flex justify-between gap-12 items-center text-left border-b border-gray-200 text-sm"
              onClick={() => handleFilterToggle(filter)}
            >
              <span className="text-gray-700">{filter}</span>
              {openFilters[filter] ? (
                <FaAngleUp className="text-gray-500 " />
              ) : (
                <FaAngleDown className="text-gray-500" />
              )}
            </button>
            {openFilters[filter] && (
              <div className="mt-2 space-y-2 pl-4">
                {renderCheckboxList(filter)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
