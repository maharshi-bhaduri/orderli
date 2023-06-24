import React from "react";
import Header from "../Header";
export default function Home() {
  return (
    <div className="home">
      <Header />
      <div className="container">
        <button className="order-btn bg-orderlee-primary-100 hover:bg-orange-500  text-white font-bold py-5 px-10 rounded-full">
          ORDER NOW
        </button>
      </div>
    </div>
  );
}
