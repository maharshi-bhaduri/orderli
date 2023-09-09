import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../utils/queryService";
import bg from "../images/cafe_bg.jpg";
import instagram from "../images/instagram.png";
import facebook from "../images/facebook.png";
export default function Home() {
  const navigate = useNavigate();
  let { providerHandle } = useParams();

  const data = getMenu(providerHandle);
  function goToMenu() {
    navigate(`/${providerHandle}/menu`);
  }

  function goToReviews() {
    navigate(`/${providerHandle}/reviews`);
  }
  return (
    <>
      {/* <Header /> */}
      <div className="fixed -z-10 bg-stone-600 opacity-50 blur-sm w-full">
        <img src={bg} className="object-cover h-screen w-full" />
      </div>
      <div className="flex flex-col h-screen justify-center items-center mx-4">
        <div className="mb-5 flex flex-col justify-center items-center">
          <h1 className="text-4xl mb-5">Cafe Magenta</h1>
          <p className="text-center mb-4">
            Join us for heartwarming breakfasts and soul-sweetening treats. Your
            cozy corner for indulgence.
          </p>
        </div>
        <button
          onClick={goToMenu}
          className="mt-10 order-btn bg-black hover:bg-warmGray-800 text-white
          font-bold py-5 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out"
        >
          Menu
        </button>
        <button
          onClick={goToReviews}
          className="mt-10 order-btn bg-black hover:bg-warmGray-800 text-white
          font-bold py-5 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out"
        >
          Reviews
        </button>
        <div className="fixed bottom-10">
          <div className="rounded-full bg-white/20 flex">
            <a href="https://www.instagram.com/themagentacafe">
              <p
                className="text-sm 
                          transition-all ease-in-out duration-300 p-2 flex items-center opacity-70 hover:opacity-100"
              >
                <img src={instagram} className="w-[35px] h-[35px]" />
              </p>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61550546901072">
              <p
                className="text-sm
                          transition-all ease-in-out duration-300 p-2 flex items-center opacity-70 hover:opacity-100"
              >
                <img src={facebook} className="w-[35px] h-[35px]" />
              </p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
