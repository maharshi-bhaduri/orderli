import { useState } from "react";
import React from "react";
import { ratingColors } from "../utils/optionMap.js";
import formatDate from "../utils/formatDate.js";
export default function FeedbackCard({
  rating,
  desc,
  createdAt,
  by,
  email,
  phone,
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = function () {
    setExpanded(!expanded);
  };
  let shortDesc = "";
  const dynamicColorClass = ratingColors[rating];
  const formattedDate = formatDate(createdAt);

  if (desc.length > 100) {
    shortDesc = desc.substring(0, 100);
  }
  return (
    <div
      className="w-full mx-auto mt-4 max-h-fit bg-gray-100 rounded-lg p-4 space-x-4"
      onClick={toggleExpansion}
    >
      <div className="flex flex-row items-center">
        <div
          className={`flex justify-center items-center flex-shrink-0  h-10 w-10 rounded-lg ${dynamicColorClass}`}
        >
          <span className="text-lg font-semibold  text-white">{rating}</span>
        </div>
        <div className="flex-grow ml-8">
          <p className="text-gray-700 font-semibold">{by}</p>
        </div>
        <div className="flex-shrink-0">
          <span className="text-gray-700">{formattedDate}</span>
        </div>
      </div>
      {!expanded && (
        <div className="flex  pl-14">
          <p className="text-gray-700">{shortDesc}</p>
        </div>
      )}
      {expanded && (
        <div className="flex pl-14">
          <p className="text-gray-700">{desc}</p>
        </div>
      )}
    </div>
  );
}
