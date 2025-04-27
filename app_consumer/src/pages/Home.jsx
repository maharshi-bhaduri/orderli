import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient"; // <-- import it at the top

import { useParams, useNavigate } from "react-router-dom";
import {
  getMenu,
  getPartnerDetails,
  getFeedback,
  useVerifyCodeMutation,
} from "../utils/queryService";
import bg from "../images/cafe_bg.jpg";
import instagramIcon from "../images/instagram.png";
import facebookIcon from "../images/facebook.png";
import Loader from "../components/Loader";

export default function Home() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  console.log("partnerhandle", partnerHandle);

  // Fetch menu data and partner details using React Query hooks

  const { data: apiResponse, isLoading } = getPartnerDetails(partnerHandle);

  const [enteredCode, setEnteredCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCode, setShowCode] = useState(false);

  const [codeVerified, setCodeVerified] = useState(() => {
    const stored = localStorage.getItem(`codeVerified${partnerHandle}`);
    return stored === "true";
  });
  const verifyCodeMutation = useVerifyCodeMutation();

  function handleCodeSubmit() {
    verifyCodeMutation.mutate(
      { partnerHandle, code: enteredCode },
      {
        onSuccess: async (response) => {
          console.log(response.data);
          if (response.data.data.verifiedData.verified === true) {
            setCodeVerified(true);
            localStorage.setItem(`codeVerified${partnerHandle}`, "true");
          } else {
            setErrorMessage("Incorrect code. Please try again");
            setTimeout(() => {
              setErrorMessage("");
            }, 3000);
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }
  // Destructure data from the API response
  const partnerDetails = apiResponse?.partnerDetails || {};
  const tableDetails = apiResponse?.tableDetails || {};

  function goToMenu() {
    //console.log("partnerdetails currency", partnerDetails.currency);
    navigate(`/${partnerHandle}/menu`, {
      state: { currency: partnerDetails.currency },
    });
  }

  function goToReviews() {
    navigate(`/${partnerHandle}/reviews`);
  }

  // Identify social media links and corresponding images
  const getSocialMediaLinks = () => {
    if (!partnerDetails.socialLinks) return [];
    const socialLinks = [];
    const { facebook, instagram } = partnerDetails.socialLinks;

    if (facebook) socialLinks.push({ url: facebook, image: facebookIcon });
    if (instagram) socialLinks.push({ url: instagram, image: instagramIcon });

    return socialLinks;
  };

  const socialMediaLinks = getSocialMediaLinks();

  return (
    <div className="bg-orange-300 select-none">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/*
            <div className="fixed -z-10 bg-stone-600 opacity-50 blur-sm w-full">
              <img src={bg} className="object-cover h-screen w-full" />
            </div> 
          */}
          <div className="flex flex-col h-screen justify-center items-center mx-4">
            <div className="mb-5 flex flex-col justify-center items-center">
              {/* Display cafe name */}
              <h1 className="text-4xl mb-5">
                {partnerDetails.name || "Cafe Name"}
              </h1>
              {/* Display cafe description */}
              <p className="text-center mb-4">
                {isLoading
                  ? "Loading description..."
                  : partnerDetails?.about || "Cafe description"}
              </p>
            </div>
            <div
              className="rounded-lg bg-white p-2 m-2 flex flex-col border
                            justify-center items-center shadow-md"
            >
              {/* Display table message */}
              {tableDetails.tableId && (
                <div className="w-full">
                  <p className="mb-2 flex justify-center items-center rounded-lg bg-white border border-orange-300 p-2 w-full">
                    Table:<span className=" ml-2">{tableDetails.tableId}</span>
                  </p>
                  {!codeVerified && (
                    <>
                      <input
                        type="text"
                        placeholder="Enter your code"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-center"
                      />
                      <button
                        className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition"
                        onClick={handleCodeSubmit}
                      >
                        Submit Code
                      </button>
                    </>
                  )}
                </div>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {codeVerified && (
                <div className="w-full flex flex-col items-center text-sm">
                  <div className="w-full flex h-10 justify-center mb-2">
                    <button
                      className="px-2 first:mr-2 border border-gray-300 text-gray-500 flex-grow
          rounded-lg bg-white hover:bg-gray-300 transition ease-in-out relative"
                      onClick={goToReviews}
                    >
                      Reviews
                    </button>
                    <button
                      className="px-2 first:mr-2 border border-orange-400 text-white flex-grow
          rounded-lg bg-orange-300 hover:bg-gray-300 transition ease-in-out"
                      onClick={goToMenu}
                    >
                      Menu
                    </button>
                  </div>

                  {/* --- New Toggle for Show/Hide Check-in Code --- */}
                  {enteredCode && (
                    <div className="w-full flex flex-col items-center">
                      <button
                        onClick={() => setShowCode(!showCode)}
                        className="mt-2 text-orange-500 text-xs underline hover:text-orange-700 transition"
                      >
                        {showCode ? "Hide Check-In Code" : "Show Check-In Code"}
                      </button>
                      {showCode && (
                        <div className="mt-2 px-4 py-2 bg-white border border-orange-300 rounded-lg text-gray-700">
                          {enteredCode}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Conditionally render social media links */}
            {socialMediaLinks.length > 0 && (
              <div className="fixed bottom-10">
                <div className="rounded-full bg-white/20 flex">
                  {socialMediaLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p
                        className="text-sm 
                          transition-all ease-in-out duration-300 p-2 flex items-center opacity-70 hover:opacity-100"
                      >
                        <img
                          src={link.image}
                          alt="social icon"
                          className="w-[35px] h-[35px]"
                        />
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
