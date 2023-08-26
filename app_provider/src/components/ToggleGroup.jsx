import TabOption from "./TabOption"
import { useEffect, useState } from "react";
import { tabMap } from "../utils/optionMap";

export default function ToggleGroup(props) {
  const [selected, setSelected] = useState(props.def ? props.def : tabMap[0])
  useEffect(() => {
    props.onSelect(tabMap[0])
  }, [])
  function handleSelect(optionName) {
    setSelected(optionName)
    props.onSelect(optionName)
  }

  return (
    <div className="w-full flex flex-wrap items-center">
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
