import React from "react";
import googleLogo from "../icons/google.png";
import snaqrBrandBold from "../images/snaqr_brand_b.png";
import { signInWithGoogle, signOutNow } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  let navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      signInWithGoogle().then((user) => {
        navigate("/account");
      });
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-16 flex flex-col items-center">
          <img
            src={snaqrBrandBold}
            href={"#"}
            className="h-40 w-auto cursor-pointer"
          />
          <p className="flex text-xl ">for partners</p>
        </div>
        <button
          onClick={handleSignIn}
          className="mt-10 border-2 border-solid border-orderlee-primary-100 bg-orange-300 hover:bg-orange-500 text-white font-bold py-5 px-10 rounded-full"
        >
          Login with
          <img
            src={googleLogo}
            alt="metamask"
            className=" ml-4 h-6 w-6 inline"
          />
        </button>
      </div>
    </div>
  );
}
