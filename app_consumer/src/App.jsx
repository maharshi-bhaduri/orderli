import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import DisplayMenu from "./pages/DisplayMenu";

export default function App() {
  return (
    <>
      {/* <Header /> */}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:providerHandle" element={<Home />}></Route>
        <Route path="/displaymenu" element={<DisplayMenu />}></Route>
      </Routes>
    </>
  );
}
