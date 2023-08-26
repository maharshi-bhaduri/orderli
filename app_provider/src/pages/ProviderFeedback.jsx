import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getFeedback } from "../utils/queryService";
import FeedbackCard from "../components/FeedbackCard";
import Dropdown from "../components/Dropdown";
import { motion } from "framer-motion";

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
  const handleSelectChange = function (value) {
    setSelectedOption(value);
  };
  console.log(feedback);

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-2xl font-medium">Customer Feedback</header>
      </div>
      <div
        className={
          "rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center "
        }
      >
        <Dropdown
          selectedOption={selectedOption}
          handleSelectChange={handleSelectChange}
          options={options}
        />
        <div className="w-5/6 mx-auto mt-8 max-h-[600px] overflow-y-scroll">
          {!isLoading &&
            feedback &&
            feedback
              .sort((feedback1, feedback2) => {
                switch (selectedOption) {
                  case "ratingDescending":
                    return feedback2.rating - feedback1.rating;
                  case "ratingAscending":
                    return feedback1.rating - feedback2.rating;
                  case "dateDescending":
                    return (
                      new Date(feedback2.createdAt) -
                      new Date(feedback1.createdAt)
                    );
                  case "dateAscending":
                    return (
                      new Date(feedback1.createdAt) -
                      new Date(feedback2.createdAt)
                    );
                }
              })
              .map((feedbackitem, index) => (
                <motion.div
                  key={feedbackitem.feedbackId}
                  layout
                  layoutId={index}
                >
                  <FeedbackCard
                    rating={parseInt(Math.round(feedbackitem.rating))}
                    desc={feedbackitem.feedbackComments}
                    createdAt={feedbackitem.createdAt.substring(0, 10)}
                    by={feedbackitem.consumerName}
                    email={feedbackitem.consumerEmail}
                    phone={feedbackitem.consumerPhone}
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
