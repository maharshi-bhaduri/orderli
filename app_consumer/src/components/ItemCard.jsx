import React from "react";
import { useNavigate } from "react-router-dom";
import { dietCategoryOptions } from "../utils/OptionMap";
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";

export default function ItemCard(props) {
  console.log('props', props)
  const dietCategory = dietCategoryOptions.find(
    (category) => category.id === props.dietCategory
  );

  return (
    <div className="max-w-lg mx-auto px-2">
      <div className="bg-gray-100 rounded-lg shadow-md">
        <div className="p-4 mb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <img
                className="h-5 w-5 mr-1"
                src={dietCategory.id === 2 ? veg : nonVeg}
                alt={dietCategory.label}
              />
              <h3 className="text-sm font-semibold">{props.itemName}</h3>
            </div>
            <p className="text-gray-800 mb-2 text-sm">{props.description}</p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-gray-800 font-semibold text-sm">
              ${props.price.toFixed(2)}
            </p>
            <OrderButton menuItem={props} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderButton({ menuItem }) {
  const handleOrder = async () => {
    console.log('menuItem', menuItem)
    try {
      const response = await fetch(import.meta.env.VITE_APP_POST_ADD_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: menuItem.menuId,
          partnerId: menuItem.partnerId
        }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to place order.");
      }

      const result = await response.json();
      console.log("Order placed successfully:", result);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <button
      onClick={handleOrder}
      className="mt-2 px-4 py-1 bg-green-500 text-white text-xs rounded shadow hover:bg-green-600 focus:outline-none"
    >
      Order Now
    </button>
  );
}
