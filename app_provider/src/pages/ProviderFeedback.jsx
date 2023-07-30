import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getFeedback } from "../utils/queryService";
import FeedbackCard from "../components/FeedbackCard";

export default function ProviderFeedback() {
  const { providerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(providerHandle);
  const options = [
    { value: "ratingDescending", label: "Rating: Descending" },
    { value: "ratingAscending", label: "Rating: Ascending" },
    { value: "dateDescending", label: "Date: Descending" },
    { value: "dateAscending", label: "Date: Ascending" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const handleSelectChange = function (event) {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-4xl font-medium">Customer Feedback</header>
      </div>
      <div
        className={
          "rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center"
        }
      >
        <div>
          <label htmlFor="dropdown">Sort by:</label>
          <select
            id="dropdown"
            value={selectedOption}
            onChange={handleSelectChange}
            className="w-40"
          >
            <option value="">Select an option</option>
            {options.map((option) => {
              return (
                <option
                  key={option.value}
                  value={option.value}
                  className="">
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="max-w-5xl mx-auto mt-8">
          {!isLoading &&
            feedback.sort((feedback1, feedback2) => {
              switch (selectedOption) {
                case "ratingDescending":
                  return feedback2.rating - feedback1.rating;
                case "ratingAscending":
                  return feedback1.rating - feedback2.rating;
                case "dateDescending":
                  return new Date(feedback2.createdAt) - new Date(feedback1.createdAt);
                case "dateAscending":
                  return new Date(feedback1.createdAt) - new Date(feedback2.createdAt);
              }
            }).map((feedbackitem, index) => (
              <div key={index}>
                <FeedbackCard
                  rating={parseInt(Math.round(feedbackitem.rating))}
                  desc={feedbackitem.feedbackComments}
                  createdAt={feedbackitem.createdAt.substring(0, 10)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
