import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { getFeedback } from "../utils/queryService";
import FeedbackCard from "../components/FeedbackCard";
export default function ProviderFeedback() {
  const { providerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(providerHandle);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {!isLoading &&
        feedback.map((feedbackitem, index) => (
          <div key={index}>
            <FeedbackCard
              rating={feedbackitem.rating}
              desc={feedbackitem.feedbackComments}
              createdAt={feedbackitem.createdAt.substring(0, 10)}
            />
          </div>
        ))}
    </div>
  );
}
