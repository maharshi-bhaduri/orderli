import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import GraphicButton from "../components/GraphicButton";
import formatDate from "../utils/formatDate.js";

export default function FeedbackCard({
  review,
  tab,
  onApprove,
  onReject,
  onDelete,
  onDetails,
}) {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu options
  const menuRef = useRef(null);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const formattedDate = formatDate(review.createdAt.substring(0, 10));
  //close the menu if clicked outside of the buttons
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleActionClick = (action) => {
    setMenuOpen(false); // Close the menu
    if (action === "Approve" && onApprove) onApprove(review);
    if (action === "Reject" && onReject) onReject(review.feedbackId);
    if (action === "Delete" && onDelete) onDelete(review.feedbackId);
  };
  // Render stars dynamically based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`material-symbols-outlined text-xl ${
            i < rating ? "text-yellow-500" : "text-gray-300"
          } `}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {i < rating ? "star" : "star_outline"}
        </span>
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="flex justify-between items-center p-2 m-2 border-b rounded-sm relative bg-gray-50 hover:bg-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Review column */}
      <div className="w-3/5">
        <strong>{review.consumerName}</strong>

        <span className="text-sm pl-4">{formattedDate}</span>
        <p className="text-gray-500 text-sm truncate">
          {review.feedbackComments}
        </p>
      </div>

      {/* Rating */}
      <div className="w-1/5 text-center">{renderStars(review.rating)}</div>

      {/* View Details button */}
      <div className="w-1/5 text-center">
        <GraphicButton
          text="View Details"
          buttonStyle="default"
          onClick={() => onDetails(review.feedbackComments)}
        />
      </div>

      {/* Action column */}
      <div className="relative w-1/10 flex justify-center" ref={menuRef}>
        {/* Three-dot menu */}
        <button
          className="w-8 h-8 flex justify-center items-center rounded border bg-white shadow-sm hover:bg-gray-100"
          onClick={handleMenuToggle}
        >
          <span className="material-symbols-outlined text-xl text-gray-500 hover:text-gray-700">
            more_vert
          </span>
        </button>

        {/* Dropdown actions */}
        {menuOpen && (
          <div className="absolute right-0 bg-white shadow-md border rounded w-40 z-10">
            {tab === "Requested" ? (
              <>
                <button
                  className="w-full px-4 py-2 text-green-500 hover:bg-gray-100"
                  onClick={() => handleActionClick("Approve")}
                >
                  Approve
                </button>
                <button
                  className="w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={() => handleActionClick("Reject")}
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                className="w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => handleActionClick("Delete")}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
