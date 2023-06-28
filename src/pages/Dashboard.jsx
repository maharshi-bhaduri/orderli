import React from "react";

export default function Dashboard(props) {
  const message = props.isAuthed
    ? "Welcome to the dashboard"
    : "Unathenticated";
  return (
    <div className="dashboard">
      <h1 className="dashboard-header">{message}</h1>
    </div>
  );
}
