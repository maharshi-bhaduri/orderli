import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { postService } from "../utils/APIService";
export default function Modal({ open, onClose }) {
  const { partnerHandle } = useParams();
  const [loading, setLoading] = useState();
  const [reviewInfo, setReviewInfo] = useState({
    partnerHandle,
    consumerName: "",
    consumerEmail: "",
    consumerPhone: "",
    rating: "",
    feedbackComments: "",
  });

  const handleChange = function (event) {
    setReviewInfo((prevReview) => {
      const { name, value } = event.target;
      return {
        ...prevReview,
        [name]: value,
      };
    });
  };

  const { mutate: postReviewData } = useMutation(
    (reviewInfo) => {
      return postService(
        import.meta.env.VITE_APP_ADD_FEEDBACK_CONSUMERS,
        reviewInfo
      );
    },
    {
      onSuccess: () => {
        console.log("Review posted successfully");
        setLoading(false);
        onClose();
      },
    },
    {
      onError: (error) => {
        console.error(`${error} encountered`);
      },
    }
  );

  const handleSubmit = async function (event) {
    console.log("inside handle submit");
    event.preventDefault();
    setLoading(true);
    postReviewData(reviewInfo);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="md:w-2/3 w-full h-2/3 p-6 m-2 bg-white shadow-md rounded-lg overflow-y-scroll">
        <h1 className="text-2xl font-semibold mb-4">Add a Review</h1>
        <form onSubmit={handleSubmit}>
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
              value={reviewInfo.consumerName}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
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
              value={reviewInfo.consumerEmail}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
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
              value={reviewInfo.consumerPhone}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            />
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
              value={reviewInfo.rating}
              onChange={handleChange}
            >
              <option value="">Choose</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
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
              value={reviewInfo.feedbackComments}
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>{" "}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
