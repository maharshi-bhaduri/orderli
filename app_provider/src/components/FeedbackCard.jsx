import { useState } from "react";
import React from "react";
import { ratingColors } from "../utils/optionMap.js";

export default function FeedbackCard({ rating, desc, createdAt }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = function () {
    setExpanded(!expanded);
  };
  const dynamicColorClass = ratingColors[rating];
  const para = document.querySelector(".desc");

  return (
    <div
      className={`w-full mx-auto mt-4 h-20 bg-gray-100 rounded-lg p-4 flex flex-row items-center space-x-4 
      cursor-pointer `}
      onClick={toggleExpansion}
    >
      {/* Rating */}
      <div
        className={`flex justify-center items-center flex-shrink-0  h-10 w-10 rounded-lg ${dynamicColorClass}`}
      >
        <span className="text-lg font-semibold  text-white">{rating}</span>
      </div>

      {/* Feedback Description */}
      <div className="flex-grow">
        <p className="text-gray-700 desc">{desc}</p>
      </div>

      {/* Created At Date */}
      <div className="flex-shrink-0">
        <span className="text-gray-700">{createdAt}</span>
      </div>
    </div>
  );
}
