import React from "react";

export default function SidebarButton(props) {

  // import icon from { `../images/` + props.icon };

  return (
    <div
      className={"rounded-lg w-full p-2 transition ease-in-out cursor-pointer select-none" +
        " hover:bg-gray-200 " +
        ((props.active) ? "text-white bg-orange-300 cursor-default hover:bg-orange-300" : "")}
      onClick={props.onClick}
    >
      <div className="flex">
        <span className="material-symbols-outlined pr-2">
          {props.icon}
        </span>
        <h1 className={"text-base " + (props.active ? "font-medium" : "font-normal")}>{props.name}</h1>
      </div>
    </div>
  );
}
