import React from "react";

import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <h1>orderlee.in</h1>
    </header>
  );
}
