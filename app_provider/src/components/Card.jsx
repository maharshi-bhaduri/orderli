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
      className={"m-4 border rounded-lg border-gray-300 bg-gray-100 hover:bg-gray-200 " +
        "hover:cursor-pointer drop-shadow-md border-slate-100 p-5 " +
        "w-4/5 md:w-1/2 transition ease-in-out delay-150 " +
        (props.id == 0 ? "bg-white border-dashed hover:bg-gray-200" : "")}
      onClick={handleClick}
    >
      <h1 className="text-2xl font-medium">{props.heading}</h1>
      <h2 className="italic">/{props.subheading}</h2>
    </div>
  );
}
