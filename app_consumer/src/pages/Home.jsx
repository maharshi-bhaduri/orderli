import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
import bg from "../images/cafe_bg.jpg"
export default function Home() {
  const navigate = useNavigate();
  let { providerHandle } = useParams();

  const data = getMenu(providerHandle);
  function goToMenu() {
    navigate(`/${providerHandle}/menu`);
  }
  return (
    <>
      {/* <Header /> */}
      <div className="fixed -z-10 bg-stone-600 opacity-50 blur-sm">
        <img src={bg}
          className="object-cover h-screen"
        />
      </div>
      <div className="flex flex-col h-screen justify-center items-center mx-4">
        <h1 className="text-4xl mb-5">
          Welcome to Cafe Magenta
        </h1>
        <button
          onClick={goToMenu}
          className="mt-10 order-btn bg-black hover:bg-warmGray-800 text-white
          font-bold py-5 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out"
        >
          Menu
        </button>
      </div>
    </>
  );
}
