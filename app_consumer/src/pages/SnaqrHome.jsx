import React, { useState, useEffect } from "react";
import heroMainImage from "../images/snaqr_hero_main.png";
import snaqrLogo from "../images/snaqr_logo_s.png";
import snaqrBrand from "../images/snaqr_brand.png";
import snaqrBrandBold from "../images/snaqr_brand_b.png";
import snaqrBrandTrans from "../images/snaqr_brand_trans.png";
import snaqrBrandTransQR from "../images/snaqr_brand_trans_qr.png";
import heroImage from "../images/snaqr_hero.png";
import fbicon from "../images/icons8-facebook-24.png";
import igicon from "../images/icons8-instagram-24.png";
import { partnerPortalLink } from "../utils/OptionMap";
import { partner_features } from "../utils/OptionMap";
import { consumer_features } from "../utils/OptionMap";
import image1 from "../images/img1.jpg";
import image2 from "../images/img2.jpg";
import image3 from "../images/img3.jpg";
import image4 from "../images/img4.jpg";

export default function PlaceHolder() {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {}, []);

  const handleScroll = function () {
    console.log(scrollY);
    if (window.scrollY > 500) setIsSticky(true);
    else setIsSticky(false);
  };

  return (
    <div>
      {/* Header */}
      <header className="p-4 fixed w-full z-50 h-20">
        <div className="container flex justify-between items-center h-full w-full">
          <a className="flex flex-grow items-center h-full ">
            <img
              src={snaqrBrandBold}
              href={"#"}
              alt="Hero Main"
              className="drop-shadow-lg rounded-full h-auto w-auto max-h-full max-w-full cursor-pointer"
            />
          </a>
          <a
            href={partnerPortalLink}
            className="bg-white text-orange-500 font-bold px-6 py-3 rounded-full inline-block 
            hover:bg-orange-400 hover:text-white transition duration-300 ease-in-out absolute right-4
            drop-shadow-lg"
          >
            Partner Portal &gt;
          </a>
        </div>
      </header>

      {/* Background */}
      <div className="hero-bg h-screen w-full absolute -z-10"></div>

      {/* Hero Section */}
      <section className="flex flex-col pt-20 md:px-10 md:flex-row h-screen overflow-hidden">
        {/* Group 1: Brandname, Tagline, and Link */}
        <div className="flex flex-col justify-center sm:mb-10 md:w-1/2 px-10">
          <h1 className="text-4xl md:text-6xl text-white font-extrabold drop-shadow-lg mt-10 sm:mt-0 select-none md:text-left text-center">
            Scan.
            <br />
            Order.
            <br />
            Eat.
          </h1>
          <p className="text-xl text-white font-normal my-8 drop-shadow-md text-center md:text-left">
            Elevate your dining experience
          </p>
          <div className="flex justify-center md:justify-start">
            <a
              href="#"
              className="bg-white text-orange-500 font-bold px-6 py-3 rounded-full inline-block 
          hover:bg-orange-400 hover:text-white ease-in-out mt-4"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="w-full flex flex-grow items-center">
          <img
            src={heroMainImage}
            alt="Hero Main"
            className="drop-shadow-lg object-contain h-auto md:h-full"
          />
        </div>
      </section>

      <section className="container mx-auto p-6 space-y-12">
        {/* Row 1: Text on the left, Image on the right, subtle skew left */}
        <div className="flex flex-col md:flex-row items-center pt-12">
          <div className="w-full md:w-1/2 text-left md:pr-6 space-y-2">
            <h2 className="text-2xl font-bold mb-2">Your Personalized Space</h2>
            <p className="text-gray-700">
              Here's where you, our partners, get to put out their identity and
              establish their image
            </p>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0 transform skew-y-6">
            <img
              src={image1}
              alt="Image for Row 1"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Row 2: Image on the left, Text on the right, subtle skew right */}
        <div className="flex flex-col md:flex-row items-center pt-12">
          <div className="w-full md:w-1/2 mt-4 md:mt-0 order-2 md:order-1 transform -skew-y-6">
            <img
              src={image2}
              alt="Image for Row 2"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-6 order-1 md:order-2 space-y-2">
            <h2 className="text-2xl font-bold mb-2">
              Dyanamic Interactive Menus
            </h2>
            <p className="text-gray-700">
              Here's to making life easier for you, our customers, to navigate
              through the menus
            </p>
          </div>
        </div>

        {/* Row 3: Text on the left, Image on the right, subtle skew left */}
        <div className="flex flex-col md:flex-row items-center pt-12">
          <div className="w-full md:w-1/2 text-left md:pr-6 space-y-2">
            <h2 className="text-2xl font-bold mb-2">
              Digital Account Management
            </h2>
            <p className="text-gray-700">
              A complete solution for our partners to manage their account,
              profile and more!
            </p>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0 transform skew-y-6">
            <img
              src={image4}
              alt="Image for Row 3"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      {/* Feature Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center my-20">
            Why restaurants
            <br />
            ❤️ us
          </h2>
          <div className="flex flex-wrap justify-center">
            {partner_features.map((feature, i) => (
              <div
                key={feature.id}
                className="flex-shrink-0 border rounded-lg shadow-lg mb-6 mx-4 
                w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4 overflow-hidden"
              >
                <div className="h-48 overflow-hidden flex items-center">
                  <img src={feature.src} className="w-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="mb-36">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center my-20">
            Why customers
            <br />
            ❤️ us
          </h2>
          <div className="flex flex-wrap justify-center">
            {consumer_features.map((feature, i) => (
              <div
                key={feature.id}
                className="flex-shrink-0 border rounded-lg shadow-lg p-6 mb-6 mx-4 w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="flex bg-orange-400 justify-center h-auto py-20">
        <footer className="flex text-white w-full items-center px-10 sm:px-20">
          <img
            src={snaqrBrandTrans}
            href={"#"}
            alt="Hero Main"
            className="rounded-full w-32 sm:w-52"
          />
          <div className="flex-grow">
            <div className="text-center">
              <a href={partnerPortalLink}>Partner Portal</a>
            </div>
            <div className="container mx-auto text-center mt-8">
              &copy; {new Date().getFullYear()} Snaqr
              <br />
              All Rights Reserved
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
