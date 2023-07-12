import React from "react";

export default function BigButton(props) {
  return (
    <div className={`flex-grow h-36 w-36 md:h-40 md:w-40 justify-center rounded-lg border border-gray-300
         bg-gray-100 p-5 hover:border-rose-400 hover:bg-orange-300 select-none cursor-pointer m-2 flex justify-center items-center
         focus:bg-orange-300 ` + (props.locked ? "bg-gray-300 hover:none pointer-events-none" : "")}>
      {props.mainText}
    </div>
  );
}
