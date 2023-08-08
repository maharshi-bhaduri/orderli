import React, { useState } from "react";
import { buttonStyles } from "../utils/optionMap";

export default function GraphicButton(props) {
  const style = props.buttonStyle || 'default'
  return (
    <div className={`m-2 px-4 py-2 flex justify-center items-center rounded-lg select-none whitespace-nowrap
    ` + (props.disabled && buttonStyles[style].dis || buttonStyles[style].org)
    }
      onClick={() => { props.onClick() }}
    >
      {props.text &&
        <p className={props.children && `mr-2`}>
          {props.text}
        </p>
      }
      {props.children}
    </div>
  );
}
