import { useState } from "react";
import React from "react";

export default function FeedbackCard({ rating, desc, createdAt }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = function () {
    setExpanded(!expanded);
  };
  return (
    <div
      className={`max-w-full mx-auto mt-8 bg-white rounded-lg shadow-md p-4 flex flex-row items-center space-x-4 cursor-pointer ${
        expanded ? "h-auto" : "h-24 overflow-hidden"
      }`}
      onClick={toggleExpansion}
    >
      {/* Rating */}
      <div className="flex-shrink-0  p-2  bg-blue-500">
        <span className="text-lg font-semibold text-white">{rating}</span>
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
