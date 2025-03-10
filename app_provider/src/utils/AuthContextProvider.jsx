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
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Add logout flag

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state changes
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isLoggedOut) {
          // Only store token if not logged out
          storeUserToken(user);
        }
        setIsLoggedOut(false);
        setUser(user);
      } else {
        if (!allowedPaths.includes(location.pathname)) {
          navigate("/");
        }
        setUser(null);
        Cookies.remove("token");
      }
    });

    // Listen for token refresh or changes
    const unsubscribeTokenChange = onIdTokenChanged(auth, (user) => {
      if (user) {
        if (!isLoggedOut) {
          console.log(
            "inside ubsub on token change and !isloggedout is",
            !isLoggedOut
          );
          // Only store token if not logged out
          storeUserToken(user);
        }
      }
    });

    return () => {
      unsubscribeAuthState(); // Cleanup auth state listener
      unsubscribeTokenChange(); // Cleanup token change listener
    };
  }, [isLoggedOut]);

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
  const handleLogout = () => {
    setIsLoggedOut(true); // Set logout flag
    Cookies.remove("token");
    localStorage.removeItem("displayName"); // Clear local storage
    setUser(null); // Clear user state
  };
  return (
    <AuthContext.Provider value={{ user, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
