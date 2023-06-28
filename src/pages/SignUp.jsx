import React from "react";
import { signInWithGoogle, signOutNow } from "../Firebase";
export default function Signup() {
  return (
    <div className="signup">
      <button
        className="signup-btn"
        style={{ backgroundColor: "black", color: "white", padding: "10px" }}
        onClick={signInWithGoogle}
      >
        Register with gmail
      </button>
    </div>
  );
}
