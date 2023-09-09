import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Menu from "./pages/Menu";
import PlaceHolder from "./pages/PlaceHolder";
import Feedback from "./pages/Feedback";
import MenuBackup from "./pages/MenuBackup";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-0 p-0 font-poppins">
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<PlaceHolder />}></Route>
          <Route path="/:providerHandle" element={<Home />}></Route>
          <Route path="/:providerHandle/reviews" element={<Feedback />}></Route>
          {/* <Route path="/:providerHandle/menu" element={<Menu />}></Route> */}
          <Route path="/:providerHandle/menubackup" element={<MenuBackup />}></Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
