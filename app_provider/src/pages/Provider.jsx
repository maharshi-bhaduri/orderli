import React from "react";
import { useLocation } from "react-router-dom";

export default function Provider(props) {
  const location = useLocation();
  const data = location.state;

  console.log("in provider now: ", data)
  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Welcome! Time to set the table!</h1>
    </div>
  );
}
