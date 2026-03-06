'use client';

import React from 'react'
import { FaStar } from "react-icons/fa";

const StarsOnCards = ({rating,ratingNumber}) => {
    
  return (
<div className="flex items-center gap-1 mb-2">
  {[1, 2, 3, 4, 5].map((star) => (
    <FaStar
      key={star}
      className={`w-4 h-4 ${
        star <= rating ? "text-green-950" : "text-gray-300"
      }`}
    />
  ))}
  <p className="text-xs px-1 text-gray-600">({ratingNumber})</p>
</div>

  )
}

export default StarsOnCards