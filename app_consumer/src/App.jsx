import React, { useState } from "react";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Menu from "./pages/Menu";
import SnaqrHome from "./pages/SnaqrHome";
import Feedback from "./pages/Feedback";
import MenuBackup from "./pages/MenuBackup";
import { CartProvider } from "./utils/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYouPage from "./pages/ThankYouPage";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="m-0 p-0 font-poppins">
          {/* <Header /> */}

          <Routes>
            <Route path="/" element={<SnaqrHome />}></Route>
            <Route path="/thank-you" element={<ThankYouPage />}></Route>
            <Route path="/:partnerHandle" element={<Home />}></Route>
            <Route
              path="/:partnerHandle/reviews"
              element={<Feedback />}
            ></Route>
            <Route path="/:partnerHandle/menu" element={<Menu />}></Route>
            <Route path="/:partnerHandle/cart" element={<Cart />}></Route>
            <Route
              path="/:partnerHandle/checkout"
              element={<Checkout />}
            ></Route>
            {/* <Route path="/menubackup" element={<MenuBackup />}></Route> */}
          </Routes>
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
