import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getFeedback } from "../utils/queryService";
import FeedbackCard from "../components/FeedbackCard";

export default function ProviderFeedback() {
  const { providerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(providerHandle);
  const options = [
    { value: "ratingDescending", label: "High to low rating" },
    { value: "ratingAscending", label: "Low to high rating" },
    { value: "dateDescending", label: "high to low date" },
    { value: "dateAscending", label: "low to high date" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const handleSelectChange = function (event) {
    setSelectedOption(event.target.value);
    console.log(selectedOption);
    feedback.sort((feedback1, feedback2) => {
      switch (selectedOption) {
        case "ratingDescending":
          return feedback2.rating - feedback1.rating;
        case "ratingAscending":
          return feedback1.rating - feedback2.rating;
        case "dateDescending":
          return feedback1.createdAt - feedback2.createdAt;
        case "dateAscending":
          return feedback1.createdAt - feedback2.createdAt;
      }
    });
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
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="max-w-5xl mx-auto mt-8">
          {!isLoading &&
            feedback.map((feedbackitem, index) => (
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
