import React from "react";
import { useNavigate } from "react-router-dom";
import { dietCategoryOptions } from "../utils/OptionMap";

export default function ItemCard(props) {
  const navigate = useNavigate();
  const dietCategory = dietCategoryOptions.find(
    (category) => category.id === props.dietCategory
  );
  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">{props.itemName}</h3>
            {dietCategory.value}
            <p className="text-gray-800 mb-2">{props.description}</p>
          </div>
          <p className="text-gray-800 font-semibold">Rs. {props.price}</p>
          {/* {props.category} {props.dietCategory} */}
        </div>
      </div>
    </div>
  );
}
