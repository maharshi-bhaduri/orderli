import Home from "./pages/Home";

import LogIn from "./pages/LogIn";
import { Routes, Route } from "react-router-dom";
import AccountHome from "./pages/AccountHome";
import AddProvider from "./pages/AddProvider";
import Provider from "./pages/Provider";
import { AuthProvider } from "./utils/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeLocalForage } from "./utils/localforageUtils";
import Visuals from "./pages/Visuals";

export default function App() {
  initializeLocalForage();
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/account" element={<AccountHome />}></Route>
            <Route path="/addRestaurant" element={<AddProvider />}></Route>
            <Route path="/login" element={<LogIn />}></Route>
            <Route
              path="/partner/:partnerHandle/*"
              element={<Provider />}
            ></Route>
            <Route path="/visuals/" element={<Visuals />}></Route>
          </Routes>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
