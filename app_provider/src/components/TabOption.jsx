import React from "react";

export default function SidebarButton(props) {
  return (
    <div
      className={"rounded-lg whitespace-nowrap border border-gray-300 mr-2 last:mr-0 p-2 transition ease-in-out cursor-pointer select-none" +
        " hover:bg-gray-200 " +
        ((props.active) ? "text-white bg-orange-300 cursor-default hover:bg-orange-300" : "bg-gray-50 text-gray-600")}
      onClick={() => props.onClick(props.name)}
    >
      <div className="">
        <h1 className={"text-sm whitespace-nowrap" + (props.active ? "font-medium" : "font-normal")}>{props.name}</h1>
      </div>
    </div>
  );
}
