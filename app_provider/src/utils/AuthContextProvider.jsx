import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
                navigate('/login');
            }
        });
        return () => unsubscribe(); // Unsubscribe from the auth state changes when component unmounts
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
