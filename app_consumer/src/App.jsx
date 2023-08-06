import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import DisplayMenu from "./pages/DisplayMenu";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient} className="m-0 p-0 font-poppins">
      <>
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:providerHandle" element={<Home />}></Route>
          <Route
            path="/:providerHandle/displaymenu"
            element={<DisplayMenu />}
          ></Route>
        </Routes>
      </>
    </QueryClientProvider>
  );
}
