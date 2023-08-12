import React from "react";
import { menuRowOptions } from "../utils/optionMap";

export default function MenuEditRow(props) {
  const { editedMenuItem, onChange, type } = props;

  const handleInputChange = (key, value) =>
    onChange({
      ...editedMenuItem,
      [key]: value,
    });

  return (
    <div className="col-span-6 flex">
      {menuRowOptions.map((item, index) => {
        return <div
          key={index}
          className="py-2 px-4 w-1/4">
          <input
            type={item.type}
            placeholder={item.name}
            value={editedMenuItem[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            className="w-50 border border-gray-300 px-2 py-1 rounded"
          />
        </div>
      })}
      {type === "update" ?
        (
          <div className="py-2 px-4 w-1/4">
            <button
              onClick={() => props.handleUpdateMenuItem(editedMenuItem)}
              className={"bg-blue-500 text-white py-2 px-4 rounded mx-2 "
                + "hover:bg-blue-600"}
            >
              Done
            </button>
            <button onClick={() => { props.cancelEditMenuItem(editedMenuItem) }}
              className={"bg-gray-300 text-gray-700 py-2 px-4 rounded mx-2"
                + "hover:bg-gray-400"}
            >Cancel</button>

          </div>
        ) :
        <div className="py-2 px-4 w-1/4">
          <button
            onClick={() => props.handleAddMenuItem()}
            className={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-2"}
          >Add Item</button>
        </div>}
    </div>
  );
}
