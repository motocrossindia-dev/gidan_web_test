'use client';

import React from "react";
import __franchiseenquires from "../../../Assets/franches_banners/Banner1.webp";
const _franchiseenquires = typeof __franchiseenquires === 'string' ? __franchiseenquires : __franchiseenquires?.src || __franchiseenquires;
const franchiseenquires = typeof _franchiseenquires === 'string' ? _franchiseenquires : _franchiseenquires?.src || _franchiseenquires;

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
