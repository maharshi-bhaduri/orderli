import React from "react";

import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="fixed flex justify-between align-center items-center h-20 w-full bg-orange-400 py-2 px-5 top-0">
      <h1>orderlee.in</h1>
    </header>
  );
}
