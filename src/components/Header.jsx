import React from "react";

import { useNavigate } from "react-router-dom";
export default function Header(props) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <h1>orderlee.in</h1>
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
        onClick={() => navigate("/signup")}
      >
        Sign Up
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
