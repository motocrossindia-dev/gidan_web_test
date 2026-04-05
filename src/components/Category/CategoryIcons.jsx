'use client';

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";

const CategoryIcons = ({ initialData }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Use TanStack Query hook for categories
  const { data: categoryData = [], isLoading } = useCategories(initialData);

  const publishedCategoryData = useMemo(() => {
    return categoryData.filter((category) => category?.is_published === true);
  }, [categoryData]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (openDropdown !== null && !event.target.closest('.category-item')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  // Desktop Hover Handlers
  const handleCategoryHover = (categoryId, hasSubcategories) => {
    if (window.innerWidth >= 768 && hasSubcategories) {
      setOpenDropdown(categoryId);
    }
  };

  const handleCategoryLeave = () => {
    if (window.innerWidth >= 768) {
      setOpenDropdown(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-0 relative z-10">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-2 sm:px-4 mt-6 w-full pb-0">
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-0 relative">
        {/* Category Container */}
        <div
          id="category-scroll-container"
          className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 px-2 sm:px-4 mt-2 w-full pt-2 relative z-[50] overflow-visible"
        >
          {/* "All" Badge */}
          <div className="relative shrink-0">
            <Link
              href="/shop/"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm border ${
                pathname === '/shop/' 
                  ? 'bg-[#2d5a1b] border-[#2d5a1b] text-white shadow-md active-category' 
                  : 'bg-white border-gray-100 text-[#1a1f14] hover:border-gray-200 hover:shadow-md'
              }`}
            >
              <Leaf size={18} className={pathname === '/shop/' ? 'text-white' : 'text-[#375421]'} />
              <span className="text-[14px] font-semibold whitespace-nowrap">All</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pathname === '/shop/' ? 'bg-white/20 text-white' : 'bg-black/5 text-black/40'
              }`}>
                Shop
              </span>
            </Link>
          </div>

          {publishedCategoryData.map((category, idx) => {
            const slug = category.slug?.toLowerCase() || "";
            // Use same mapping as NavigationBar for consistency
            const href = slug === "offers" ? "/offer/" :
                         slug === "services" ? "/services/" :
                         slug === "gifts" || slug === "gift" ? "/gifts/" :
                         `/${category.slug}/`;
            const isActive = pathname === href;
            const hasSub = category.subCategory && category.subCategory.length > 0;

            return (
              <div
                key={idx}
                className="relative shrink-0 category-item"
                onMouseEnter={() => handleCategoryHover(category.id, hasSub)}
                onMouseLeave={handleCategoryLeave}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm border ${
                    isActive 
                      ? 'bg-[#2d5a1b] border-[#2d5a1b] text-white shadow-md' 
                      : 'bg-white border-gray-100 text-[#1a1f14] hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* Category Icon/Image */}
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                      alt={category.name || "Category"}
                      className="w-full h-full object-contain"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-[14px] font-semibold whitespace-nowrap">
                    {category.name}
                  </span>


                  {/* Product Count */}
                  {(category.product_count !== undefined || category.count !== undefined) && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-black/40'
                    }`}>
                      {category.product_count || category.count || "12"}
                    </span>
                  )}
                </Link>

                {/* Sub-category Dropdown (Desktop Only) */}
                {hasSub && (
                  <div
                    className={`hidden md:block absolute top-[90%] left-0 pt-4 w-[240px] z-[100] transition-all duration-300 ease-out
                      ${openDropdown === category.id ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible pointer-events-none'}
                      ${idx >= publishedCategoryData.length - 2 ? 'right-0 left-auto' : 'left-0'}`}
                    onMouseEnter={() => setOpenDropdown(category.id)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-[20px] p-4 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8cb369] to-[#375421] opacity-60" />
                      <h3 className="text-[#375421] font-black text-[10px] uppercase tracking-widest mb-4 opacity-50">
                        Explore {category.name}
                      </h3>
                      <ul className="text-gray-700 space-y-1">
                        {category.subCategory.map((item, index) => {
                          const subcategoryUrl = `/${category.slug}/${item.slug}/`;
                          return (
                            <li
                              key={index}
                              className="hover:text-[#375421] cursor-pointer transition-colors duration-200"
                            >
                              <Link
                                href={subcategoryUrl}
                                className="block py-1 px-2 rounded hover:bg-site-bg text-xs sm:text-sm"
                              >
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Scrollbar CSS */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .active-category {
            animation: pulse-border 2s infinite;
          }
          @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(45, 90, 27, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(45, 90, 27, 0); }
            100% { box-shadow: 0 0 0 0 rgba(45, 90, 27, 0); }
          }
        `}</style>
      </div>
    </>
  );
};

export default CategoryIcons;
