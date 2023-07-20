import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const allowedPaths = ['/'];

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem('displayName', user.displayName);
                setUser(user);
                user.getIdToken().then(
                    (token) => {
                        Cookies.set('token', token)
                    }
                )
            }
            else {
                if (!allowedPaths.includes(location.pathname)) {
                    navigate('/login');
                }
            }
        });

        return () => unsubscribe(); // Unsubscribe from the auth state changes when component unmounts
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
