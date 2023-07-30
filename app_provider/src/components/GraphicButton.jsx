import React, { useState } from "react";
import { buttonStyles } from "../utils/optionMap";

export default function GraphicButton(props) {

  return (
    <div className={`px-4 py-2 flex justify-center items-center rounded-lg
    cursor-pointer ` + buttonStyles[props.buttonStyle]
    }
      onClick={() => { props.onClick() }}
    >
      {props.text}
      <span className="material-symbols-outlined ml-2">
        delete
      </span>
    </div>
  );
}
