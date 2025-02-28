import { useState, useEffect } from "react";
import { AnimatePresence, sync } from "framer-motion";
import Dropdown from "../components/Dropdown";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import FeedbackCard from "../components/FeedbackCard";
import { useParams } from "react-router-dom";
import { getFeedback } from "../utils/queryService";
import GraphicButton from "../components/GraphicButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../utils/APIService";

export default function ProviderFeedback() {
  const [tab, setTab] = useState("Approved"); // Tracks the active tab
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [modalContent, setModalContent] = useState(null); // Tracks modal content
  const [feedbackApproved, setFeedbackApproved] = useState([]); // Approved reviews
  const [feedbackRequested, setFeedbackRequested] = useState([]); // Requested reviews

  // const [initialFeedbackApproved, setInitialFeedbackApproved] = useState([]);
  // const [initialFeedbackRequested, setInitialFeedbackRequested] = useState([]);
  const [syncState, setSyncState] = useState("synced"); // 'synced', 'sync', 'syncing'
  const [approveList, setApproveList] = useState([]);
  const [deleteList, setDeleteList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Rating High to Low"); // Sort options
  const { partnerHandle } = useParams();
  const queryClient = useQueryClient();

  const { data: feedback, isLoading, isError } = getFeedback(partnerHandle);
  useEffect(() => {
    console.log(
      "running fetch feedback and isLoading is",
      isLoading,
      " feedback is ",
      feedback
    );
    if (!isLoading && feedback) {
      const approved = feedback.filter((item) => item.isApproved == 1);
      const requested = feedback.filter((item) => item.isApproved == 0);
      setFeedbackApproved(approved);
      setFeedbackRequested(requested);
      setSyncState("synced");
    }
  }, [isLoading, feedback]);

  useEffect(() => {
    const isChanged = approveList.length > 0 || deleteList.length > 0;
    console.log("approve list length", approveList.length);
    console.log("deletelist length", deleteList.length);
    console.log("is changed", isChanged);
    setSyncState(isChanged ? "sync" : "synced");
  }, [feedbackApproved, feedbackRequested]);

  const { mutate: saveFeedbackData, isLoading: isSaving } = useMutation(
    (data) =>
      postService(import.meta.env.VITE_APP_UPDATE_FEEDBACK_PARTNER, data),
    {
      onSuccess: () => {
        console.log("Feedback successfully updated");
        queryClient.invalidateQueries(["feedback", partnerHandle]);
        setSyncState("synced");
        setDeleteList([]);
        setApproveList([]);
      },
    },
    {
      onError: (err) => console.error("Error updating feedbacks", err),
    }
  );
  const currentFeedback =
    tab === "Approved" ? feedbackApproved : feedbackRequested;
  const addToApproveList = (feedbackId) => {
    setApproveList((oldList) => [...oldList, feedbackId]);
  };
  const addToDeleteList = (feedbackId) => {
    setDeleteList((oldList) => [...oldList, feedbackId]);
  };
  const handleSync = async () => {
    setSyncState("syncing");
    const payload = { approveList, deleteList };

    saveFeedbackData(payload);
    // call db to make db changes
  };
  // Sorting options
  const options = {
    ratingDescending: "Rating High to Low",
    ratingAscending: "Rating Low to High",
    dateAscending: "Date Old to New",
    dateDescending: "Date New to Old",
  };

  // Handle actions for the Requested tab
  const handleApprove = (review) => {
    setFeedbackApproved((prevApproved) => [...prevApproved, review]);
    setFeedbackRequested((prevRequested) =>
      prevRequested.filter((item) => item.feedbackId !== review.feedbackId)
    );
    addToApproveList(review.feedbackId);
  };

  const handleReject = (feedbackId) => {
    setFeedbackRequested(
      feedbackRequested.filter((item) => item.feedbackId !== feedbackId)
    );
    addToDeleteList(feedbackId);
  };

  // Handle delete action in the Approved tab
  const handleDelete = (feedbackId) => {
    setFeedbackApproved(
      feedbackApproved.filter((item) => item.feedbackId !== feedbackId)
    );
    addToDeleteList(feedbackId);
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };
  return (
    <div className="w-full px-4 flex flex-col items-center">
      {/* Approved and Requested  */}
      <div className="flex justify-between w-full">
        <div className="flex space-x-4 my-4">
          <button
            className={`px-4 py-2 rounded ${
              tab === "Approved" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("Approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tab === "Requested" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("Requested")}
          >
            Requested
          </button>
        </div>
        <div className="w-auto flex items-center ">
          {syncState === "syncing" && (
            <GraphicButton buttonStyle="bluefill" disabled={true}>
              Syncing
              <span className="ml-2 relative flex justify-center items-center w-full h-full">
                <span className="w-3/ h-3/4 border-8 border-solid border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></span>
              </span>
            </GraphicButton>
          )}
          {syncState === "sync" && (
            <GraphicButton
              buttonStyle="bluefill"
              onClick={handleSync}
              disabled={false}
            >
              Sync
            </GraphicButton>
          )}
          {syncState === "synced" && (
            <GraphicButton buttonStyle="greenline" onClick={""} disabled={true}>
              Synced
              <span className="material-symbols-outlined ml-2">
                check_circle
              </span>
            </GraphicButton>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white w-full transition ease-in-out flex flex-col items-center">
        {/* Rating dropdown */}
        <div className="w-full mb-4 z-50">
          <Dropdown
            selectedOption={selectedOption}
            handleSelectChange={(value) => setSelectedOption(value)}
            options={Object.values(options)}
          />
        </div>

        <div className="w-full mx-auto mt-8 max-h-[600px] overflow-y-scroll">
          {isLoading ? (
            <Loader />
          ) : currentFeedback.length === 0 ? (
            <div className="text-gray-500">No reviews available.</div>
          ) : (
            <AnimatePresence>
              {currentFeedback
                .sort((a, b) => {
                  switch (selectedOption) {
                    case options.ratingDescending:
                      return b.rating - a.rating;
                    case options.ratingAscending:
                      return a.rating - b.rating;
                    case options.dateDescending:
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    case options.dateAscending:
                      return new Date(a.createdAt) - new Date(b.createdAt);
                    default:
                      return 0;
                  }
                })
                .map((review) => (
                  <FeedbackCard
                    key={review.feedbackId}
                    review={review}
                    tab={tab}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    onDetails={openModal}
                  />
                ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={closeModal}>
        <h2 className="text-xl font-medium mb-4">Review Details</h2>
        <p className="text-gray-700">{modalContent}</p>
      </Modal>
    </div>
  );
}
