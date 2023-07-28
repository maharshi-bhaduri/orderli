import { useState } from "react";
import React from "react";
import { ratingColors } from "../utils/optionMap.js";

export default function FeedbackCard({ rating, desc, createdAt }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = function () {
    setExpanded(!expanded);
  };
  const dynamicColorClass = ratingColors[rating];
  console.log(rating + " " + dynamicColorClass);

  return (
    <div
      className={`max-w-full mx-auto mt-8 bg-white rounded-lg p-4 flex flex-row items-center space-x-4 cursor-pointer ${
        expanded ? "h-auto" : "h-24 overflow-hidden"
      }`}
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
        <p className="text-gray-700">{desc}</p>
      </div>

      {/* Created At Date */}
      <div className="flex-shrink-0">
        <span className="text-gray-700">{createdAt}</span>
      </div>
    </div>
  );
}
