import React from "react";
import snaqrlogo from "../images/snaqrlogo.jpg";
import heroMainImage from "../images/snaqr_hero_main.png";
import heroImage from "../images/snaqr_hero.png";
export default function PlaceHolder() {
  return (
    <div>
      {/* Header */}
      <header className=" p-4 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* <h1 className="text-white text-2xl font-bold">SnaQR</h1> */}
          {/* <img
            src={snaqrlogo}
            className="logo"
            alt="Vite logo"
            height={150}
            width={150}
          /> */}
        </div>
      </header>

      {/* Hero Section */}
      {/* <div className="bg-cover bg-center relative h-screen "
        style={{ backgroundImage: `url(${backgroundImage})` }}> */}
      <div className="hero-bg h-screen w-full absolute -z-10"></div>
      <section className="text-white px-14 h-screen flex flex-wrap w-full">

        <div className="w-1/3 flex flex-col h-full justify-center">
          <h1 className="text-8xl text-white font-extrabold drop-shadow-lg mb-10">
            snaqr
          </h1>
          <p className="text-lg">Elevate your culinary experience</p>
          <a
            href="#"
            className="bg-white text-blue-500 px-6 py-3 rounded-full mt-6 inline-block hover:bg-black hover:text-white transition duration-300 ease-in-out"
          >
            Learn More
          </a>
        </div>
        <div className="w-2/3 flex flex-col h-full justify-center px-10">
          <img
            src={heroMainImage}
            className="drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
          <div className="flex">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Convenient</h3>
              <p>
                Offering a hassle free experience to browse menu, place orders &
                pay directly
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Contactless</h3>
              <p>
                Order without a touch, but with tons of flavor. Safe, seamless,
                and scrumptious
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Accurate</h3>
              <p>
                No more waiter mix-ups. No human hiccups, just perfect orders.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Trackable</h3>
              <p>Know your food's journey, from the kitchen to your plate.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Green</h3>
              <p>Say goodbye to paper menus. Dine sustainably.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className=" py-12 flex">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How it works</h2>
          <p>{"scan -> order -> eat -> pay"}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white py-6">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} SnaQR. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
