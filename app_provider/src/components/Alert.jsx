import React from "react";

export default function Alert() {
    return (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
            <p className="font-bold">Be Warned</p>
            <p>Something not ideal might be happening.</p>
        </div>
    );
}
