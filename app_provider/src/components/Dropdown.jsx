import React, { useState, useRef, useEffect } from "react";
import expandMore from "../assets/expandmore.svg";
import expandLess from "../assets/expandless.svg";
export default function Dropdown(props) {
  const [showOptions, setShowOptions] = useState(false);
  // const [selected, setSelected] = useState(props.selectedOption ? props.selectedOption : props.options[0]);
  const dropdownRef = useRef(null);
  // const optionsRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleDropdownClick = () => {
    setShowOptions(!showOptions);

    // Calculate the position of the expanded dropdown
    // setTimeout(() => { // Use setTimeout to ensure the options are rendered
    //   const dropdownBottomPosition =
    //     optionsRef.current.getBoundingClientRect().bottom;

    //   // Check if the expanded dropdown goes beyond the viewport
    //   if (dropdownBottomPosition > window.innerHeight) {
    //     // Calculate the amount of scroll required
    //     const scrollAmount = dropdownBottomPosition - window.innerHeight + 10; // Adding a small buffer

    //     console.log("scrollAmount ", scrollAmount)
    //     // Scroll the page to bring the expanded dropdown into view
    //     window.scrollTo({
    //       top: window.scrollY + scrollAmount,
    //       behavior: "smooth", // You can use "auto" for instant scrolling
    //     });
    //   }
    // }, 500);

  };

  // console.log("showOptions", showOptions)
  // console.log("dropdownRef ", dropdownRef)
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
        // ref={optionsRef}
        >
          {props.options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                props.handleSelectChange(option);
                // props.onChange(option);
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
