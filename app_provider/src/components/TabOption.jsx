import React from "react";

export default function SidebarButton(props) {
  return (
    <div
      className={"inline rounded-lg border border-gray-200 m-2 p-2 transition ease-in-out cursor-pointer select-none" +
        " hover:bg-gray-200 " +
        ((props.active) ? "text-white bg-orange-300 cursor-default hover:bg-orange-300" : "")}
      onClick={() => props.onClick(props.name)}
    >
      <div className="flex">
        <h1 className={"text-sm " + (props.active ? "font-medium" : "font-normal")}>{props.name}</h1>
      </div>
    </div>
  );
}
