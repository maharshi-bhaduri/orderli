import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedback } from "../utils/queryService";
import AddReviews from "./AddReviews";
import FeedbackCard from "../components/FeedbackCard";
import GraphicButton from "../components/GraphicButton";

import Modal from "../components/Modal";
export default function FeedbackBackup() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  const { data: feedback, isLoading, isError } = getFeedback(partnerHandle);
  const [isOpen, setIsOpen] = useState();

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6 flex justify-between ">
        <header className="text-2xl font-medium">Reviews</header>
        <GraphicButton text="Add Reivew" onClick={() => setIsOpen(true)} />
      </div>
      {isOpen && <Modal open={isOpen} onClose={() => setIsOpen(false)} />}
      <div className="w-5/6 mx-auto mt-8 max-h-[600px] overflow-y-scroll">
        {!isLoading &&
          feedback &&
          feedback.map((feedbackitem, index) => (
            <div key={feedbackitem.feedbackId}>
              <FeedbackCard
                rating={parseInt(Math.round(feedbackitem.rating))}
                desc={feedbackitem.feedbackComments}
                createdAt={feedbackitem.createdAt.substring(0, 10)}
                by={feedbackitem.consumerName}
                email={feedbackitem.consumerEmail}
                phone={feedbackitem.consumerPhone}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
