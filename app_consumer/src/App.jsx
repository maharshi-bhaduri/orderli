import React, { useState } from "react";
import Home from "./pages/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Menu from "./pages/Menu";
import SnaqrHome from "./pages/SnaqrHome";
import Feedback from "./pages/Feedback";

import { CartProvider } from "./utils/CartContext";
import Cart from "./pages/Cart";

import ThankYouPage from "./pages/ThankYouPage";
import CustomerOtpVerification from "./pages/CustomerOtpVerification";
import RequireVerification from "./components/RequireVerification";
import { VerificationProvider } from "./utils/VerificationContext";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <VerificationProvider>
        <CartProvider>
          <div className="m-0 p-0 font-poppins">
            {/* <Header /> */}

            <Routes>
              <Route path="/" element={<SnaqrHome />}></Route>
              <Route path="/thank-you" element={<ThankYouPage />}></Route>
              <Route
                path="/:partnerHandle"
                element={
                  <RequireVerification>
                    <Home />
                  </RequireVerification>
                }
              ></Route>
              <Route
                path="/:partnerHandle/verify"
                element={<CustomerOtpVerification />}
              ></Route>

              <Route
                path="/:partnerHandle/reviews"
                element={
                  <RequireVerification>
                    <Feedback />
                  </RequireVerification>
                }
              ></Route>
              <Route
                path="/:partnerHandle/menu"
                element={
                  <RequireVerification>
                    <Menu />
                  </RequireVerification>
                }
              ></Route>
              <Route
                path="/:partnerHandle/cart"
                element={
                  <RequireVerification>
                    <Cart />
                  </RequireVerification>
                }
              ></Route>
              <Route
                path="/:partnerHandle/checkout"
                element={
                  <RequireVerification>
                    <Cart />
                  </RequireVerification>
                }
              ></Route>
              {/* <Route path="/menubackup" element={<MenuBackup />}></Route> */}
            </Routes>
          </div>
        </CartProvider>
      </VerificationProvider>
    </QueryClientProvider>
  );
}
