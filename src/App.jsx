import React from "react";
import Header from "./Header/Header";
import SignUp from "./Pages/Signup/SignUp";
import Home from "./Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
    </Routes>
  );
}
