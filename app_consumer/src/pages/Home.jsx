import { func } from "prop-types";
import React from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export default function Home() {
  const params = useParams();
  const providerHandle = params.providerHandle;
  const navigate = useNavigate();
  function goToMenu() {
    navigate("/displaymenu", { state: { providerHandle: providerHandle } });
  }
  return (
    <div className="consumer-container ">
      <button
        onClick={goToMenu}
        className="order-btn bg-orderlee-primary-100 hover:bg-orange-500  text-white font-bold py-5 px-10 rounded-full"
      >
        ORDER NOW
      </button>
    </div>
  );
}
