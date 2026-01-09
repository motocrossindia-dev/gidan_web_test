
import React, { useState } from "react";
import Image from "../../../src/Assets/ShopTheLook.png"; // Ensure the image path is correct
import PopupShopTheLook from "./PopupShopTheLook"; // Ensure this file exists and is in the correct path

  import { useEffect } from "react";
  import axios from "axios";

// function ShopTheLook() {
//   const [showPopup, setShowPopup] = useState(false);

  
//     const [shoplookData, setShoplookData] = useState(null);
  
//   useEffect(() => {
//     const fetchShoplook = async () => {
//       try {
//         const res = await axios.get(
//           "https://backend.gidan.store/combo/combo-offers/"
//         );
//         setShoplookData(res?.data?.data?.shop_the_look[0]);
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     fetchShoplook();
//   }, []);
 
//   if (!shoplookData) return null;

//   return (
    
//     <div className="bg-gray-100 p-4 font-sans">
//       <h2 className="md:text-2xl text-xl mb-4 text-left md:font-bold font-semibold">Shop The Look</h2>
//       <div className="flex flex-col">
//         {/* Desktop Image */}
//         <img name=" "   
//           src={`https://backend.gidan.store${shoplookData?.image}`}
//           alt="Shop the Look"
//           className="hidden md:block w-full h-full object-cover cursor-pointer p-7 rounded-md"
//           onClick={() => setShowPopup(true)}
//         />
//         {/* Mobile Image */}
//         <img name=" "   
//           src={`https://backend.gidan.store${shoplookData?.image}`}
//           alt="Shop the Look Mobile"
//           className="block md:hidden w-full h-[200px] object-cover cursor-pointer bg-gray-200"
//           onClick={() => setShowPopup(true)}
//         />
//       </div>

//       {/* Popup Component */}
//       {showPopup && <PopupShopTheLook onClose={() => setShowPopup(false)} />}
//     </div>


//   );
// }

function ShopTheLook() {
  const [showPopup, setShowPopup] = useState(false);
  const [shoplookData, setShoplookData] = useState(null);

  useEffect(() => {
    const fetchShoplook = async () => {
      try {
        const res = await axios.get(
          "https://backend.gidan.store/combo/combo-offers/"
        );
        setShoplookData(res?.data?.data?.shop_the_look[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShoplook();
  }, []);

  if (!shoplookData) return null;

  return (
    <div className="bg-gray-100 p-4 font-sans">
      <h2 className="md:text-2xl text-xl mb-4 text-left md:font-bold font-semibold">
        Shop The Look
      </h2>

      {/* Image Wrapper with Aspect Ratio */}
   
 <button
  type="button"
  onClick={() => setShowPopup(true)}
  className="
    w-full
    rounded-md
    overflow-hidden
    bg-white
    h-[260px]          /* Mobile height - BIG */
    sm:h-[300px]
    md:h-auto
    md:aspect-[1280/434]
  "
>
<img
  src={`https://backend.gidan.store${shoplookData?.image}`}
  alt="Shop the Look"
  className="
    w-full
    h-full
    object-contain
    scale-y-[1.35]     /* 🔥 fills vertical white space */
    sm:scale-y-[1.25]
    md:scale-y-100     /* desktop normal */
    transition-transform
  "
/>

</button>




      {/* Popup */}
      {showPopup && <PopupShopTheLook onClose={() => setShowPopup(false)} />}
    </div>
  );
}


export default ShopTheLook;
