import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOutNow } from "../utils/Firebase";
import { AuthContext } from "../utils/AuthContextProvider"; // Import AuthContext

import { QueryCache } from "@tanstack/react-query";

const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    console.log(data);
    console.log("jdhfdhfudhj");
  },
  onSettled: (data, error) => {
    console.log(data, error);
  },
});

// Clear all queries from the cache

function Logout() {
  const navigate = useNavigate(); // Get the navigate function here
  const { handleLogout } = useContext(AuthContext); // Get handleLogout from context

  const logout = async () => {
    try {
      await signOutNow();
      queryCache.clear();

      handleLogout();
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
        onClick={logout}
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
    </div>
  );
}

export default Logout;
