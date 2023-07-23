import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card(props) {
  const navigate = useNavigate();

  function logfunction() {
    console.log("clicked on div");
  }

  return (
    <div className="max-w-lg mx-auto px-4" onClick={logfunction}>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">{props.itemName}</h3>
            <p className="text-gray-800 mb-2">{props.description}</p>
          </div>
          <p className="text-gray-800 font-semibold">Rs. {props.price}</p>
        </div>
      </div>
    </div>
  );
}
