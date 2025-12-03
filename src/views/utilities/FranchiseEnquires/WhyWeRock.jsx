import React from "react";
import WhyWeRockImage from "../../../Assets/FranchiseEnquires/franchiseenquires3.png"; // Update path if needed

const WhyWeRock = () => {
  return (
    <div className="bg-gray-100 py-8 md:py-12 px-6">
      <div className="w-full max-w-screen-xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Why We Rock?</h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Take the first step and become a part of the family that is
          ever-growing. Partner with the most trusted plant nursery in the
          market. The vision of{" "}
          <span className="font-bold">Gidan franchise</span> is to
          deliver our unique cultural blend and values to each corner of this
          world. Started 3 years back, we have accomplished great tasks and
          achieved incredible milestones.{" "}
          <span className="font-bold">550+ outlets</span>,{" "}
          <span className="font-bold">320+ cities</span>, countless kulhads, and
          global presence say it all.
        </p>

        {/* Image section */}
        <div className="mt-8 ">
          <img name=" "   
            src={WhyWeRockImage}
            loading="lazy"
            alt="Gidan Outlet"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default WhyWeRock;
