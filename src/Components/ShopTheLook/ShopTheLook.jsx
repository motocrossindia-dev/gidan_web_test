
import React, { useState } from "react";
import Image from "../../../src/Assets/ShopTheLook.png"; // Ensure the image path is correct
import PopupShopTheLook from "./PopupShopTheLook"; // Ensure this file exists and is in the correct path

function ShopTheLook() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-gray-100 p-4 font-sans">
      <h2 className="text-md md:text-xl md:pl-8 font-medium mb-4 text-left">Shop The Look</h2>
      <div className="flex flex-col">
        {/* Desktop Image */}
        <img name=" "   
          src={Image}
          alt="Shop the Look"
          className="hidden md:block w-full h-full object-cover cursor-pointer p-7 rounded-md"
          onClick={() => setShowPopup(true)}
        />
        {/* Mobile Image */}
        <img name=" "   
          src={Image}
          alt="Shop the Look Mobile"
          className="block md:hidden w-full h-[200px] object-cover cursor-pointer bg-gray-200"
          onClick={() => setShowPopup(true)}
        />
      </div>

      {/* Popup Component */}
      {showPopup && <PopupShopTheLook onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default ShopTheLook;
