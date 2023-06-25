import React from "react";
import SignUp from "./pages1/SignUp";
import Home from "./pages1/Home";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </>
  );
}
