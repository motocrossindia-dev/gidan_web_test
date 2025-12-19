import React from "react";
import combo from "../../../src/Assets/ComboOffer/combooffer.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


const ComboOffer = () => {

  const [comboData, setComboData] = useState(null);

useEffect(() => {
  const fetchComboOffer = async () => {
    try {
      const res = await axios.get(
        "https://backend.biotechmaali.com/utils/content-blocks/?section=combo_offers&title="
      );
      setComboData(res.data?.[0]);
    } catch (error) {
      console.error(error);
    }
  };

  fetchComboOffer();
}, []);


  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white m-6 font-sans">
      {/* Image Section */}
      <div className="w-full md:w-1/2 h-[300px] md:h-[400px] md:px-16 flex justify-center mb-6 md:mb-0">
        <img name=" "   
          src={comboData?.image || combo}
          alt="Plant Combo"
          className="w-full h-full rounded-lg object-cover "
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col m-0 w-full md:w-1/2   h-auto md:h-full text-center md:text-left font-sans">
        <h2 className="text-xl md:text-4xl text-left md:text:center font-bold mb-4 px-0 md:px-10">
          {comboData?.title || "Combo Offers"}
        </h2>
        <p className="text-sm md:text-2xl md:px-10  text-left mb-6 md:mt-4 text-gray-500 md:text:black" >
          {comboData?.subtitle || (
  <>
    Two for One, Twice the Greenery: Get
    <br /> Your Plant Combo Today!
  </>
)}
        </p>
        <NavLink
          to="/combooffer"
          className="inline-block text-white md:ml-10 bg-bio-green hover:bg-bio-green md:text-lg  text-md w-40 rounded-md py-2 px-4  font-normal transition-colors duration-200 shadow-sm hover:shadow-md"
        >
        {comboData?.button_text || "Explore Combo"}
        </NavLink>
      </div>
    </div>
  );
};

export default ComboOffer;
