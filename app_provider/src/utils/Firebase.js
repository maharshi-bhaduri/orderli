import { initializeApp } from "firebase/app";
import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Cookies from "js-cookie";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithPopup(auth, provider)
    .then((res) => {
      Cookies.set("token", res._tokenResponse.idToken);
      Cookies.set("uid", res.user.uid);
      localStorage.setItem("user", res.user);
      console.log(res.user);
      if (localStorage.getItem("partnerId")) {
        localStorage.clear("partnerId");
      }
      return res.user;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function signOutNow() {
  signOut(auth)
    .then(() => {
      Cookies.remove("token");
      Cookies.remove("uid");
      localStorage.clear();
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getAuthToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  try {
    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return false;
  }
}
