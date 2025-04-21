import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { postService } from "../utils/APIService";
import { useMutation } from "@tanstack/react-query";


export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  let { partnerHandle } = useParams();
  const tableId = localStorage.getItem("tableId");

  const { orders = [] } = location.state || { orders: [] };
  const uniqueOrders = [
    ...new Map(orders.map((order) => [order.menuId, order])).values(),
  ];
  const [feedback, setFeedback] = useState({});
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });
  const handleFeedback = (menuId, value) => {
    setFeedback((prev) => ({ ...prev, [menuId]: value }));
  };
  const { mutate: requestBill } = useMutation(
    (payload) =>
      postService(import.meta.env.VITE_APP_REQUEST_BILL, payload),
    {
      onSuccess: () => {
        console.log("Review posted successfully");
      },
    },
    {
      onError: (error) => {
        console.error(`${error} while submitting data`);
      },
    }
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-300 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          The restaurant is preparing your bill.
        </h2>
        <h3 className="text-lg font-medium mb-2">
          While you wait, we'd like if you can rate us.
        </h3>
        <div className="max-h-[calc(100vh-420px)] overflow-y-scroll border border-gray-300 rounded-lg p-2">
          {uniqueOrders.length > 0 ? (
            uniqueOrders.map((order) => (
              <div
                key={order.orderItemId}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
              >
                <span>{order.itemName}</span>
                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded-full ${feedback[order.menuId] === 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                      }`}
                    onClick={() => handleFeedback(order.menuId, 1)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      thumb_up
                    </span>
                  </button>
                  <button
                    className={`p-2 rounded-full ${feedback[order.menuId] === 0
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                      }`}
                    onClick={() => handleFeedback(order.menuId, 0)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      thumb_down
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>

        {/* Notes Section */}
        <div className="mt-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="3"
            placeholder="Additional feedback..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Feedback Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
          onClick={() => setShowModal(true)}
        >
          Submit Feedback
        </button>
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Your Details (Optional)
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-2"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-2 border rounded mb-2"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  const payload = { feedback, notes, userInfo, tableId };
                  console.log(payload)
                  requestBill(payload);
                  console.log("Feedback Submitted:", payload);
                  setShowModal(false);
                  navigate(`/${partnerHandle}/thank-you`);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
