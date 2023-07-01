import { useEffect, useState } from "react";
import { getAuthToken } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export function useTokenRefresh() {
    let navigate = useNavigate();
    const [token, setToken] = useState(null);

    useEffect(() => {
        getAuthToken()
            .then((res) => {
                console.log("from usetokenrefresh: ", res)
                if (!res) {
                    navigate('/login');
                } else {
                    setToken(res);
                }
            })
            .catch((error) => {
                console.error("Error refreshing token:", error);
                navigate('/login');
            });
    }, []);

    return token;
}
