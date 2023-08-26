import React from "react";
import { dietMap } from "../utils/optionMap";
import ToggleGroup from "./ToggleGroup";

export default function MenuEditRow(props) {

  const { editedMenuItem, onChange, type } = props;

  const handleInputChange = (key, value) =>
    onChange({
      ...editedMenuItem,
      [key]: value,
    });

  const handleCategorySelect = async (categoryName) => {
    setCategory(categoryName);
  };

  return (
    <div className="col-span-6 flex items-start my-2 grid grid-cols-6">
      <div
        className="mr-2">
        <input
          type='text'
          placeholder='Name'
          value={editedMenuItem['itemName']}
          onChange={(e) => handleInputChange('itemName', e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>
      <div
        className="mr-2">
        <textarea
          placeholder='Description'
          value={editedMenuItem['description']}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded resize-none"
        />
      </div>
      <div
        className="mr-2">
        <ToggleGroup
          tabMap={dietMap}
          onSelect={handleCategorySelect}
          def={dietMap[editedMenuItem.dietCategory - 1]}
        />
      </div>
      <div
        className="mr-2">
        <input
          type='number'
          placeholder='Serves'
          value={editedMenuItem['serves']}
          onChange={(e) => handleInputChange('serves', e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>
      <div
        className="mr-2">
        <input
          type='number'
          placeholder='Price'
          value={editedMenuItem['price']}
          onChange={(e) => handleInputChange('price', e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {type === "update" ?
        (
          <div className="flex flex-wrap">
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
        <div className="h-6">
          <button
            onClick={() => props.handleAddMenuItem()}
            className={"bg-blue-500 text-white py-2 h-6 px-4 rounded hover:bg-blue-600 mx-2"}
          >Add Item</button>
        </div>}
    </div>
  );
}
