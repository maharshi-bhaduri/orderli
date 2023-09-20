import React from "react";
import snaqrlogo from "../images/snaqrlogo.jpg";
import backgroundImage from "../images/snaqr_landing.png";
export default function PlaceHolder() {
  return (
    <div
      className="bg-cover bg-center relative min-h-screen "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <header className=" p-4 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* <h1 className="text-white text-2xl font-bold">SnaQR</h1> */}
          <img
            src={snaqrlogo}
            className="logo"
            alt="Vite logo"
            height={150}
            width={150}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className=" text-white py-20 px-4 ">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4">SnaQR </h1>

          <p className="text-lg">Elevate your culinary experience</p>
          <a
            href="#"
            className="bg-white text-blue-500 px-6 py-3 rounded-full mt-6 inline-block hover:bg-black hover:text-white transition duration-300 ease-in-out"
          >
            Learn More
          </a>
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
