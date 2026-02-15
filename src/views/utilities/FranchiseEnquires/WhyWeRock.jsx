import React from "react";
// Make sure the actual file extension in your folder matches this import path.
// Usually, it ends in either .jpg or .jpeg, not both.
import WhyWeRockImage from "../../../Assets/franches_banners/Franchise Page Banner-3.jpg.webp";

const WhyWeRock = () => {
    return (
        // Outer container: Gray background with vertical padding
        <div className="bg-gray-100 py-12 px-4 md:px-6">

            {/* Inner container: Centers content and limits max width */}
            <div className="w-full max-w-screen-xl mx-auto text-center">

                {/* Section Title */}
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    Why We Rock?
                </h2>

                {/* Section Description */}
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-10">
                    GIDAN is India’s newest destination for thoughtfully curated garden products, plants, planters, pots, garden supplies, and garden equipment, built with a deep respect for nature and a strong commitment to education-driven gardening. GIDAN is a unit of Biotech Maali, and has been created by a plant parent—for plant lovers, growers, and cultivators across homes, farms, and agricultural ecosystems.
                </p>

                {/* Image Container */}
                <div className="relative w-full mb-16 bg-white rounded-lg md:rounded-2xl shadow-lg md:shadow-2xl border border-gray-200 overflow-hidden">
                    <img
                        src={WhyWeRockImage}
                        alt="Gidan Outlet"
                        loading="lazy"
                        className="w-full h-auto object-contain max-h-[400px] md:max-h-[600px]"
                    />
                </div>

            </div>
        </div>
    );
};

export default WhyWeRock;