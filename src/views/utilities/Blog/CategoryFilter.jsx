// import React, { useEffect, useState } from 'react';
// import { AiOutlineSearch } from 'react-icons/ai'; // Import search icon
import DownloadApp from "../../../Assets/DownloadApp.webp";


import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onSearch,
  searchQuery 
}) {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const clearSearch = () => {
    setInputValue('');
    onSearch('');
  };
  

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-5">
      {/* Search Bar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Search Blogs</h2>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Search for blogs..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F4333] focus:border-transparent text-gray-700 transition-all"
          />
          <button 
            type="submit"
            className="absolute inset-y-0 left-0 px-3 flex items-center text-gray-500 hover:text-[#2F4333]"
          >
            <Search size={18} />
          </button>
          {inputValue && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-[#2F4333]"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories available</p>
        ) : (
          <ul className="space-y-1 border border-gray-200 rounded-lg overflow-hidden">
            {categories.map((category, index) => (
              <li 
                key={index} 
                className={`border-t first:border-t-0 border-gray-200 transition-colors ${
                  selectedCategory === category.name 
                    ? 'bg-[#f1f5f1] text-[#2F4333]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => onCategorySelect(category.name)}
                  className="block w-full text-left px-4 py-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedCategory === category.name ? 'font-medium' : ''}>
                      {category.name}
                    </span>
                    {category.count && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Posts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="border-b border-gray-100 pb-2">
            <Link to="#" className="hover:text-[#2F4333] transition-colors block text-sm line-clamp-2">
              Top 5 Scenic Road Trips from Chennai to Coastal Getaways
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-2">
            <Link to="#" className="hover:text-[#2F4333] transition-colors block text-sm line-clamp-2">
              How to Plan a Road Trip from Bangalore to Ooty: Route and Tips
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-2">
            <Link to="#" className="hover:text-[#2F4333] transition-colors block text-sm line-clamp-2">
              Solo Women Travel: Safe and Scenic Routes in South India
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-[#2F4333] transition-colors block text-sm line-clamp-2">
              Tips for Renting a Car During Monsoon: Stay Safe on the Road
            </Link>
          </li>
        </ul>
      </div>

      {/* Promotional Image with Download Button */}
{/* <div className="flex text-center mt-8 relative overflow-hidden rounded-lg max-w-2xl mx-auto">   
  <img name=" "         
    src={DownloadApp}      
    alt="Download Our App"
    loading="lazy"
    className="w-full rounded-lg object-cover mb-[5rem]"    
  />    
     
  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-4 sm:pb-6">     
   
    <Link to={'https://play.google.com/store/apps/details?id=com.biotechmaali.app&pcampaignid=web_share'}>       
      <button className="px-6 py-2 bg-bio-green text-white rounded-full font-semibold hover:bg-bio-green transition-colors transform hover:scale-105 duration-200 text-sm sm:text-base">         
        DOWNLOAD APP       
      </button>     
    </Link>   
  </div> 
</div> */}

</div>
  );
}

export default CategoryFilter;