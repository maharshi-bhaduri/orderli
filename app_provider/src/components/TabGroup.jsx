import { NavLink } from "react-router-dom";
import TabOption from "./TabOption"
import { useEffect, useState } from "react";
import { tabMap } from "../utils/optionMap";

export default function TabGroup(props) {
  const [selected, setSelected] = useState(tabMap[0])
  useEffect(() => {
    props.onSelect(tabMap[0])
  }, [])
  function handleSelect(optionName) {
    setSelected(optionName)
    props.onSelect(optionName)
  }

  return (
    <div className="w-full flex items-center my-2 ml-2">
      {/* {
        props.newTab &&
        <div
          className="rounded-lg border border-gray-200 m-2 p-2 transition ease-in-out cursor-pointer select-none 
           bg-blue-500 hover:bg-blue-700"
        >
          <div className="flex">
            <h1 className="text-sm text-white whitespace-nowrap">{props.newTab}</h1>
          </div>
        </div>

      } */}
      {props.tabMap.map((option, index) => (
        <TabOption name={option}
          key={index}
          active={option === selected}
          onClick={handleSelect}
        />
      ))}
    </div>
  );
}
