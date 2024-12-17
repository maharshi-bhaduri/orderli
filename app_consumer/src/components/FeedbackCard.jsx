import { useState } from "react";
import React from "react";
import formatDate from "../utils/formatDate.js";
import star from "../images/star.png";
export default function FeedbackCard({
  rating,
  desc,
  createdAt,
  by,
  email,
  phone,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => setExpanded(!expanded);

  const charLimit = 150;
  const shortDesc =
    desc.length > charLimit ? desc.substring(0, charLimit) + "..." : desc;

  // Extract the first letter of the name for the avatar
  const initial = by.charAt(0).toUpperCase();
  const formattedDate = formatDate(createdAt);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<img key={i} src={star} alt="" height={20} width={20} />);
    }
    return <div className="flex">{stars}</div>;
  };
  return (
    <div className="mx-auto mt-4 bg-gray-100 rounded-lg p-4">
      {/* Header section with avatar, name, and date */}
      <div className="flex items-center justify-between">
        <div className="flex">
          {/* Circle avatar with initial */}
          <div className="flex justify-center items-center h-10 w-10 rounded-full bg-blue-500">
            <span className="text-lg font-semibold text-white">{initial}</span>
          </div>
          {/* Name and date */}
          <div className="flex items-start">
            <div className="flex flex-col ml-4">
              <p className="text-gray-700 font-semibold text-sm">{by}</p>
              <span className="text-gray-700 text-xs">{formattedDate}</span>
            </div>
          </div>
        </div>
        {/* rating */}
        <div className="ml-4">
          <span>{renderStars(rating)}</span>
        </div>
      </div>

      {/* Review section */}
      <div className="mt-3 text-gray-700 pl-2">
        {expanded ? (
          <>
            <p>{desc}</p>
            <button
              className="text-sm text-blue-500 hover:underline mt-2"
              onClick={toggleExpansion}
            >
              See less
            </button>
          </>
        ) : (
          <>
            <p>{shortDesc}</p>
            {desc.length > charLimit && (
              <button
                className="text-sm text-blue-500 hover:underline mt-2"
                onClick={toggleExpansion}
              >
                See more
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
