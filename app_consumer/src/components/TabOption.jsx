import React from "react";
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";
export default function TabOption(props) {
  return (
    <div
      className={
        "inline rounded-lg border border-black m-2 p-2 transition ease-in-out cursor-pointer select-none bg-white hover:bg-gray-300" +
        (props.active
          ? "text-white " +
            ((props.name === "Veg" && "bg-green-50  border-green-700") ||
              (props.name === "Non-Veg" && "bg-red-50  border-red-800") ||
              (props.name === "All" && "bg-blue-100  border-red-800")) +
            +" cursor-default"
          : "")
      }
      onClick={() => props.onClick(props.name)}
    >
      <div className="flex justify-center items-center">
        {props.name !== "All" && (
          <img
            className="h-4 w-4 mr-1"
            src={
              (props.name === "Veg" && veg) ||
              (props.name === "Non-Veg" && nonVeg)
            }
            alt=""
          />
        )}
        <h1
          className={
            "text-xs " + (props.active ? "font-medium" : "font-normal")
          }
        >
          {props.name}
        </h1>
      </div>
    </div>
  );
}
