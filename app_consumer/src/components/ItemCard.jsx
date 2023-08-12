import React from "react";
import { useNavigate } from "react-router-dom";
import { dietCategoryOptions } from "../utils/OptionMap";
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";
export default function ItemCard(props) {
  const navigate = useNavigate();
  const dietCategory = dietCategoryOptions.find(
    (category) => category.id === props.dietCategory
  );
  return (
    <div className="max-w-lg mx-auto px-2 ">
      <div className="bg-gray-100 rounded-lg shadow-md">
        <div className="p-4 mb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <img
                className="h-5 w-5 mr-1"
                src={dietCategory.id == 2 ? veg : nonVeg}
                alt=""
              />
              <h3 className="text-sm font-semibold">{props.itemName}</h3>
            </div>
            <p className="text-gray-800 mb-2 text-sm">{props.description}</p>
          </div>
          <div className="flex justify-start">
            <p className="text-gray-800 font-semibold text-sm">{props.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
