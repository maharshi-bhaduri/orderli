import React from "react";
import { useNavigate } from "react-router-dom";


export default function Header(props) {
  const navigate = useNavigate();
  return (
    <header className="fixed flex justify-between align-center items-center h-20 w-full py-2 px-5 top-0">
      <div className="rounded-full bg-orange-400 p-4 select-none cursor-pointer">
        <h1 className="text-2xl">orderlee.in</h1>
      </div>
      <div className="rounded-full bg-orange-400 p-2">
        <button
          className="rounded-full"
          style={{
            backgroundColor: "#fa6400",
            color: "white",
            padding: "10px",
            border: "1px solid transparent",
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
      </div>
    </header>
  );
}
