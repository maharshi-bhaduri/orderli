import React, { useState } from "react";
import GraphicButton from "./GraphicButton";
import Dropdown from "../components/Dropdown";
import ToggleGroup from "./ToggleGroup";
import { dietMap } from "../utils/optionMap";

export default function MenuItemGrid(props) {
    const { item } = props;
    const options = [
        { value: "nonVeg", label: "Non-Veg" },
        { value: "veg", label: "Veg" },
    ];
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const handleSelectChange = function (value) {
        setSelectedOption(value);
    };

    const handleInputChange = (key, value) =>
        props.onChange({
            [key]: value,
        });

    return (
        <div className={`relative my-4 grid gap-x-2 gap-y-4 w-full grid-cols-4`} >
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">Name</p>
                <input
                    type="text"
                    value={item.itemName ? item.itemName : ""}
                    onChange={(e) => { handleInputChange(item.itemName, e.target.value) }
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                />
            </div>
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">Type</p>
                <Dropdown
                    selectedOption={selectedOption}
                    handleSelectChange={handleSelectChange}
                    options={options}
                />
                {/* <ToggleGroup
                        tabMap={dietMap}
                        onSelect={handleCategorySelect}
                        def={dietMap[item.dietCategory - 1]}
                    /> */}
            </div>
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">Active</p>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
                            after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                            peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center col-span-4 w-full">
                <p className="text-xs font-semibold text-gray-500 mb-2">Description</p>
                <textarea
                    type="text"
                    value={item.description ? item.description : ""}
                    onChange={(e) => { handleInputChange(item.itemName, e.target.value) }
                    }
                    className="border border-gray-300 px-2 py-1 rounded resize-none w-full h-20"
                />
            </div>
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">Price</p>
                <input
                    type="number"
                    value={item.price ? item.price : 0}
                    onChange={(e) => { handleInputChange(item.itemName, e.target.value) }
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                />
            </div>
            <div
                className="px-2 flex flex-col flex-grow items-start justify-center col-span-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">Serves</p>
                <input
                    type="number"
                    value={item.serves ? item.serves : 1}
                    onChange={(e) => { handleInputChange(item.itemName, e.target.value) }
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                />
            </div>
            <div className="px-2 flex flex-col flex-grow items-start justify-center col-span-2 w-full">
                <GraphicButton
                    text="Done"
                    buttonStyle="bluefill"
                />
            </div>
        </div>
    );
}
