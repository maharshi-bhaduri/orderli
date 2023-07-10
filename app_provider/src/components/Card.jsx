import React from "react";
import { useNavigate } from "react-router-dom";


export default function Card(props) {
  const navigate = useNavigate();

  function handleClick() {
    if (props?.link) {
      navigate(props.link,
        {
          state: props.stateData
        });
    }
  }
  return (
    <div
      className={"border rounded-lg border-gray-300 bg-gray-200 hover:bg-gray-300 " +
        "hover:cursor-pointer border-slate-100 p-5 " +
        "w-full transition ease-in-out " +
        (props.id == 0 ? "bg-white border-dashed hover:bg-gray-200" : "")}
      onClick={handleClick}
    >
      <h1 className="text-lg font-medium">{props.heading}</h1>
      <h2 className="text-xs italic">/{props.subheading}</h2>
    </div>
  );
}
