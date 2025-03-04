import React, { useEffect } from "react";
import GraphicButton from "./GraphicButton";
export default function Modal({
  open,
  onClose,
  children,
  onSubmit,
  disableSubmit,
}) {
  // Function to handle modal submit
  const submitModal = async (e) => {
    if (onSubmit) {
      await onSubmit(e); // Call the placeholder function passed as a prop
    }
    onClose();
  };
  //console.log("disable submit value from modal is", disableSubmit);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Close the modal if clicked outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="w-full md:w-2/3 p-6 m-2 bg-white shadow-md rounded-lg overflow-y-scroll relative">
        {/* Close Button (X) */}
        <button
          type="button"
          className="absolute top-3 right-3 px-3 py-1"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Modal Content */}
        <div className="flex-1">{children}</div>

        {/* Footer with Close and Submit buttons */}
        <div className="flex justify-between ">
          <GraphicButton text="Close" buttonStyle="red" onClick={onClose} />
          <GraphicButton
            text="Submit"
            buttonStyle="bluefill"
            onClick={(e) => submitModal(e)}
            disabled={disableSubmit}
          />
        </div>
      </div>
    </div>
  );
}
