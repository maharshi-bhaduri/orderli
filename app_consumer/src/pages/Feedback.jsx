import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedback } from "../utils/queryService";

import FeedbackCard from "../components/FeedbackCard";
import SearchService from "../utils/SearchService";
import Modal from "../components/Modal";
import { useMutation } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { postService } from "../utils/APIService";
export default function Feedback() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(partnerHandle);
  const [searchText, setSearchText] = React.useState("");
  let filteredItems = [];

  const initialReviewState = {
    partnerHandle,
    consumerName: "",
    consumerEmail: "",
    consumerPhone: "",
    rating: "",
    feedbackComments: "",
  };

  const initialErrorState = useState({
    consumerName: "",
    consumerEmail: "",
    consumerPhone: "",
    rating: "",
    feedbackComments: "",
  });

  const [review, setReview] = useState(initialReviewState);
  const [errors, setErrors] = useState(initialErrorState);
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((oldReview) => ({ ...oldReview, [name]: value }));

    let error = "";
    if (name === "consumerName" && value.trim() === "") {
      error = "Name is required";
    } else if (
      name === "consumerEmail" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Enter a valid email address.";
    } else if (name === "consumerPhone" && !/^\d{10}$/.test(value)) {
      error = "Phone number must be 10 digits.";
    } else if (name === "rating" && value === "") {
      error = "Please select a rating.";
    } else if (name === "feedbackComments" && value.trim().length < 10) {
      error = "Comments must be at least 10 characters long.";
    }
    setErrors((prevErrors) => {
      return { ...prevErrors, [name]: error };
    });
  };

  const { mutate: postReview } = useMutation(
    (review) =>
      postService(import.meta.env.VITE_APP_ADD_FEEDBACK_CONSUMERS, review),
    {
      onSuccess: () => {
        console.log("Review posted successfully");
      },
    },
    {
      onError: (error) => {
        console.error(`${error} while posting review`);
      },
    }
  );

  const handleReviewSubmit = async function () {
    const newErrors = {};
    if (review.consumerName.trim() === "")
      newErrors.consumerName = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.consumerEmail))
      newErrors.consumerEmail = "Enter a valid email address.";
    if (!/^\d{10}$/.test(review.consumerPhone))
      newErrors.consumerPhone = "Phone number must be 10 digits.";
    if (review.rating === "") newErrors.rating = "Please select a rating.";
    if (review.feedbackComments.trim().length < 10)
      newErrors.feedbackComments =
        "Comments must be at least 10 characters long.";

    setErrors(newErrors);
    showAlert(newErrors);
    if (Object.keys(newErrors).length === 0) {
      postReview(review);
      setReview([]);
    }
  };

  const showAlert = (errorObject) => {
    //takes in a object parameters and prints it
    let errorString = "";
    Object.entries(errorObject).forEach(([key, value]) => {
      errorString = errorString + `${key}:${value}` + "\n";
    });
    window.alert(errorString);
  };
  const handleReviewClose = () => {
    setIsOpen(false);
    setReview(initialReviewState);
    setErrors(initialErrorState);
  };

  const [isOpen, setIsOpen] = useState();
  function goHome() {
    navigate(`/${partnerHandle}`);
  }
  function handleSearchChange(e) {
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
      <div className="bg-orange-300 flex justify-center pt-2 px-2 h-screen overflow-y-scroll">
        <div className="text-black max-w-2xl w-full">
          <div className="text-black fixed left-1/2 -translate-x-1/2 max-w-2xl w-full">
            <div
              className="rounded-lg border bg-white p-2 mx-2 mb-2 flex flex-col
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
                  onChange={handleSearchChange}
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
          {/* {isOpen && <Modal open={isOpen} onClose={() => setIsOpen(false)} />} */}
          {isOpen && (
            <Modal
              open={isOpen}
              onClose={handleReviewClose}
              onSubmit={handleReviewSubmit}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="consumerName"
                  value={review.consumerName}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleReviewChange}
                />
                {errors.consumerName && (
                  <p className="text-red-500 text-sm">{errors.consumerName}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="consumerEmail"
                  value={review.consumerEmail}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleReviewChange}
                />
                {errors.consumerEmail && (
                  <p className="text-red-500 text-sm">{errors.consumerEmail}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="consumerPhone"
                  value={review.consumerPhone}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleReviewChange}
                />
                {errors.consumerPhone && (
                  <p className="text-red-500 text-sm">{errors.consumerPhone}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={review.rating}
                  onChange={handleReviewChange}
                >
                  <option value="">Choose</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                {errors.rating && (
                  <p className="text-red-500 text-sm">{errors.rating}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comments
                </label>
                <textarea
                  id="comments"
                  name="feedbackComments"
                  rows="4"
                  value={review.feedbackComments}
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={handleReviewChange}
                ></textarea>
                {errors.feedbackComments && (
                  <p className="text-red-500 text-sm">
                    {errors.feedbackComments}
                  </p>
                )}
              </div>
            </Modal>
          )}

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
