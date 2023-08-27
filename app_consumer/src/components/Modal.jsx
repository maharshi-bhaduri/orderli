import React from "react";
import GraphicButton from "../components/GraphicButton";
export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  return (
    <div className="">
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 w-1/2">
          <h2 className="text-xl font-semibold mb-4">Add Review</h2>
          <p className="mb-4">Modal content goes here.</p>
          <GraphicButton onClick={onClose} text="Save"></GraphicButton>
        </div>
      </div>
    </div>
  );
}
