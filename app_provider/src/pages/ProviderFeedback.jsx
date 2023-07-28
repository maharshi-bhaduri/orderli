import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { getFeedback } from "../utils/queryService";
import FeedbackCard from "../components/FeedbackCard";
export default function ProviderFeedback() {
  const { providerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(providerHandle);

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-4xl font-medium">Customer Feedback</header>
      </div>
      <div
        className={"rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center"}
      >
        {/* </div><div className="max-w-5xl mx-auto mt-12"> */}
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
  );
}
