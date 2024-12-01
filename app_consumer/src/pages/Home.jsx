import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu, getPartnerDetails } from "../utils/queryService";
import bg from "../images/cafe_bg.jpg";
import instagramIcon from "../images/instagram.png";
import facebookIcon from "../images/facebook.png";
import Loader from "../components/Loader";

export default function Home() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  if (partnerHandle) localStorage.setItem("partnerHandle", partnerHandle);

  // Fetch menu data and partner details using React Query hooks
  const { data: menuData } = getMenu(partnerHandle);
  const { data: partnerDetails, isLoading } = getPartnerDetails(partnerHandle);

  function goToMenu() {
    navigate(`/${partnerHandle}/menu`);
  }

  function goToReviews() {
    navigate(`/${partnerHandle}/reviews`);
  }

  // Identify social media links and corresponding images
  const getSocialMediaLinks = () => {
    if (!partnerDetails || !partnerDetails.socialLinks) return [];
    const socialLinks = [];
    const { facebook, instagram } = partnerDetails.socialLinks;

    if (facebook) socialLinks.push({ url: facebook, image: facebookIcon });
    if (instagram) socialLinks.push({ url: instagram, image: instagramIcon });

    return socialLinks;
  };

  const socialMediaLinks = getSocialMediaLinks();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="fixed -z-10 bg-stone-600 opacity-50 blur-sm w-full">
            <img src={bg} className="object-cover h-screen w-full" />
          </div>
          <div className="flex flex-col h-screen justify-center items-center mx-4">
            <div className="mb-5 flex flex-col justify-center items-center">
              <h1 className="text-4xl mb-5">
                {isLoading ? "Loading..." : partnerDetails?.name || "Cafe Name"}
              </h1>
              <p className="text-center mb-4">
                {isLoading
                  ? "Loading description..."
                  : partnerDetails?.about || "Cafe description"}
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
    </>
  );
}
