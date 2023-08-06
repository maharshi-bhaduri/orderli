import React from "react";
import { palleteColours } from "../utils/optionMap";

export default function BorderedPallete(props) {

    return (
        <div className={"mb-5 p-4 flex flex-col w-full border bg-white rounded-lg " + palleteColours[props.type]}>
            {props.title &&
                <div className="text-sm font-bold text-gray-600 mb-2">
                    {props.title}
                </div>
            }
            <div className="flex items-center w-full">
                {props.children}
            </div>
        </div>
    );
}
