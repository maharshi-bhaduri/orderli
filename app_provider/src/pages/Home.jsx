import React from "react";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="home mx-10 my-28 ">
      <Header />
      FOR PROVIDERS ONLY
      <div className="container">
        <button className="order-btn bg-orderlee-primary-100 hover:bg-orange-500  text-white font-bold py-5 px-10 rounded-full">
          ORDER NOW
        </button>
      </div>
    </div>
  );
}
