import { useEffect, useState } from "react";
import TabOption from "./TabOption";
import { tabMap } from "../utils/optionMap";

export default function TabGroup(props) {
  const [selected, setSelected] = useState(tabMap[0]);

  useEffect(() => {
    setSelected(props.selectedOption || tabMap[0]);
  }, [props.selectedOption]);

  function handleSelect(optionName) {
    setSelected(optionName);
    props.onSelect(optionName);
  }

  return (
    <div className="w-full flex items-center my-2 ml-2">
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
