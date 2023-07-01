import React from "react";
import { useLocation } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const data = location.state;
  if (!data) {
    console.log("get data here.")
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Welcome! Time to set the table!</h1>
    </div>
  );
}
