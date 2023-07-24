import React from "react";
import { menuRowOptions } from "../utils/optionMap";

export default function MenuEditRow(props) {
  const { editedMenuItem, onChange } = props;

  const handleInputChange = (key, value) =>
    onChange({
      ...editedMenuItem,
      [key]: value,
    });

  return (
    <>
      {menuRowOptions.map((item, index) => {
        return <td
          key={index}
          className="py-2 px-4 w-1/4">{/* this is rendered as undefined. why? */}
          <input
            type={item.type}
            placeholder={item.name}
            value={editedMenuItem[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            className="w-50 border border-gray-300 px-2 py-1 rounded"
          />
        </td>
      })}
      <td className="py-2 px-4 w-1/4">
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
      </td>
    </>
  );
}
