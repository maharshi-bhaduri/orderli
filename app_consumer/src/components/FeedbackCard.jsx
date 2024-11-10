import { useState } from "react";
import React from "react";
import { ratingColors } from "../utils/OptionMap.js";
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
  const charLimit = 100,
    lineLimit = 1;
  let shortDesc =
    desc.length > charLimit
      ? desc.substring(0, charLimit)
      : desc.split(/\r?\n|\r|\n/g).length > lineLimit
      ? desc
          .split(/\r?\n|\r|\n/g)
          .slice(0, lineLimit)
          .join("\n")
      : desc;
  const dynamicColorClass = ratingColors[rating];
  console.log(createdAt);
  const formattedDate = formatDate(createdAt);

  return (
    <div className="mx-auto mt-4 max-h-fit bg-gray-100 rounded-lg p-4 space-x-4">
      <div className="flex flex-row items-center ">
        <div
          className={`flex justify-center items-center flex-shrink-0  h-10 w-10 rounded-lg ${dynamicColorClass}`}
        >
          <span className="text-lg font-semibold  text-white">{rating}</span>
        </div>
        <div className="flex ">
          <div className="flex-grow ml-8 mr-2">
            <p className="text-gray-700 font-semibold">{by}</p>
          </div>
          <div className="mr-2">
            <h3>&#x2022;</h3>
          </div>
          <div className="flex-shrink-0">
            <span className="text-gray-700">{formattedDate}</span>
          </div>
        </div>
      </div>
      {!expanded && (
        <div className="flex  pl-14">
          <div className="text-gray-700">
            {shortDesc}{" "}
            {shortDesc !== desc && (
              <div className="text-sm cursor-pointer" onClick={toggleExpansion}>
                ... Read more
              </div>
            )}
          </div>
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
