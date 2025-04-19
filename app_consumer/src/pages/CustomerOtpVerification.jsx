import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useVerification } from "../utils/VerificationContext";

export default function CustomerOtpVerification() {
  const { partnerHandle } = useParams();
  const navigate = useNavigate();
  const { markVerified, isVerified } = useVerification();

  useEffect(() => {
    if (isVerified) {
      navigate(`/${partnerHandle}`);
    }
  }, [isVerified, navigate, partnerHandle]);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError("");
    setLoading(true);

    try {
      //   const { data } = await axios.post(import.meta.env.VITE_APP_VERIFY_OTP, {
      //     partnerHandle,
      //     phoneNumber,
      //     otp,
      //   });
      const data = { value: "data", success: true };
      console.log("data success is ", data.success);
      if (data.success) {
        // Mark user verified in context + localStorage
        markVerified(phoneNumber);
        // Redirect to Home (which is protected)

        setTimeout(() => {
          navigate(`/${partnerHandle}/`);
        }, 100);
      } else {
        setError("Invalid OTP or phone number");
      }
    } catch {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-orange-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl mb-4 text-center">Verify Your Phone</h2>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone number"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP"
          className="w-full p-2 mb-3 border rounded"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-orange-400 text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
}
