import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const allowedPaths = ["/"];

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state changes
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        storeUserToken(user);
      } else {
        if (!allowedPaths.includes(location.pathname)) {
          navigate("/login");
        }
        setUser(null);
        Cookies.remove("token");
      }
    });

    // Listen for token refresh or changes
    const unsubscribeTokenChange = onIdTokenChanged(auth, (user) => {
      if (user) {
        storeUserToken(user);
      }
    });

    return () => {
      unsubscribeAuthState(); // Cleanup auth state listener
      unsubscribeTokenChange(); // Cleanup token change listener
    };
  }, []);

  // Function to store token and user details
  const storeUserToken = (user) => {
    localStorage.setItem("displayName", user.displayName);
    user
      .getIdToken(true)
      .then((token) => {
        Cookies.set("token", token, { secure: true }); // Secure cookies for production
      })
      .catch((error) => {
        console.error("Error fetching token:", error);
      });
  };

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
