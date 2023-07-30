import React from "react";

export default function BorderedPallete(props) {
    return (
        <div className="mb-4 p-4 flex items-center border rounded-lg w-full">
            {props.children}
        </div>
    );
}
