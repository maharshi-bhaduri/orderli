import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const { partnerHandle } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const storedBill = localStorage.getItem("bill");
    if (storedBill) {
      setBill(JSON.parse(storedBill));
    }
  }, []);

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-orange-300 p-6">
        <p className="text-lg">Loading your bill...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-300 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center font-mono text-sm">
        <h2 className="text-2xl font-semibold mb-4 font-sans">
          Thank you for dining with Snaqr!
        </h2>
        <div className="border-b border-dashed my-4" />

        {/* Bill Items */}
        <div className="text-left">
          {bill.items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>
                {item.quantity} x {item.itemName}
              </span>
              <span>₹{item.itemPrice * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed my-4" />

        {/* Subtotal */}
        <div className="flex justify-between mb-1 font-bold">
          <span>Subtotal</span>
          <span>₹{bill.subTotal.toFixed(2)}</span>
        </div>

        {/* Charges */}
        {bill.charges?.map((charge, idx) => (
          <div key={idx} className="flex justify-between mb-1">
            <span>{charge.label}</span>
            <span>₹{charge.amount.toFixed(2)}</span>
          </div>
        ))}

        {/* Discounts */}
        {bill.discounts?.map((discount, idx) => (
          <div key={idx} className="flex justify-between mb-1 text-green-600">
            <span>{discount.label}</span>
            <span>- ₹{discount.amount.toFixed(2)}</span>
          </div>
        ))}

        <div className="border-b border-dashed my-4" />

        {/* Grand Total */}
        <div className="flex justify-between mb-4 font-bold text-lg">
          <span>Total</span>
          <span>₹{bill.grandTotal.toFixed(2)}</span>
        </div>

        <div className="text-xs text-gray-500 mb-2">
          Taxes included where applicable
        </div>

        {/* UPI Section */}
        <div className="text-center mt-4">
          <p className="text-sm font-medium text-gray-600 mb-1">Pay via UPI</p>

          <div
            className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 
               px-3 py-3 rounded-xl cursor-pointer hover:from-orange-100 hover:to-orange-200 
               transition shadow-md border border-orange-300"
            onClick={() => navigator.clipboard.writeText(bill.upiId)}
          >
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-lg">💸</span>
              <span className="font-mono text-lg font-bold tracking-wide text-gray-900">
                {bill.upiId}
              </span>
            </div>
            <span className="text-orange-700 text-sm font-semibold">Copy</span>
          </div>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
          onClick={() => navigate(`/${partnerHandle}`)}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
