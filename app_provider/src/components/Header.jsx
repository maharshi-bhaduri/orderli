import React from "react";
import { useNavigate } from "react-router-dom";


export default function Header(props) {
  const navigate = useNavigate();
  return (
    <header className="fixed flex justify-between align-center items-center h-20 w-full bg-orange-400 py-2 px-5 top-0">
      <h1 className="text-4xl">orderlee.in</h1>
      <button
        style={{
          backgroundColor: "#fa6400",
          color: "white",
          padding: "10px",
          border: "1px solid transparent",
          borderRadius: ".25rem",
          boxShadow: "rgba(0, 0, 0, 0.02) 0 1px 3px 0",
          cursor: "pointer",
        }}
        onClick={() => navigate("/login")}
      >
        Sign In
      </button>
      {props.isAuth && (
        <button
          style={{ backgroundColor: "black", color: "white", padding: "10px" }}
        // onClick={signOutNow}
        >
          signout
        </button>
      )}
    </header>
  );
}
