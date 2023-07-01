import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContextProvider";


export default function Dashboard() {
  const user = useContext(AuthContext);

  const message = user
    ? "Welcome to the dashboard, " + user.displayName
    : "Unathenticated";

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">{message}</h1>
    </div>
  );
}
