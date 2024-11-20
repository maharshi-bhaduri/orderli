import React from "react";
import { useCart } from "../utils/CartContext"; // Import Cart Context
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";

export default function ItemCard(props) {
  const { cart, dispatch } = useCart(); // Access cart state and dispatch
  const dietCategory = props.dietCategory === 2 ? veg : nonVeg;
  const quantity = cart.cartItems[props.menuId]?.quantity || 0;

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: { menuId: props.menuId, item: props },
    });
  };

  const removeFromCart = () => {
    dispatch({ type: "REMOVE_ITEM", payload: { menuId: props.menuId } });
  };

  return (
    <div className="max-w-lg mx-auto px-2">
      <div className="bg-gray-100 rounded-lg shadow-md">
        <div className="p-4 mb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <img
                className="h-5 w-5 mr-1"
                src={dietCategory}
                alt="Diet Icon"
              />
              <h3 className="text-sm font-semibold">{props.itemName}</h3>
            </div>
            <p className="text-gray-800 mb-2 text-sm">{props.description}</p>
          </div>
          <div className="flex flex-col justify-start items-end">
            <p className="text-gray-800 font-semibold text-sm">
              ${props.price.toFixed(2)}
            </p>
            {quantity > 0 ? (
              <div className="flex items-center mt-2">
                <button
                  onClick={removeFromCart}
                  className="px-2 py-1 bg-red-500 text-white rounded-l text-xs"
                >
                  -
                </button>
                <div className="px-3 py-1 bg-gray-200 text-xs">{quantity}</div>
                <button
                  onClick={addToCart}
                  className="px-2 py-1 bg-green-500 text-white rounded-r text-xs"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={addToCart}
                className="mt-2 px-4 py-1 bg-green-500 text-white text-xs rounded shadow hover:bg-green-600 focus:outline-none"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
