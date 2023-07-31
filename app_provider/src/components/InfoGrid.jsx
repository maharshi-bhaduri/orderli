import React, { useState } from "react";
import GraphicButton from "./GraphicButton";

export default function InfoGrid(props) {
    const [editing, setEditing] = useState(false)
    const emptyFieldText = <p className="italic text-gray-400">Not set</p>
    let maxCols = ""
    if (props && props.cols) {
        maxCols = `grid-cols-${props.cols}`
    }

    const handleInputChange = (key, value) =>
        props.onChange({
            [key]: value,
        });

    return (
        <div className="flex flex-col justify-center h-full flex-grow" >
            <div className="flex h-10 justify-between text-sm font-bold text-gray-600">
                <div>
                    {props.title}
                </div>
                {
                    props.editable &&
                    (
                        editing ?
                            <GraphicButton text='Done' buttonStyle='blue' onClick={() => setEditing(false)}>
                            </GraphicButton> :
                            <GraphicButton onClick={() => setEditing(true)}>
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            </GraphicButton>
                    )
                }
            </div>
            <div className={`my-4 grid gap-x-4 gap-y-8 w-full grid-cols-2 ${props.cols}`} >
                {
                    props.infoList.map((item, index) =>
                        <div
                            key={index}
                            className="px-2 flex flex-col flex-grow items-start justify-center">
                            <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                            {
                                editing ?
                                    <input
                                        type="text"
                                        value={item.value ? item.value : ""}
                                        onChange={(e) => { handleInputChange(item.key, e.target.value) }
                                        }
                                        className="border border-gray-300 px-2 py-1 rounded"
                                    />
                                    :
                                    <div className="text-md">{item.value ? item.value : emptyFieldText}</div>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}
