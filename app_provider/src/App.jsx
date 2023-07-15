import Home from "./pages/Home";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddProvider from "./pages/AddProvider";
import Provider from "./pages/Provider";
import { AuthProvider } from "./utils/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "react-query";


export default function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            {/* <Route path="/signup" element={<SignUp />}></Route> */}
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/addRestaurant" element={<AddProvider />}></Route>
            <Route path="/login" element={<LogIn />}></Route>
            <Route path="/provider/:providerHandle/*" element={<Provider />}></Route>
            {/* <Route path="/provider/:providerHandle/:selectedPage/*" element={<Provider />}></Route> */}
            {/* <Route path="/provider/:handle/*" element={<Provider />}></Route> */}
            {/* <Route path="/menu/:handle" element={<ProviderMenu />}></Route>
            <Route path="/profile/:handle" element={<ProviderProfile />}></Route> */}
          </Routes>
        </>
      </QueryClientProvider>
    </AuthProvider>
  );
}
