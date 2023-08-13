import React from "react";
import BorderedPallete from "../components/BorderedPallete";

export default function PlaceHolder() {
  return <div className="bg-orange-300 h-screen w-full p-4 flex justify-center items-center">
    <div className="md:w-1/2 sm:w-full">
      <BorderedPallete type="notify">
        <div className="w-full flex flex-col justify-center items-center">
          <p className="text-center mb-4">👋🏽 Hi there!</p>
          <p className="text-center mb-4">You've been given access to an alpha version of this app 📱</p>
          <p className="text-center mb-4">If you have any questions about the app please reach out to
            the developer who sent you this pre-released version! 🙂</p>
        </div>
      </BorderedPallete>
    </div>
  </div>;
}
