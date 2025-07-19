
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const FilterSidebarMobile = () => {
  const [expanded, setExpanded] = useState({});

  const filterSections = [
    { id: 'type', label: 'Type of Plants' },
    { id: 'price', label: 'Price' },
    { id: 'light', label: 'Light' },
    { id: 'location', label: 'Ideal plants location' },
    { id: 'environment', label: 'Indoor/Outdoor' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'potSize', label: 'Pot Size' },
    { id: 'waterSchedule', label: 'Water Schedule' },
    { id: 'size', label: 'Size' },
  ];

  const toggleSection = (sectionId) => {
    setExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleApply = () => {
    console.log('Applying filters');
  };

  const handleClear = () => {
    console.log('Clearing filters');
  };

  return (
    <div className="w-full max-w-xs bg-white">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Filter ({filterSections[0].count} Products)</h2>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="divide-y">
        {filterSections.map((section) => (
          <div key={section.id} className="py-3 px-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center"
            >
              <span className="text-base text-gray-900">{section.label}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expanded[section.id] ? 'transform rotate-180' : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-4">
        <button
          onClick={handleApply}
          className="flex-1 bg-[#647D24] text-white py-2 px-4 rounded hover:bg-[#4F611C] transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterSidebarMobile;