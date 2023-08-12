import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
export default function Home() {
  const navigate = useNavigate();
  let { providerHandle } = useParams();

  const data = getMenu(providerHandle);
  console.log(data);
  function goToMenu() {
    navigate(`/${providerHandle}/menu`);
  }
  return (
    <>
      <Header />
      <div className="flex h-screen justify-center items-center bg-cover bg-center bg-multiply bg-opacity-10">
        <button
          onClick={goToMenu}
          className="order-btn bg-orderlee-primary-100 hover:bg-orange-500  text-white font-bold py-5 px-10 rounded-full"
        >
          ORDER NOW
        </button>
      </div>
    </>
  );
}
