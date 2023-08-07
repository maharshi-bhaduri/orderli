import React from "react";

export default function TabOption(props) {
  return (
    <div
      className={
        "inline rounded-lg border border-black m-2 p-2 transition ease-in-out cursor-pointer select-none hover:bg-gray-300" +
        (props.active ? "text-white bg-white cursor-default" : "")
      }
      onClick={() => props.onClick(props.name)}
    >
      <div className="flex">
        <h1
          className={
            "text-sm " + (props.active ? "font-medium" : "font-normal")
          }
        >
          {props.name}
        </h1>
      </div>
    </div>
  );
}
