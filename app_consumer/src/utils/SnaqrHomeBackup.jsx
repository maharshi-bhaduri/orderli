import React, { useState, useEffect } from "react";
import snaqrlogo from "../images/snaqrlogo.jpg";
import heroMainImage from "../images/snaqr_hero_main.png";
import heroImage from "../images/snaqr_hero.png";
import fbicon from "../images/icons8-facebook-24.png";
import igicon from "../images/icons8-instagram-24.png";
import { partnerPortalLink } from "../utils/OptionMap";
import { features } from "../utils/OptionMap";
import { motion, useWillChange } from "framer-motion";
import { InView } from "react-intersection-observer";

export default function PlaceHolder() {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = function () {
    console.log(scrollY);
    if (window.scrollY > 540) setIsSticky(true);
    else setIsSticky(false);
  };

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
        <a
          href={partnerPortalLink}
          className="bg-white text-orange-500 font-bold px-6 py-3 rounded-full inline-block 
            hover:bg-orange-400 hover:text-white transition duration-300 ease-in-out absolute right-6"
        >
          Partner Portal &gt;
        </a>
      </header>

      {/* Hero Section */}

      <div className="hero-bg h-screen w-full absolute -z-10"></div>
      <section className="text-white px-14 h-screen flex flex-wrap w-full">
        <div className="basis-1/3 flex flex-col justify-center items-start">
          <h1
            className={`logo text-8xl text-white font-extrabold drop-shadow-lg mb-16  select-none ${
              isSticky ? "stick" : "nonstick"
            }`}
          >
            snaqr
          </h1>
          <p className="text-lg text-white font-semibold mb-5 drop-shadow-sm">
            Elevate your dining experience
          </p>
          <a
            href="#"
            className="bg-white text-orange-500 font-bold px-6 py-3 rounded-full inline-block 
            hover:bg-orange-400 hover:text-white transition duration-300 ease-in-out"
          >
            Learn More
          </a>
        </div>
        <div className="basis-2/3 flex flex-col justify-center px-10">
          <div className="relative">
            <div
              className="bg-white rounded-lg transition-transform cursor-pointer absolute top-1/2 right-1/2 -translate-y-1/2
              rotate-12 hover:rotate-0 z-10 shadow-md"
            >
              <img
                src="data:image/png;base64,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"
                alt="QR Code"
                className="w-32"
              />
              <h2 className="text-gray-600 flex justify-center rounded-lg bg-gray-100 p-2">
                sample menu
              </h2>
            </div>
            <img src={heroMainImage} className="drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Feature Section */}

      <InView threshold={0.1}>
        {({ ref, inView }) => (
          <motion.section
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`py-12 h-screen `}
          >
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Our Features
              </h2>
              <div className="flex flex-col items-center w-full px-6">
                {features.map((feature, i) => {
                  return (
                    <motion.div
                      key={feature.id}
                      className="bg-orange-100 rounded-lg shadow-lg p-6 mb-6 w-1/2"
                      initial={{ opacity: 0, translateX: -5000, translateY: 0 }}
                      animate={
                        inView
                          ? { opacity: 1, translateX: 50, translateY: 0 }
                          : { opacity: 0, translateX: -5000, translateY: 0 }
                      }
                      transition={{ duration: 1, delay: i * 0.3 }}
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        {feature.title}
                      </h3>
                      <p>{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </InView>
      {/* workflow Section */}
      <section className={`pt-24 flex h-screen`}>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How it works</h2>
          <h1>scan order eat pay</h1>
        </div>
      </section>
      {/* Footer */}
      <section className="flex bg-orange-500 justify-center">
        <footer className="bg-orange-500 text-white">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} SnaQR. All Rights Reserved.
          </div>
          <img src={fbicon} alt="" />
          <img src={igicon} alt="" />
          <span>About us</span>
        </footer>
      </section>
    </div>
  );
}
