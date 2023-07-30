import React from "react";

export default function InfoGrid(props) {
    const emptyFieldText = <p className="italic text-gray-400">Not set</p>

    return (
        <div className="flex flex-col justify-center h-full flex-grow">
            <div className="px-2 text-sm font-bold text-gray-600">
                {props.title}
            </div>
            <div className={`my-4 grid grid-cols-${props.cols} gap-x-4 gap-y-8 w-full`} >
                {
                    props.infoList.map((item, index) =>
                        <div
                            key={index}
                            className="px-2 flex flex-col flex-grow items-start justify-center">
                            <p className="text-xs font-semibold text-gray-500">{item.key}</p>
                            <p className="text-md -mt-1">{item.value ? item.value : emptyFieldText}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
