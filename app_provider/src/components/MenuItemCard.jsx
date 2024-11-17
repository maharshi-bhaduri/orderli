import React from "react";
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";

export default function MenuItemCard(props) {
  const { item, id, activeId } = props
  return (
    <div
      className={"flex border p-2 border-x-gray-200 border-b-0 last:border-b border-b-gray-200 first:rounded-t-lg last:rounded-b-lg " +
        "w-full transition ease-in-out " +
        (activeId === id ? "bg-gray-200 border hover:bg-gray-200 cursor-default" :
          "bg-gray-50 hover:bg-gray-200 cursor-pointer")}
      onClick={() => props.onSelect(item)}
    >
      <div className="flex-grow">
        <div className="flex items-center">
          <img
            className="h-5 w-5 mr-1"
            src={item.dietCategory == 2 ? veg : nonVeg} />
          <h1 className="text-base font-medium">{item.itemName}</h1>
          <h3 className="text-xs italic ml-2">Serves: {item.serves || '1'}</h3>
        </div>
        <h2 className="text-xs italic">{item.description}</h2>
      </div>
      <div className="flex items-center">
        <h2 className="text-base ml-2">{item.price}</h2>
      </div>
    </div>
  );
}
