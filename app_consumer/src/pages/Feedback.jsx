import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedback } from "../utils/queryService";
import TabGroup from "../components/TabGroup";
import AddReviews from "./AddReviews";
import FeedbackCard from "../components/FeedbackCard";
import SearchService from "../utils/SearchService";
import GraphicButton from "../components/GraphicButton";

import Modal from "../components/Modal";
import Loader from "../components/Loader";
export default function Feedback() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(partnerHandle);
  const [searchText, setSearchText] = React.useState("");
  let filteredItems = [];

  const [isOpen, setIsOpen] = useState();
  function goHome() {
    navigate(`/${partnerHandle}`);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setSearchText(value);
  }

  if (!isLoading) {
    filteredItems = SearchService(searchText, feedback, [
      "feedbackComments",
      "consumerName",
    ]);
  }

  return (
    <>
      <div className="bg-gray-300 flex justify-center pt-2 px-2 h-screen overflow-y-scroll">
        <div className="text-black max-w-2xl w-full">
          <div className="text-black fixed left-1/2 -translate-x-1/2 max-w-2xl w-full">
            <div
              className="rounded-lg bg-white p-2 mx-2 mb-2 flex flex-col
                            justify-center items-center shadow-md"
            >
              <div className="w-full flex text-sm">
                <button
                  className="mr-2 px-2 border border-gray-300 text-gray-500
                    rounded-lg bg-white hover:bg-gray-300 transition ease-in-out"
                  onClick={goHome}
                >
                  Home
                </button>
                <input
                  type="text"
                  value={searchText}
                  placeholder="Search"
                  name="searchText"
                  disabled={isLoading}
                  onChange={handleChange}
                  className="border border-gray-300 px-2 py-2 rounded-lg text-black w-full"
                />
                <button
                  className="ml-2 px-2 border border-gray-300 text-gray-500
                    rounded-lg bg-white hover:bg-gray-300 transition ease-in-out"
                  onClick={() => setIsOpen(true)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          {isOpen && <Modal open={isOpen} onClose={() => setIsOpen(false)} />}
          {/* this is where the refactoring begins */}
          <div className="mt-16 rounded-lg bg-white p-4 items-center shadow-md">
            {isLoading ? (
              <Loader />
            ) : (
              filteredItems &&
              filteredItems.map((feedbackitem, index) => (
                <div key={feedbackitem.feedbackId} className="w-full">
                  <FeedbackCard
                    rating={parseInt(Math.round(feedbackitem.rating))}
                    desc={feedbackitem.feedbackComments}
                    createdAt={feedbackitem.createdAt.substring(0, 10)}
                    by={feedbackitem.consumerName}
                    email={feedbackitem.consumerEmail}
                    phone={feedbackitem.consumerPhone}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
