import React, { useState, useRef, useEffect } from "react";
import expandMore from "../assets/expandmore.svg";
import expandLess from "../assets/expandless.svg";
import { useClickOutside } from "../utils/useClickOutside";
export default function Dropdown(props) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setShowOptions(false);
  });

  const handleDropdownClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="relative inline-block w-50" ref={dropdownRef}>
      <label htmlFor="dropdown"></label>{" "}
      <div
        id="dropdown"
        className="w-full  bg-white border border-gray-300 text-gray-700 px-4 py-2  rounded cursor-pointer"
        onClick={handleDropdownClick}
      >
        {props.selectedOption}

        {!showOptions && (
          <img src={expandMore} alt="" className="h-5 w-5 inline ml-2" />
        )}
        {showOptions && (
          <img src={expandLess} alt="" className="h-5 w-5 inline ml-2" />
        )}
      </div>
      {showOptions && (
        <div className="absolute p-2 m-1 bg-white border border-gray-300 w-50 rounded"
        >
          {props.options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                props.handleSelectChange(option);
                setShowOptions(false);
              }}
              className={`px-4 py-2 cursor-pointer ${option === props.selectedOption
                ? "bg-orange-300 text-white rounded "
                : "hover:bg-orange-100 rounded"
                }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
