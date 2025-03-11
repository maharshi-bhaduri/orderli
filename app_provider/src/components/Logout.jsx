import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOutNow } from "../utils/Firebase";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal.jsx";
// Clear all queries from the cache

function Logout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate(); // Get the navigate function here
  const queryClient = useQueryClient(); // Get the query client instance

  const logout = async () => {
    try {
      await signOutNow();
      queryClient.clear();

      console.log("Cache cleared");
      navigate("/");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };
  return (
    <div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 w-full rounded flex items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={logout} // When "Submit" is clicked, logout
      >
        <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
        <p className="text-gray-600">Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
}

export default Logout;
