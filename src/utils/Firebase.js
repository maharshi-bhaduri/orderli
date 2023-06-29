import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

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

export const signInWithGoogle = function () {
  signInWithPopup(auth, provider)
    .then((res) => {
      console.log(res);
      localStorage.setItem("token", res._tokenResponse.idToken);
      localStorage.setItem("uid", res.user.uid);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const signOutNow = function () {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      console.log("signed out");
    })
    .catch((err) => {
      console.error(err);
    });
};
