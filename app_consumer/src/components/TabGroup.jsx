import { NavLink } from "react-router-dom";
import TabOption from "./TabOption";
import { useState } from "react";

export default function TabGroup(props) {
  const [selected, setSelected] = useState("");
  function handleSelect(optionName) {
    setSelected(optionName);
    props.onSelect(optionName);
  }

  return (
    <div className="w-full flex">
      {props.tabMap.map((option, index) => (
        <TabOption
          name={option}
          key={index}
          active={option === selected}
          onClick={handleSelect}
        />
      ))}
    </div>
  );
}
