import React from "react";
import starFull from "../images/starFull.png";
import starEmpty from "../images/starEmpty.png";
export default function Rating({ value, onChange, onBlur, error }) {
  const handleStarClick = (rating) => {
    onChange(rating);
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Rating</label>
      <div className="flex space-x-2 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
          >
            <img
              key={star}
              src={value >= star ? starFull : starEmpty}
              alt=""
              height={20}
              width={20}
            />
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
