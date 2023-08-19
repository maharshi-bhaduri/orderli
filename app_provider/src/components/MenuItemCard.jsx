import React from "react";
import veg from "../images/veg.png";
import nonVeg from "../images/nonveg.png";

export default function MenuItemCard(props) {
  const { item, id } = props
  return (
    <div
      className={"flex border border-gray-300 bg-gray-50 hover:bg-gray-300 " +
        "hover:cursor-pointer border-slate-100 p-2 " +
        "w-full transition ease-in-out " +
        (id == 0 ? "bg-white border-dashed hover:bg-gray-200" : "")}
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
      {/* <button
        onClick={() => handleEditMenuItem(item)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Edit
      </button> */}
      {/* <button
        onClick={() => handleDeleteMenuItem(item)}
        className="absolute bottom-0 right-0 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Delete
      </button> */}
    </div>
  );
}
