'use client';

import Link from "next/link";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import __combo from "../../../src/Assets/ComboOffer/combooffer.webp";
const _combo = typeof __combo === 'string' ? __combo : __combo?.src || __combo;
const combo = typeof _combo === 'string' ? _combo : _combo?.src || _combo;
import { useComboOffer } from "../../hooks/useComboOffer";

const ComboOffer = () => {
  // Use TanStack Query hook for combo offer data
  const { data: comboData, isLoading } = useComboOffer();

  if (isLoading) {
    return (
      <div className="w-full bg-white py-6 md:py-10 lg:py-12 font-sans">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-6 md:py-10 lg:py-12 font-sans">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Image Section - 50% on desktop */}
          <div className="w-full flex justify-center items-center">
            <img
              src={comboData?.image || combo}
              alt={comboData?.title || "Combo Offers"}
              className="w-full h-auto rounded-lg object-contain"
              loading="lazy"
            />
          </div>

          {/* Text Section - 50% on desktop */}
          <div className="flex flex-col justify-center text-left space-y-4 md:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {comboData?.title || "Combo Offers"}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
              {comboData?.subtitle || (
                <>
                  Two for One, Twice the Greenery: Get Your Plant Combo Today!
                </>
              )}
            </p>
            <div className="pt-2">
              <Link
                to="/combooffer"
                className="inline-block text-white bg-bio-green hover:bg-green-700 text-sm sm:text-base md:text-lg px-5 py-2.5 md:px-6 md:py-3 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {comboData?.button_text || "Explore Combo"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOffer;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import { useEffect, useState } from "react";
// import combo from "../../../src/Assets/ComboOffer/combooffer.webp";
// // import axios from "axios";
//
// const ComboOffer = () => {
//   const [comboData, setComboData] = useState(null);
//
//   useEffect(() => {
//     const fetchComboOffer = async () => {
//       try {
//         const res = await axios.get(
//           "https://backend.gidan.store/utils/content-blocks/?section=combo_offers&title="
//         );
//         setComboData(res.data?.[0]);
//       } catch (error) {}
//     };
//     fetchComboOffer();
//   }, []);
//
//   return (
//     <div className="w-full bg-white py-6 md:py-10 lg:py-12 font-sans">
//       <div className="container mx-auto px-4 md:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
//           {/* Image Section - 50% on desktop */}
//           <div className="w-full flex justify-center items-center">
//             <img
//               src={comboData?.image || combo}
//               alt={comboData?.title || "Combo Offers"}
//               className="w-full h-auto rounded-lg object-contain"
//               loading="lazy"
//             />
//           </div>
//
//           {/* Text Section - 50% on desktop */}
//           <div className="flex flex-col justify-center text-left space-y-4 md:space-y-6">
//             <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
//               {comboData?.title || "Combo Offers"}
//             </h2>
//             <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
//               {comboData?.subtitle || (
//                 <>
//                   Two for One, Twice the Greenery: Get Your Plant Combo Today!
//                 </>
//               )}
//             </p>
//             <div className="pt-2">
//               <Link
//                 to="/combooffer"
//                 className="inline-block text-white bg-bio-green hover:bg-green-700 text-sm sm:text-base md:text-lg px-5 py-2.5 md:px-6 md:py-3 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
//               >
//                 {comboData?.button_text || "Explore Combo"}
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ComboOffer;
// ========== END OLD CODE ==========
