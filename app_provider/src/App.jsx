import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Signup from "./pages/SignUp";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Dashboard from "./pages/Dashboard";
import AddProvider from "./pages/AddProvider";
import Provider from "./pages/Provider";


export default function App() {
  const [user, setUser] = useState(null);
  const [providerData, setProviderData] = useState({})

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      setUser(user);
    });
  }, [user]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* <Route path="/signup" element={<SignUp />}></Route> */}
        <Route
          path="/dashboard"
          element={<Dashboard isAuthed={!!user} />}
        ></Route>
        <Route path="/addRestaurant" element={<AddProvider onAdd={setProviderData} />}></Route>
        <Route path="/signUp" element={<Signup />}></Route>
        <Route path="/*" element={<Provider data={providerData} />}></Route>
      </Routes>
    </>
  );
}
