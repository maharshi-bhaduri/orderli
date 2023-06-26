import React from "react";
import { signInWithGoogle } from "../Firebase";
export default function Header() {
  return (
    <header className="header">
      <h1>orderlee.in</h1>
      <button
        style={{ backgroundColor: "black", color: "white", padding: "10px" }}
        onClick={signInWithGoogle}
      >
        signin
      </button>
      <h3>Welcome to The Country House</h3>
    </header>
  );
}
