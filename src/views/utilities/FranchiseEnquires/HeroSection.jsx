import React from "react";
import franchiseenquires from "../../../Assets/franches_banners/Banner1.webp";

const HeroSection = () => (
    <div className="w-full bg-gray-100">
        <img
            src={franchiseenquires}
            loading="lazy"
            alt="Franchise Banner"
            className="w-full h-auto"
        />
    </div>
);

export default HeroSection;
