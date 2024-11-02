import React, { useState } from "react";
import AddReviews from "./pages/AddReviews";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Menu from "./pages/Menu";
import PlaceHolder from "./pages/PlaceHolder";
import SnaqrHome from "./pages/SnaqrHome";
import Feedback from "./pages/Feedback";
import MenuBackup from "./pages/MenuBackup";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-0 p-0 font-poppins">
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<SnaqrHome />}></Route>
          <Route path="/:partnerHandle" element={<Home />}></Route>
          <Route path="/:partnerHandle/reviews" element={<Feedback />}></Route>
          <Route path="/:partnerHandle/menu" element={<Menu />}></Route>
          <Route path="/menubackup" element={<MenuBackup />}></Route>
          <Route
            path="/:partnerHandle/addReview"
            element={<AddReviews />}
          ></Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
